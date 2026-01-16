
import { Language, UserSettings, Attachment, Source } from "../types";

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

// --- SECURE API CALLS ---
// These functions now call your Vercel Backend (/api/...) instead of Google directly.

export const verifyPaymentScreenshot = async (base64Image: string, expectedAmount: string) => {
  try {
    const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ base64Image, expectedAmount })
    });
    return await res.json();
  } catch (e) {
    return { verified: false, reason: "Connection failed" };
  }
};

export const generateOdilbekResponse = async (prompt: string, language: Language, chatHistory: string, legalContext: string) => {
    try {
        const res = await fetch('/api/odilbek', {
            method: 'POST',
            body: JSON.stringify({ prompt, language, chatHistory })
        });
        const data = await res.json();
        return data.text;
    } catch (e) {
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
  try {
    const res = await fetch('/api/legal-advice', {
        method: 'POST',
        body: JSON.stringify({ prompt, attachment, language, settings, chatHistory, additionalContext, isPro })
    });
    if (!res.ok) throw new Error("API Error");
    return await res.json();
  } catch (e) {
    console.error(e);
    return { text: "Error connecting to Lawify Server.", sources: [] };
  }
};

export const textToSpeech = async (text: string): Promise<AudioBuffer | null> => {
    try {
        const res = await fetch('/api/tts', {
            method: 'POST',
            body: JSON.stringify({ text })
        });
        const data = await res.json();
        if (!data.audioData) return null;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        return await decodeAudioData(decode(data.audioData), ctx, 24000, 1);
    } catch (e) {
        return null;
    }
}

// --- SECURE TURN-BASED LIVE SESSION MANAGER ---
// Replaces the WebSocket implementation.
// Logic: Record -> Stop -> Upload -> Get Answer -> TTS -> Play -> Repeat
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

        // When recording stops, process the audio
        this.mediaRecorder.onstop = () => this.handleRecordingStop();
        
        // Start first turn
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

  // Called by UI button or silence detection (manual button for now for safety)
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
          // 1. Send Audio to Secure Legal API
          // We pass a simplified settings object for voice speed
          const { text } = await generateLegalResponse(
              "", 
              { name: 'voice.webm', mimeType: 'audio/webm', data: base64Audio },
              this.language,
              { answerLength: 'Short', tone: 'Simple', outputStyle: 'Paragraphs', clarifyingQuestions: false, documentType: 'General', perspective: 'Neutral' },
              "", 
              "This is a spoken conversation. Keep answers brief (max 3 sentences).",
              true 
          );

          // 2. Get Audio back via Secure TTS
          const audioBuffer = await textToSpeech(text);

          // 3. Play Audio
          if (audioBuffer && this.audioContext && this.active) {
              this.onStatusChange('speaking');
              this.currentSource = this.audioContext.createBufferSource();
              this.currentSource.buffer = audioBuffer;
              this.currentSource.connect(this.audioContext.destination);
              
              this.currentSource.onended = () => {
                  // 4. Loop back to listening after speaking finishes
                  if (this.active) {
                      // Slight delay so user doesn't feel rushed
                      setTimeout(() => this.startRecording(), 500);
                  }
              };
              
              this.currentSource.start();
          } else {
               // Fallback if TTS fails, just listen again
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
        // Stop all tracks to release mic
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (this.currentSource) {
        this.currentSource.stop();
    }
    this.onStatusChange('idle');
  }
}
