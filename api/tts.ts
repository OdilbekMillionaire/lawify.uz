
import { GoogleGenAI, Modality } from "@google/genai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { text } = await req.json();
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });
    
    // Shorten text if too long for TTS speed (optional optimization)
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
    
    return new Response(JSON.stringify({ audioData: base64Audio }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
