import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { Language, UserSettings, Attachment, Source } from "../types";

// --- Configuration ---
// For Vercel/Vite, we use process.env.API_KEY which is defined in vite.config.ts
const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API Key is missing! Please set API_KEY in your Vercel Project Settings.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy_key" });

// --- Audio Helper Functions (Live API) ---
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string; mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Text Generation Service ---

export const generateLegalResponse = async (
  prompt: string,
  attachment: Attachment | undefined,
  language: Language,
  settings: UserSettings,
  chatHistory: string,
  additionalContext: string = ""
): Promise<{ text: string, sources: Source[] }> => {
  
  // 1. Classification & Clarification Check
  const articleRegex = /(?:modda|article|статья)\s*\d+/i;
  const codeRegex = /(?:kodeks|code|кодекс)/i;
  
  if (articleRegex.test(prompt) && !codeRegex.test(prompt) && settings.clarifyingQuestions) {
     let q = "Which code is it? (Family, Criminal, Civil, etc.)";
     if (language === Language.UZ) q = "Bu qaysi kodeks? (Oila, Jinoyat, Fuqarolik va h.k.)";
     if (language === Language.RU) q = "О каком кодексе идет речь? (Семейный, Уголовный, Гражданский и т.д.)";
     return { text: q, sources: [] };
  }

  // 2. Construct System Instruction with ZERO HALLUCINATION PROTOCOL & LANGUAGE ENFORCEMENT
  
  const toneInstruction = settings.tone === 'Professional' 
    ? "Adopt a formal, authoritative, and precise legal tone."
    : "Adopt a clear, accessible, and reassuring tone. Explain legal concepts in plain language.";

  const lengthInstruction = settings.answerLength === 'Short'
    ? "Keep the response concise and direct."
    : "Provide a comprehensive explanation.";

  const styleInstruction = settings.outputStyle === 'Step-by-step'
    ? "Structure the 'Action Plan' as a numbered sequential list."
    : "Use clear bullet points.";

  // Language specific structure labels to prevent English leaks
  let structureLabels = "";
  let languageDirective = "";

  if (language === Language.UZ) {
      languageDirective = "CRITICAL: You MUST answer in O'zbek language (Uzbek). DO NOT write introductory sentences in English like 'Here is the legal advice'. Start directly with the Uzbek content. DO NOT translate headers into English.";
      structureLabels = `
      Use ONLY these Uzbek headers for sections:
      ### **Xulosa**
      (Write summary here in Uzbek)
      
      ### **Qonuniy Asoslar**
      (List laws here in Uzbek, e.g., "Oila Kodeksi, 15-modda")

      ### **Tushuntirish**
      (Detailed explanation in Uzbek)

      ### **Harakatlar rejasi**
      (Action plan in Uzbek)`;
  } else if (language === Language.RU) {
      languageDirective = "CRITICAL: You MUST answer in Russian language. DO NOT write introductory sentences in English. Start directly with the Russian content.";
      structureLabels = `
      Use ONLY these Russian headers:
      ### **Резюме**
      
      ### **Законодательная база**

      ### **Разъяснение**

      ### **План действий**`;
  } else {
      languageDirective = "Answer in English.";
      structureLabels = `
      Use these headers:
      ### **Summary**
      ### **According to Law**
      ### **Explanation**
      ### **Action Plan**`;
  }

  const systemInstruction = `
    You are LAWIFY, the official AI legal consultant for Uzbekistan.
    Current Language Mode: ${language.toUpperCase()}.
    
    ${languageDirective}

    YOUR MISSION:
    Provide legal advice ONLY based on facts found on 'lex.uz' and 'norma.uz'.

    USER PREFERENCES:
    - ${toneInstruction}
    - ${lengthInstruction}
    - ${styleInstruction}

    STRICT RULES (ZERO HALLUCINATION PROTOCOL):
    1. **SEARCH IS MANDATORY:** You MUST perform a Google Search for every single query using 'site:lex.uz'.
    2. **COMPREHENSIVE CITATION:** If multiple laws apply, you MUST list ALL of them in the "According to Law" section.
    3. **OFFICIAL SOURCES ONLY:** Do not invent laws. If you cannot find it on lex.uz, say so.
    4. **CITATION FORMAT:** Always cite the Code Name and Article Number (e.g., "Oila Kodeksi, 15-modda").
    5. **NO CONVERSATIONAL FILLER:** Do not start with "Sure, here is the advice". Start directly with the **Summary** section header.

    RESPONSE STRUCTURE:
    ${structureLabels}
  `;

  // 3. Call Gemini with Google Search Tool
  try {
    // POWER MOVE: We inject "site:lex.uz" into the user prompt to force the search engine 
    // to restrict results to the official government database.
    
    let searchContext = "";
    if (!prompt && attachment?.mimeType.startsWith('audio/')) {
        // If it's an audio message with no text, ask the model to process audio
        searchContext = `Listen to the attached audio to understand the user's legal question. Then, search specifically using "site:lex.uz OR site:norma.uz" for relevant legislation. Find relevant Articles (modda). Explain the findings in ${language}.`;
    } else {
        searchContext = `Search specifically using "site:lex.uz OR site:norma.uz" for legislation regarding: "${prompt}". Find relevant Articles (modda). Explain the findings in ${language}.`;
    }

    const parts: any[] = [{ text: searchContext }];
    
    // Inject History and Context if available to improve understanding
    if (chatHistory) {
        parts.push({ text: `[SYSTEM: The following is the conversation history. Use it to understand context, but prioritize the new query. Do not repeat old answers.]\n${chatHistory}` });
    }

    if (additionalContext) {
        parts.push({ text: `[SYSTEM: Additional User Context (e.g. Profile info): ${additionalContext}]` });
    }
    
    if (attachment) {
      if (attachment.mimeType === "application/pdf" || attachment.mimeType.startsWith("image/") || attachment.mimeType.startsWith("audio/")) {
        parts.push({
          inlineData: {
            mimeType: attachment.mimeType,
            data: attachment.data 
          }
        });
      } else {
        parts.push({
          text: `[SYSTEM: User attached file "${attachment.name}". Use this as context.]`
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        // ENABLE GOOGLE SEARCH TOOL
        tools: [{ googleSearch: {} }], 
        thinkingConfig: { thinkingBudget: 2048 }, 
      }
    });

    const text = response.text || "I apologize, but I could not generate a response at this time.";
    
    // Extract Grounding Metadata (Sources)
    const sources: Source[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    return { text, sources };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error connecting to legal services. Please check connection.", sources: [] };
  }
};

// --- TTS Service ---
export const textToSpeech = async (text: string): Promise<AudioBuffer | null> => {
    try {
        const cleanText = text.replace(/[*#]/g, '');
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            ctx,
            24000,
            1,
        );
        return audioBuffer;
    } catch (e) {
        console.error("TTS Error", e);
        return null;
    }
}

// --- Live API Service ---
export class LiveSessionManager {
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private sources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private scriptProcessor: ScriptProcessorNode | null = null;

  constructor(
      private onStatusChange: (connected: boolean, speaking: boolean) => void,
      private onError: (error: string) => void
  ) {}

  async start(language: Language) {
    try {
        // Ensure media devices are supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("Audio input is not supported in this browser environment.");
        }

        this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
        this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        
        const outputNode = this.outputAudioContext.createGain();
        outputNode.connect(this.outputAudioContext.destination);

        let stream: MediaStream;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (error: any) {
            console.error("Microphone access error:", error);
            throw new Error(error.message || "Microphone permission denied or device not found.");
        }

        let sysInstruction = "You are LAWIFY, a legal assistant for Uzbekistan. Speak strictly in " + language + ". Use concise answers. ALWAYS Search for answers on lex.uz first.";
        
        this.sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-12-2025',
            callbacks: {
                onopen: () => {
                    this.onStatusChange(true, false);
                    
                    if (!this.inputAudioContext) return;
                    const source = this.inputAudioContext.createMediaStreamSource(stream);
                    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);
                    
                    this.scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        this.sessionPromise?.then(session => {
                            session.sendRealtimeInput({ media: pcmBlob });
                        });
                    };
                    
                    source.connect(this.scriptProcessor);
                    this.scriptProcessor.connect(this.inputAudioContext.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    
                    if (base64Audio && this.outputAudioContext) {
                        this.onStatusChange(true, true); 
                        
                        this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
                        
                        const audioBuffer = await decodeAudioData(
                            decode(base64Audio),
                            this.outputAudioContext,
                            24000,
                            1
                        );
                        
                        const source = this.outputAudioContext.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(outputNode);
                        source.addEventListener('ended', () => {
                             this.sources.delete(source);
                             if (this.sources.size === 0) {
                                 this.onStatusChange(true, false); 
                             }
                        });
                        
                        source.start(this.nextStartTime);
                        this.nextStartTime += audioBuffer.duration;
                        this.sources.add(source);
                    }

                    if (message.serverContent?.interrupted) {
                         this.stopAudioOutput();
                    }
                },
                onclose: () => {
                    this.onStatusChange(false, false);
                },
                onerror: (e) => {
                    console.error("Live API Error", e);
                    this.onError("Connection error");
                    this.onStatusChange(false, false);
                }
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
                },
                systemInstruction: sysInstruction,
                tools: [{ googleSearch: {} }],
            }
        });
    } catch (err: any) {
        this.stop(); 
        this.onError(err.message);
    }
  }

  stopAudioOutput() {
      this.sources.forEach(s => s.stop());
      this.sources.clear();
      this.nextStartTime = 0;
  }

  async stop() {
      this.stopAudioOutput();
      
      if (this.scriptProcessor) {
          this.scriptProcessor.disconnect();
          this.scriptProcessor = null;
      }
      
      if (this.inputAudioContext) {
          if (this.inputAudioContext.state !== 'closed') {
             await this.inputAudioContext.close();
          }
          this.inputAudioContext = null;
      }
      
      if (this.outputAudioContext) {
          if (this.outputAudioContext.state !== 'closed') {
             await this.outputAudioContext.close();
          }
          this.outputAudioContext = null;
      }
      
      if (this.sessionPromise) {
          const sessionPromise = this.sessionPromise;
          this.sessionPromise = null;
          try {
            const session = await sessionPromise;
            session.close();
          } catch(e) {
          }
      }
      this.onStatusChange(false, false);
  }
}