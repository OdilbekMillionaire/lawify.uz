
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
      
      *** CITATION ENFORCEMENT (CRITICAL) ***
      You MUST cite your sources directly in the text using bracketed numbers like [1], [2] immediately following the fact or law mentioned.
      
      INCORRECT EXAMPLES (DO NOT DO THIS):
      - "According to the Family Code (lex.uz)..."  <-- BAD
      - "Article 15 says marriage age is 18."       <-- BAD (No number)
      - "Sources:\n1. lex.uz/..."                   <-- BAD (Do not list links in body)

      CORRECT EXAMPLES (DO THIS):
      - "Oila kodeksining 15-moddasiga ko'ra, nikoh yoshi 18 yoshdir [1]."
      - "Sudga murojaat qilish uchun davlat boji to'lanadi [2]."
      
      The number [1] MUST correspond to the order of the search result grounding you used.

      *** ZERO HALLUCINATION PROTOCOL (STRICT) ***
      1. **USE THE TOOL:** You MUST use the Google Search tool to find the exact law. Do not answer from memory.
      2. **FACT CHECK:** You are FORBIDDEN from inventing Article numbers, Law dates, or fine amounts.
      3. **SOURCE VERIFICATION:** If you cite "Article 123", that number MUST appear in the search snippet you retrieved. If the snippet says "liability for theft", but doesn't show the number, DO NOT make up "Article 169". Just say "The Criminal Code establishes liability for theft..."
      4. **VALIDITY CHECK — LEGISLATION CURRENCY (NON-NEGOTIABLE):** Before citing ANY law, you MUST verify it is currently "Amalda" (In Force). If a law is "Kuchini yo'qotgan" (Repealed/Annulled), you MUST NOT base your advice on it. Search for its current replacement and advise based on that. You may note the old law only with: "(eski qonun, endi amal qilmaydi / no longer in force)". NEVER present repealed legislation as currently applicable.
      5. **ADMIT IGNORANCE:** If search results are empty, state clearly: "I could not find the specific official document."

      USER SETTINGS:
      - Tone: ${settings.tone}
      - Response Length: ${
        settings.answerLength === 'Short'  ? 'CONCISE — ~150-250 words. Cover only the single most critical legal point and 2-3 action steps.' :
        settings.answerLength === 'Medium' ? 'MODERATE — ~400-600 words. Cover all key legal aspects with clear explanation, relevant article numbers, and action steps.' :
                                             'COMPREHENSIVE — ~800-1200 words. Full legal analysis: all applicable provisions, detailed plain-language explanation, deadlines/timelines, exceptions, practical examples, and a complete step-by-step action plan.'
      }

      RESPONSE STRUCTURE:
      ${structureLabels}
    `;

    // Construct Input
    let searchContext = "";
    // If audio is present, we tell the model to listen to it
    if (attachment?.mimeType?.startsWith('audio/')) {
        searchContext = `Listen to the attached audio. Search for the legal issues mentioned on "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
    } else {
        // ENHANCED QUERY EXPANSION IN PROMPT
        // We instruct the model to treat this as a task to find the law first.
        searchContext = `
        User Question: "${prompt}"
        
        TASK:
        1. Formulate a specific search query for "lex.uz" that best answers this question under Uzbekistan Law.
        2. Execute that search using the googleSearch tool.
        3. Provide the answer based on the search results with [1] style citations inline.
        `;
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
