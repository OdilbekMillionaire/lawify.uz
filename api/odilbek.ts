
import { GoogleGenAI } from "@google/genai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, language, chatHistory } = await req.json();
    const apiKey = process.env.API_KEY; // Using same key for simplicity
    if (!apiKey) return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
        You are Odilbek, a friendly legal translator for common people in Uzbekistan.
        Language: ${language}.
        Role: Explain the provided legal advice in simple terms using analogies. 
        Tone: Friendly, "aka" (big brother) style.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: {
            role: 'user',
            parts: [
                { text: `[Context History]\n${chatHistory}` },
                { text: `[User Question]: ${prompt}` }
            ]
        },
        config: { systemInstruction }
    });

    return new Response(JSON.stringify({ text: response.text || "Uzr, tushuna olmadim." }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
