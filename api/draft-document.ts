
import { GoogleGenAI, Type } from "@google/genai";
import { LEGAL_TEMPLATES } from "../data/legal_templates";

export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, currentDocument, language, docType } = await req.json();
    
    // 1. INSTANT TEMPLATE CHECK (The Fix)
    // If the prompt is a specific Template Key (e.g., "TEMPLATE_DEBT"), load it immediately.
    if (LEGAL_TEMPLATES[prompt]) {
        const template = LEGAL_TEMPLATES[prompt];
        
        // Localized Intro Message
        let introMsg = "I have loaded the official template for you. Please fill in the bracketed details like [Date] and [Name].";
        if (language === 'uz') introMsg = "Rasmiy 'sud.uz' andozasi yuklandi. Iltimos, [Qavs] ichidagi ma'lumotlarni to'ldirib chiqing (Sana, Ism, Summa va h.k).";
        if (language === 'ru') introMsg = "Официальный шаблон загружен. Пожалуйста, заполните данные в скобках [Дата], [Имя] и т.д.";

        return new Response(JSON.stringify({
            chatResponse: introMsg,
            documentUpdate: template
        }), { headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Fallback to AI Generation if it's a custom request
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Server config error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        chatResponse: {
          type: Type.STRING,
          description: "Your conversational response to the user. Keep it short.",
        },
        documentUpdate: {
          type: Type.OBJECT,
          description: "The current state of the legal document.",
          properties: {
            title: { type: Type.STRING },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  heading: { type: Type.STRING, description: "Clause title" },
                  content: { type: Type.STRING, description: "Legal text content." }
                }
              }
            },
            isComplete: { type: Type.BOOLEAN, description: "True if document is ready to download." }
          }
        }
      }
    };

    const systemInstruction = `
      You are 'AI Kotib' (AI Legal Drafter) for Uzbekistan.
      Current Language: ${language}.
      
      YOUR GOAL: Help the user fill in the blanks of a legal document.
      
      If the document is already started, update the specific placeholders based on User Input.
      If User Input is "Make it for 10 million soms", find the [Summa] placeholder and replace it.
      
      Legal Basis: O'zbekiston Respublikasi Fuqarolik Kodeksi.
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

    return new Response(response.text, {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Drafter Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
