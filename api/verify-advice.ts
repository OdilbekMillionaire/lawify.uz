
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { originalPrompt, aiResponse, language } = await req.json();
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

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
      model: 'gemini-2.5-flash', // Always use best available for verification
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

    const text = response.text || "Verification failed.";
    
    return new Response(JSON.stringify({ text }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return new Response(JSON.stringify({ text: "System Error during verification." }), { status: 500 });
  }
}
