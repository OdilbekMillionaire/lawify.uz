
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, UserSettings, Attachment, Source, GeneratedDocument, DrafterResponse } from "../types";
import { LEGAL_TEMPLATES } from "../data/legal_templates";

// --- AUDIO HELPERS ---
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

// --- INITIALIZE AI CLIENT ---
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing. Please check your .env file.");
    throw new Error("API Key Missing");
  }
  return new GoogleGenAI({ apiKey });
};

// --- RETRY HELPER ---
const retry = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw err;
  }
};

// --- CLIENT-SIDE LOGIC IMPLEMENTATIONS ---

export const verifyPaymentScreenshot = async (base64Image: string, expectedAmount: string) => {
  try {
    const ai = getAIClient();
    const cleanAmount = parseInt(expectedAmount.replace(/\D/g, ''), 10);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
          { text: `Check if this is a valid Uzbekistan banking receipt (Click/Payme) for amount >= ${cleanAmount}. Return JSON: { "verified": boolean, "reason": "string" }` }
        ]
      }
    });

    let resultText = response.text || "{}";
    resultText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(resultText);
  } catch (e) {
    console.error("Payment Verification Error", e);
    return { verified: false, reason: "Connection failed" };
  }
};

export const verifyLegalAdvice = async (originalPrompt: string, aiResponse: string, language: string) => {
  try {
    const ai = getAIClient();
    const systemInstruction = `
      You are a Senior Legal Auditor for Uzbekistan Law.
      Language: ${language}.
      
      YOUR TASK:
      1. Review the "Original User Question" and the "AI's Advice".
      2. Verify the legal accuracy of the advice against "lex.uz" using Google Search.
      3. Identify if any laws mentioned are outdated, repealed, or misinterpreted.
      4. Provide a "Verification Report".
      
      OUTPUT FORMAT:
      If correct: "✅ **VERIFIED:** The advice accurately reflects [Law Name]."
      If partial: "⚠️ **WARNING:** The advice is mostly correct but missed [Details]."
      If incorrect: "❌ **CORRECTION:** The advice quoted an old law. The current law is [New Law]."
      
      Be strict. Use Google Search to double-check every article number mentioned.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Always use Pro for verification
      contents: {
        role: 'user',
        parts: [
          { text: `[Original User Question]: ${originalPrompt}` },
          { text: `[AI's Advice to Verify]: ${aiResponse}` },
          { text: `Please audit this advice.` }
        ]
      },
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 2048 } // High budget for deep auditing
      }
    });

    return response.text || "Verification failed.";
  } catch (e) {
    console.error("Verification Error", e);
    return "Verification system unavailable (Client Error).";
  }
};

export const generateOdilbekResponse = async (prompt: string, language: Language, chatHistory: string, legalContext: string) => {
    try {
        const ai = getAIClient();
        const systemInstruction = `
            You are Odilbek, a friendly legal translator for common people in Uzbekistan.
            Language: ${language}.
            
            YOUR MISSION: 
            The user will provide complex legal advice. 
            Your job is to "translate" this into simple, everyday language.

            VISUAL STYLE & FORMATTING:
            - Use **BOLD** for key legal terms and important points.
            - Use > Blockquotes for summarizing the "Main Point".
            - Use clear HEADERS (like ### Tushuntirish) to structure your answer.
            - Use lists (-) to break down steps.
            - Make the response look clean, organized, and eye-appealing.

            STEPS:
            1. Scan for Legal Terms.
            2. Explain them with simple analogies (e.g. "Sud buyrug'i is like an express ticket").
            3. Simplify the main advice into a step-by-step guide.
            4. Provide a practical summary.
            
            Tone: Friendly, supportive, "aka" (big brother) style.
            Legal Context Provided: ${legalContext}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: {
                role: 'user',
                parts: [
                    { text: `[Chat History]\n${chatHistory}` },
                    { text: `[User Question/Context]: ${prompt}` }
                ]
            },
            config: { systemInstruction }
        });

        return response.text || "Uzr, tushuna olmadim.";
    } catch (e) {
        console.error("Odilbek Error", e);
        return "Connection Error";
    }
};

export const generateLegalResponse = async (
  prompt: string,
  attachment: Attachment | undefined,
  language: Language,
  settings: UserSettings,
  chatHistory: string,
  additionalContext: string = "",
  isPro: boolean = false
): Promise<{ text: string, sources: Source[] }> => {
  const ai = getAIClient();

  // 1. Language & Structure Config
  let structureLabels = "";
  let languageDirective = "";

  if (language === 'uz') {
      languageDirective = "CRITICAL: You MUST answer in O'zbek language (Uzbek). DO NOT write introductory sentences in English.";
      structureLabels = `Use ONLY these Uzbek headers: ### **Xulosa**, ### **Qonuniy Asoslar**, ### **Tushuntirish**, ### **Harakatlar rejasi**`;
  } else if (language === 'ru') {
      languageDirective = "CRITICAL: You MUST answer in Russian language.";
      structureLabels = `Use ONLY these Russian headers: ### **Резюме**, ### **Законодательная база**, ### **Разъяснение**, ### **План действий**`;
  } else {
      languageDirective = "Answer in English.";
      structureLabels = `Use these headers: ### **Summary**, ### **According to Law**, ### **Explanation**, ### **Action Plan**`;
  }

  const baseSystemInstruction = `
    You are LAWIFY, the official AI legal consultant for Uzbekistan.
    Current Language Mode: ${language.toUpperCase()}.
    ${languageDirective}
    
    USER SETTINGS:
    - Tone: ${settings.tone}
    - Length: ${settings.answerLength}
    
    RESPONSE STRUCTURE:
    ${structureLabels}
  `;

  // 2. Construct Input Parts & Improve Search Query
  // The issue with "No response generated" is often a weak search query. We enhance it here.
  let searchContext = "";
  if (attachment?.mimeType?.startsWith('audio/')) {
      searchContext = `Listen to the attached audio. Search for the legal issues mentioned on "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
  } else {
      // ENHANCED QUERY: We append context to ensure Google Search finds the law, not just a definition.
      // This increases the hit rate for short prompts like "Aliment" -> "Aliment undirish tartibi O'zbekiston qonunchiligi lex.uz"
      const enhancedQuery = `${prompt} O'zbekiston qonunchiligi lex.uz`;
      searchContext = `Search specifically for the following query on 'site:lex.uz' or 'site:norma.uz': "${enhancedQuery}". Base your answer ONLY on the search results. Explain in ${language}.`;
  }

  const parts: any[] = [{ text: searchContext }];
  if (chatHistory) parts.push({ text: `[Chat History]\n${chatHistory}` });
  if (additionalContext) parts.push({ text: `[User Profile]\n${additionalContext}` });
  
  if (attachment) {
      parts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data 
        }
      });
  }

  // --- STRICT RAG EXECUTION (No Fallback to Hallucination) ---
  try {
    const modelName = isPro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    
    // WRAP IN RETRY LOGIC TO PREVENT RANDOM FAILURES
    const response = await retry(async () => {
        return await ai.models.generateContent({
          model: modelName,
          contents: { role: 'user', parts: parts },
          config: {
            systemInstruction: baseSystemInstruction + `\n*** ZERO HALLUCINATION PROTOCOL ***\n1. You MUST use the Google Search tool.\n2. You MUST cite "lex.uz" or "norma.uz" sources.\n3. If you cannot find a law in the search results, DO NOT INVENT ONE. State: "I could not find the specific official document."`,
            tools: [{ googleSearch: {} }], 
            thinkingConfig: isPro ? { thinkingBudget: 1024 } : undefined
          }
        });
    }, 2, 1000); // Retry 2 times with 1s delay

    const text = response.text;
    const sources: Source[] = [];
    
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    if (text && text.trim().length > 0) {
        return { text, sources };
    }
    
    // STRICT MODE: If text is empty, it means Search failed to ground the response.
    // We return a safe error message instead of hallucinating.
    const safeErrorMsg = language === 'uz' 
        ? "Kechirasiz, rasmiy manbalardan (Lex.uz) ushbu savol bo'yicha aniq ma'lumot topilmadi. Iltimos, savolni aniqroq bering." 
        : "Sorry, no official data found on Lex.uz for this specific query. Please refine your question.";
        
    return { text: safeErrorMsg, sources: [] };

  } catch (e: any) {
    console.error("Legal Generation Error:", e);
    return { 
        text: language === 'uz' ? "Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring." : "System error. Please try again later.", 
        sources: [] 
    };
  }
};

export const generateArticleCommentary = async (
  lawName: string,
  articleNumber: string,
  language: Language
): Promise<{ text: string; sources: Source[] }> => {
  try {
    const ai = getAIClient();

    const langDir =
      language === Language.UZ
        ? "Javobni O'ZBEK TILIDA yozing. Rasmiy-huquqiy uslubdan foydalaning. Barcha matnni o'zbek tilida yozing."
        : language === Language.RU
        ? "Пишите ответ НА РУССКОМ ЯЗЫКЕ. Используйте официально-правовой стиль."
        : "Write the entire answer in ENGLISH. Use formal legal language.";

    const h = {
      article:    language === Language.UZ ? "Rasmiy Modda Matni"       : language === Language.RU ? "Официальный Текст Статьи"    : "Official Article Text",
      analysis:   language === Language.UZ ? "Modda Tahlili"            : language === Language.RU ? "Анализ Статьи"               : "Article Analysis",
      official:   language === Language.UZ ? "Rasmiy Sharhlar"          : language === Language.RU ? "Официальные Комментарии"     : "Official Commentary",
      related:    language === Language.UZ ? "Bog'liq Moddalar"         : language === Language.RU ? "Связанные Статьи"            : "Related Articles",
      practical:  language === Language.UZ ? "Amaliy Qo'llanma"        : language === Language.RU ? "Практическое Руководство"    : "Practical Guidance",
    };

    const systemInstruction = `
You are a senior legal scholar and official legal commentator specializing in the laws of Uzbekistan (O'zbekiston qonunchiligi). Your commentary is published in authoritative legal journals and referenced by courts.

${langDir}

CRITICAL FORMATTING RULES — STRICTLY ENFORCE:
- DO NOT use any markdown formatting: no asterisks (*), no double asterisks (**), no hash symbols (#), no backticks (\`), no underscores for emphasis.
- DO NOT use "**bold**" syntax anywhere in the output body.
- For emphasis, simply write the important term normally — the reader will understand from context.
- Use plain numbered lists (1., 2., 3.) and plain dashes (-) for bullet points.
- Use SECTION TAGS to delimit sections. Each section MUST start with [SECTION:emoji:Title] on its own line and end with [/SECTION] on its own line.

YOUR MANDATORY TASK:
The user provides a law/code name and article number. Execute these steps:
1. SEARCH lex.uz and norma.uz for the EXACT CURRENT text of the specified article.
2. If the article has been amended, note the latest amendment date.
3. Write a thorough multi-section commentary (minimum 500 words total across all sections).
4. NEVER fabricate article text. If you truly cannot find it, state which source was searched and why it may not be found.

OUTPUT FORMAT — use exactly these section tags:

[SECTION:📋:${h.article}]
Write the COMPLETE verbatim text of the article as found on lex.uz or norma.uz. Include every paragraph, sub-clause, and numbered item. If the article has multiple parts, list them all. State the source URL at the end of this section.
[/SECTION]

[SECTION:🔍:${h.analysis}]
Provide a detailed clause-by-clause legal analysis. For each paragraph or sub-clause of the article:
- Explain the legal meaning and scope
- Identify the subjects of the legal relationship (who is bound, who has rights)
- Note any legal conditions, thresholds, or deadlines
- Point out exceptions or special cases
- Reference any judicial practice or legal doctrine applicable in Uzbekistan
This section must be at minimum 200 words.
[/SECTION]

[SECTION:📚:${h.official}]
Provide official and doctrinal commentary on this article:
- Reference any official commentary books or publications on this law (e.g., "O'zbekiston Respublikasi Mehnat Kodeksiga Sharhlar" or similar)
- Note any positions of the Supreme Court of Uzbekistan or Constitutional Court regarding this article
- Reference legal doctrine (huquqiy ta'limot) from Uzbek and Soviet-era legal scholarship if relevant
- If no official commentary exists, provide a scholarly analysis referencing comparable norms in CIS countries
[/SECTION]

[SECTION:🔗:${h.related}]
List all directly related articles:
- Other articles in the same code that must be read together with this article
- Articles in other laws that supplement or interact with this article
- Any presidential decrees or government resolutions that specify procedures under this article
Format: "Article [N] of [Law Name] — [brief explanation of the connection]"
[/SECTION]

[SECTION:⚡:${h.practical}]
Provide concrete step-by-step practical guidance for citizens, businesses, and lawyers:
- What rights does this article grant, and how to exercise them
- What obligations does it impose, and what are the consequences of violation
- Deadlines and procedural steps to follow
- Practical examples of real-world application
- Common mistakes to avoid
- Which government body or court handles disputes under this article
This section must be at minimum 150 words.
[/SECTION]

ACCURACY RULES:
- Ground every statement in the official sources found via web search.
- If you find the article text, cite the exact lex.uz URL.
- If the article number in the current law differs from the user's input (due to renumbering), note both numbers.
- Write in a professional, authoritative tone. Avoid speculative language.
    `;

    const searchQuery =
      language === Language.UZ
        ? `${lawName} ${articleNumber}-modda rasmiy matni lex.uz norma.uz O'zbekiston`
        : language === Language.RU
        ? `${lawName} статья ${articleNumber} официальный текст lex.uz norma.uz Узбекистан`
        : `${lawName} article ${articleNumber} official text lex.uz Uzbekistan law`;

    const response = await retry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          role: 'user',
          parts: [{
            text: `Provide a full legal commentary on: ${lawName}, ${articleNumber}-modda.\n\nSearch these sources: lex.uz, norma.uz, zakon.uz\nSearch query: ${searchQuery}\n\nFollow the output format with [SECTION] tags exactly as instructed.`
          }],
        },
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      });
    }, 2, 1000);

    let text = response.text || '';

    // Safety net: strip any stray markdown symbols from body text
    // (preserve SECTION tags which use [ ] not markdown)
    text = text
      .replace(/(?<!\[SECTION[^\]]*\])(?<!\[\/SECTION\])\*\*/g, '')
      .replace(/(?<!\[SECTION[^\]]*\])(?<!\[\/SECTION\])\*/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`/g, '');

    const sources: Source[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    if (!text || text.trim().length === 0) {
      const errMsg =
        language === Language.UZ
          ? "Kechirasiz, bu modda lex.uz'da topilmadi. Qonun nomini to'liq va to'g'ri kiriting."
          : language === Language.RU
          ? "Извините, статья не найдена на lex.uz. Укажите полное и корректное название закона."
          : "Sorry, this article was not found on lex.uz. Please provide the full and correct law name.";
      return { text: errMsg, sources: [] };
    }

    return { text, sources };
  } catch (e) {
    console.error("Article Commentary Error:", e);
    const errMsg =
      language === Language.UZ
        ? "Tizimda xatolik yuz berdi. Qaytadan urinib ko'ring."
        : language === Language.RU
        ? "Произошла системная ошибка. Попробуйте снова."
        : "A system error occurred. Please try again.";
    return { text: errMsg, sources: [] };
  }
};

export const draftDocument = async (
    prompt: string,
    currentDocument: GeneratedDocument,
    language: Language,
    docType: string
): Promise<DrafterResponse | null> => {
    try {
        // 1. INSTANT TEMPLATE CHECK
        if (LEGAL_TEMPLATES[prompt]) {
            const template = LEGAL_TEMPLATES[prompt];
            
            let introMsg = "Official template loaded. I need some details to fill it out.";
            if (language === 'uz') introMsg = "Rasmiy sud hujjati andozasi yuklandi. Uni to'ldirish uchun sizdan ba'zi ma'lumotlarni so'rashim kerak. Masalan: Da'vogarning to'liq ismi kim?";
            if (language === 'ru') introMsg = "Официальный шаблон загружен. Мне нужны детали. Например: Как зовут Истца?";

            return {
                chatResponse: introMsg,
                documentUpdate: template
            };
        }

        // 2. AI Generation
        const ai = getAIClient();

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            chatResponse: {
              type: Type.STRING,
              description: "The AI asking specific questions to fill placeholders (e.g., 'Please provide the Plaintiff's Passport Number').",
            },
            documentUpdate: {
              type: Type.OBJECT,
              description: "The updated document JSON.",
              properties: {
                title: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      heading: { type: Type.STRING, description: "Clause title" },
                      content: { type: Type.STRING, description: "Legal text content with placeholders filled." }
                    }
                  }
                },
                isComplete: { type: Type.BOOLEAN, description: "True if all placeholders like [Name], [Date] are filled." }
              }
            }
          }
        };

        const systemInstruction = `
          You are 'AI Kotib' (AI Legal Drafter) for Uzbekistan.
          Current Language: ${language}.
          
          TASK: Conduct a step-by-step interview to fill an Official Legal Document.
          
          PROCESS:
          1. Look at 'Current Document State'. Identify placeholders like [Da'vogar F.I.O], [Pasport], [Sana], [Summa].
          2. Ask the user ONE or TWO simple questions at a time to get this info.
          3. When the user answers (e.g., "My name is Alisher"), REPLACE the placeholder [Da'vogar F.I.O] with "Alisher" in the JSON.
          4. Do NOT rewrite the whole legal text unless necessary. Just fill the gaps.
          5. Keep the legal tone formal (Rasmiy uslub).
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
            role: 'user',
            parts: [
              { text: `Current Document State (JSON): ${JSON.stringify(currentDocument)}` },
              { text: `User Input: ${prompt}` }
            ]
          },
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        });

        let jsonStr = response.text || "{}";
        jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '');
        return JSON.parse(jsonStr);

    } catch (e) {
        console.error("Drafting Error", e);
        return null;
    }
};

export const textToSpeech = async (text: string): Promise<AudioBuffer | null> => {
    try {
        const ai = getAIClient();
        const cleanText = text.replace(/[*#]/g, '').slice(0, 500); 

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        return await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
    } catch (e) {
        console.error("TTS Error", e);
        return null;
    }
}

// --- SECURE TURN-BASED LIVE SESSION MANAGER ---
export class LiveSessionManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private onStatusChange: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void;
  private onError: (error: string) => void;
  private language: Language = Language.UZ;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private active: boolean = false;

  constructor(
    onStatusChange: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void,
    onError: (error: string) => void
  ) {
    this.onStatusChange = onStatusChange;
    this.onError = onError;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
  }

  async start(language: Language) {
    this.language = language;
    this.active = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => this.handleRecordingStop();
        
        this.startRecording();
    } catch (err) {
        this.onError("Microphone access denied.");
        this.stop();
    }
  }

  startRecording() {
      if (!this.mediaRecorder || !this.active) return;
      this.audioChunks = [];
      this.mediaRecorder.start();
      this.onStatusChange('listening');
  }

  stopRecordingAndProcess() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
          this.onStatusChange('processing');
      }
  }

  private async handleRecordingStop() {
      if (!this.active) return;

      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          await this.processUserAudio(base64String);
      };
      
      reader.readAsDataURL(audioBlob);
  }

  private async processUserAudio(base64Audio: string) {
      try {
          const { text } = await generateLegalResponse(
              "", 
              { name: 'voice.webm', mimeType: 'audio/webm', data: base64Audio },
              this.language,
              { answerLength: 'Short', tone: 'Simple', outputStyle: 'Paragraphs', clarifyingQuestions: false, documentType: 'General', perspective: 'Neutral' },
              "", 
              "This is a spoken conversation. Keep answers brief.",
              true 
          );

          const audioBuffer = await textToSpeech(text);

          if (audioBuffer && this.audioContext && this.active) {
              this.onStatusChange('speaking');
              this.currentSource = this.audioContext.createBufferSource();
              this.currentSource.buffer = audioBuffer;
              this.currentSource.connect(this.audioContext.destination);
              
              this.currentSource.onended = () => {
                  if (this.active) {
                      setTimeout(() => this.startRecording(), 500);
                  }
              };
              
              this.currentSource.start();
          } else {
               if (this.active) this.startRecording();
          }

      } catch (err) {
          console.error(err);
          this.onError("Connection error");
          if (this.active) setTimeout(() => this.startRecording(), 2000);
      }
  }

  stop() {
    this.active = false;
    if (this.mediaRecorder) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (this.currentSource) {
        this.currentSource.stop();
    }
    this.onStatusChange('idle');
  }
}
