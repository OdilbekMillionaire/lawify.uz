
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
      
      *** ZERO HALLUCINATION PROTOCOL (STRICT) ***
      1. **USE THE TOOL:** You MUST use the Google Search tool to find the exact law. Do not answer from memory.
      2. **FACT CHECK:** You are FORBIDDEN from inventing Article numbers, Law dates, or fine amounts. 
      3. **SOURCE VERIFICATION:** If you cite "Article 123", that number MUST appear in the search snippet you retrieved. If the snippet says "liability for theft", but doesn't show the number, DO NOT make up "Article 169". Just say "The Criminal Code establishes liability for theft..."
      4. **VALIDITY CHECK:** Before citing a law, verify if it is "Amalda" (In Force). If a law is "Kuchini yo'qotgan" (Repealed), you MUST state: "This law is no longer active" and look for the new version (e.g., Old Mehnat Kodeksi 1995 vs New 2022).
      5. **ADMIT IGNORANCE:** If search results are empty, state clearly: "I could not find the specific official document."
      
      USER SETTINGS:
      - Tone: ${settings.tone}
      - Length: ${settings.answerLength}
      
      RESPONSE STRUCTURE:
      ${structureLabels}
    `;

    // Construct Input
    let searchContext = "";
    // If audio is present, we tell the model to listen to it
    if (attachment?.mimeType?.startsWith('audio/')) {
        searchContext = `Listen to the attached audio. Search for the legal issues mentioned on "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
    } else {
        // DIRECT SEARCH TRIGGER: This ensures the 'googleSearch' tool is actually invoked, generating the links.
        searchContext = `Search specifically for the following query on 'site:lex.uz' or 'site:norma.uz': "${prompt}". Base your answer ONLY on the search results. Explain in ${language}.`;
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