
import { GoogleGenAI } from "@google/genai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { base64Image, expectedAmount } = await req.json();
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });
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
    
    return new Response(resultText, { headers: { 'Content-Type': 'application/json' } });
  } catch (error: any) {
    return new Response(JSON.stringify({ verified: false, reason: "Verification error" }), { status: 500 });
  }
}
