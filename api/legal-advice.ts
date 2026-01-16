
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge', 
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, attachment, language, settings, chatHistory, additionalContext, isPro } = await req.json();
    
    // SECURE: Key is accessed only on the server
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    // --- YOUR SECRET SAUCE LOGIC ---
    
    const articleRegex = /(?:modda|article|статья)\s*\d+/i;
    const codeRegex = /(?:kodeks|code|кодекс)/i;
    
    // Clarification Logic
    if (prompt && articleRegex.test(prompt) && !codeRegex.test(prompt) && settings.clarifyingQuestions) {
       let q = "Which code is it? (Family, Criminal, Civil, etc.)";
       if (language === 'uz') q = "Bu qaysi kodeks? (Oila, Jinoyat, Fuqarolik va h.k.)";
       if (language === 'ru') q = "О каком кодексе идет речь? (Семейный, Уголовный, Гражданский и т.д.)";
       return new Response(JSON.stringify({ text: q, sources: [] }), { 
           headers: { 'Content-Type': 'application/json' } 
       });
    }

    // Language & Structure Logic
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

    const systemInstruction = `
      You are LAWIFY, the official AI legal consultant for Uzbekistan.
      Current Language Mode: ${language.toUpperCase()}.
      ${languageDirective}
      
      YOUR MISSION: Provide legal advice ONLY based on facts found on 'lex.uz' and 'norma.uz'.
      
      USER SETTINGS:
      - Tone: ${settings.tone}
      - Length: ${settings.answerLength}
      
      STRICT RULES:
      1. **SEARCH IS MANDATORY:** You MUST perform a Google Search using 'site:lex.uz'.
      2. **OFFICIAL SOURCES ONLY:** Do not invent laws.
      3. **CITATION:** Always cite Code Name and Article Number.

      RESPONSE STRUCTURE:
      ${structureLabels}
    `;

    // Construct Input
    let searchContext = "";
    // If audio is present, we tell the model to listen to it
    if (attachment?.mimeType?.startsWith('audio/')) {
        searchContext = `Listen to the attached audio. It contains the user's legal question. Identify the core legal issue, then Search specifically using "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
    } else {
        searchContext = `Search specifically using "site:lex.uz OR site:norma.uz" for legislation regarding: "${prompt}". Explain in ${language}.`;
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

    // Call Gemini
    const modelName = isPro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
    const genConfig: any = {
      systemInstruction: systemInstruction,
      tools: [{ googleSearch: {} }], 
    };
    
    if (isPro) genConfig.thinkingConfig = { thinkingBudget: 1024 };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { role: 'user', parts: parts },
      config: genConfig
    });

    // Process Response
    const text = response.text || "No response generated.";
    const sources: any[] = [];
    
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return new Response(JSON.stringify({ text, sources }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ text: "System Error. Please try again.", sources: [] }), { status: 500 });
  }
}
