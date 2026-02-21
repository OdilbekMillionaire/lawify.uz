
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, attachment, language, settings, chatHistory, additionalContext, isPro } = await req.json();

    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    // --- Clarification Logic ---
    const articleRegex = /(?:modda|article|статья)\s*\d+/i;
    const codeRegex = /(?:kodeks|code|кодекс)/i;

    if (prompt && articleRegex.test(prompt) && !codeRegex.test(prompt) && settings.clarifyingQuestions) {
       let q = "Which code is it? (Family, Criminal, Civil, etc.)";
       if (language === 'uz') q = "Bu qaysi kodeks? (Oila, Jinoyat, Fuqarolik va h.k.)";
       if (language === 'ru') q = "О каком кодексе идет речь? (Семейный, Уголовный, Гражданский и т.д.)";
       return new Response(JSON.stringify({ text: q, sources: [] }), {
           headers: { 'Content-Type': 'application/json' }
       });
    }

    // --- Language & Structure Config ---
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

    // --- AUDIO FALLBACK: single-step grounded call ---
    if (attachment?.mimeType?.startsWith('audio/')) {
      const audioSystemInstruction = `
        You are LAWIFY, the official AI legal consultant for Uzbekistan.
        ${languageDirective}
        USER SETTINGS: Tone: ${settings.tone}, Length: ${settings.answerLength}.
        RESPONSE STRUCTURE: ${structureLabels}
        RULES: You MUST use Google Search. You MUST cite lex.uz/norma.uz sources. If you cannot find a law, DO NOT INVENT ONE.
      `;
      const searchContext = `Listen to the attached audio. Search for the legal issues mentioned on "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
      const audioParts: any[] = [
        { text: searchContext },
        ...(chatHistory ? [{ text: `[Chat History]\n${chatHistory}` }] : []),
        ...(additionalContext ? [{ text: `[User Profile]\n${additionalContext}` }] : []),
        { inlineData: { mimeType: attachment.mimeType, data: attachment.data } }
      ];

      const audioResponse = await ai.models.generateContent({
        model: isPro ? 'gemini-2.5-flash' : 'gemini-2.0-flash',
        contents: { role: 'user', parts: audioParts },
        config: { systemInstruction: audioSystemInstruction, tools: [{ googleSearch: {} }], temperature: 0.2 }
      });

      const audioSources: any[] = [];
      if (audioResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        audioResponse.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) audioSources.push({ title: chunk.web.title, uri: chunk.web.uri });
        });
      }
      return new Response(JSON.stringify({ text: audioResponse.text || "No data found.", sources: audioSources }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================================
    // STEP 0: QUERY INTELLIGENCE — analyze question, produce targeted search queries
    // ============================================================
    const queryAnalysisPrompt = `
You are a LEGAL QUERY ANALYST for Uzbekistan law. Analyze the user's question and identify which laws to search for.
YOU DO NOT GIVE LEGAL ADVICE. You only identify what to search for on lex.uz.
Generate 3-5 precise search queries with "site:lex.uz" prefix using actual Uzbek legal terms.
RESPOND ONLY WITH JSON:
{ "legalDomain": "...", "relevantCodes": [...], "specificArticles": [...], "searchQueries": ["site:lex.uz ...", ...] }
Language context: ${language}
`;

    let searchQueries: string[] = [];
    try {
      const analysisResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: `User question: "${prompt}"` }] },
        config: { systemInstruction: queryAnalysisPrompt, temperature: 0.3, thinkingConfig: { thinkingBudget: 2048 } }
      });
      const analysisRaw = (analysisResponse.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      const analysis = JSON.parse(analysisRaw);
      searchQueries = Array.isArray(analysis.searchQueries) ? analysis.searchQueries.slice(0, 5) : [];
    } catch { /* fallback below */ }

    if (searchQueries.length === 0) {
      searchQueries = [`site:lex.uz ${prompt}`, `site:lex.uz O'zbekiston qonunchiligi ${prompt}`];
    }

    // ============================================================
    // STEP 1A: GROUNDED SEARCH — natural text output (compatible with googleSearch)
    // NOTE: googleSearch and responseMimeType:'application/json' are INCOMPATIBLE.
    // So we do 2 calls: 1A gets raw grounded text, 1B parses it into JSON.
    // ============================================================
    const searchInstructions = searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n');
    const retrievalUserPrompt = `
LEGAL RESEARCH TASK for: "${prompt}"

Execute each search and for EVERY article found, write it in this format:

=== ARTICLE START ===
LAW NAME: [full official name]
ARTICLE NUMBER: [exact number]
PARAGRAPH: [paragraph or "none"]
ADOPTION DATE: [YYYY-MM-DD or "unknown"]
LAST AMENDED: [YYYY-MM-DD or "unknown"]
SERIAL NO: [registration number or "unknown"]
STATUS: [in_force / repealed / amended / suspended / unknown]
SOURCE URL: [https://lex.uz/... or norma.uz URL]
VERBATIM TEXT:
[Copy the EXACT text of the article from lex.uz. Every word.]
=== ARTICLE END ===

SEARCHES TO EXECUTE:
${searchInstructions}
`;

    const retrievalResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: retrievalUserPrompt }] },
      config: {
        systemInstruction: `You are a legal database retrieval agent for Uzbekistan. Search lex.uz and norma.uz. Copy verbatim article text exactly. Use === ARTICLE START/END === format. Do NOT summarize. Do NOT explain. Only copy. Language: ${language}`,
        tools: [{ googleSearch: {} }],
        temperature: 0.0,
      }
    });

    const rawText = retrievalResponse.text || '';
    const retrievalSources: any[] = [];
    if (retrievalResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      retrievalResponse.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title)
          retrievalSources.push({ title: chunk.web.title, uri: chunk.web.uri });
      });
    }

    // ============================================================
    // noLawsFound check: based on whether search returned meaningful content,
    // NOT on JSON parsing (which is unreliable with grounded search output)
    // ============================================================
    if (rawText.trim().length < 100) {
      const noLawMsg = language === 'uz'
        ? `### Rasmiy Manba Topilmadi\n\nLex.uz va Norma.uz da quyidagi so'rovingiz bo'yicha aniq qonun moddasi topilmadi:\n> "${prompt}"\n\n**Nima qilish mumkin:**\n1. Savolni aniqroq bering.\n2. [Lex.uz](https://lex.uz) saytida o'zingiz qidiring.\n3. Malakali yurist bilan maslahatlashing.\n\n*Lawify aniq qonuniy asossiz maslahat bermaydi.*`
        : language === 'ru'
        ? `### Официальный источник не найден\n\nНа Lex.uz не найдена норма закона по запросу:\n> "${prompt}"\n\n**Что делать:**\n1. Уточните вопрос.\n2. Поищите на [Lex.uz](https://lex.uz).\n3. Обратитесь к юристу.\n\n*Lawify не даёт советов без правового основания.*`
        : `### No Official Source Found\n\nNo law found on Lex.uz for:\n> "${prompt}"\n\n*Lawify does not advise without an official legal basis.*`;
      return new Response(JSON.stringify({ text: noLawMsg, sources: retrievalSources }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // ============================================================
    // STEP 2: GENERATION — closed-world, NO search tool
    // Uses rawText directly as context — no JSON parsing in critical path
    // ============================================================
    const generationSystemPrompt = `
You are LAWIFY, the official AI legal consultant for Uzbekistan.
${languageDirective}

ABSOLUTE CONSTRAINT — CLOSED-WORLD:
You have been given LEGAL RESEARCH TEXT retrieved directly from lex.uz via Google Search.
You MUST ONLY cite laws and article numbers explicitly mentioned in this research text.
Do NOT add any law, article, or legal fact not found in the research text below.
If the research text doesn't fully answer the question, say so explicitly.

CITATION RULE: Cite each law by its actual name and article number inline.
Example: "Mehnat kodeksining 153-moddasiga ko'ra..." — no [LAW N] tags.
For articles with a prime suffix, use Unicode superscripts: 126¹ (not 126-1), 141² (not 141-2).

STATUS RULE: If a law is described as repealed in the research text, do NOT base advice on it.
Write: "(eski qonun, endi amal qilmaydi)" and advise only on currently in-force laws.

LEGAL RESEARCH FROM LEX.UZ (your ONLY allowed source):
${rawText}

USER SETTINGS:
- Tone: ${settings.tone}
- Response Length: ${
    settings.answerLength === 'Short'  ? 'CONCISE — ~150-250 words.' :
    settings.answerLength === 'Medium' ? 'MODERATE — ~400-600 words.' :
                                         'COMPREHENSIVE — ~800-1200 words with all provisions, timelines, exceptions, action plan.'
  }

RESPONSE STRUCTURE:
${structureLabels}
`;

    const genParts: any[] = [{ text: prompt }];
    if (chatHistory) genParts.push({ text: `[Chat History]\n${chatHistory}` });
    if (additionalContext) genParts.push({ text: `[User Profile]\n${additionalContext}` });
    if (attachment) {
      genParts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
    }

    const modelName = isPro ? 'gemini-2.5-flash' : 'gemini-2.0-flash';
    const genConfig: any = {
      systemInstruction: generationSystemPrompt,
      // CRITICAL: NO tools — model has zero search access
      temperature: 0.2,
    };
    if (isPro) genConfig.thinkingConfig = { thinkingBudget: 8000 };

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { role: 'user', parts: genParts },
      config: genConfig
    });

    const raw = response.text || "No response generated.";
    // Strip residual [LAW N] tags and apply prime notation (126¹ instead of 126-1)
    const superscripts: Record<string, string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    const text = raw
      .replace(/\s*\[LAW\s*\d+\]/gi, '')
      .replace(/(\d+)-(\d+)([-\s]*(modda|moddasi|статья|article))/gi,
        (_: string, base: string, prime: string, suffix: string) =>
          `${base}${prime.split('').map((d: string) => superscripts[d] ?? d).join('')}${suffix}`
      );

    return new Response(JSON.stringify({ text, sources: retrievalSources }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ text: "System Error. Please try again.", sources: [] }), { status: 500 });
  }
}
