
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
    // STEP 1: RETRIEVAL — search lex.uz with targeted queries from Step 0
    // ============================================================
    const retrievalSystemPrompt = `
You are a LEGAL DATABASE RETRIEVAL AGENT for Uzbekistan law.
Your ONLY function is to search lex.uz/norma.uz and transcribe what you find. You do NOT explain or advise.
RULES: Execute Google Search. Do NOT use training data. Copy verbatim text. Check if law is in force.
OUTPUT: JSON only: { "laws": [ { "lawName":"...", "articleNumber":"...", "paragraph":null, "adoptionDate":null, "lastAmendmentDate":null, "lawSerialNumber":null, "status":"in_force|repealed|unknown", "verbatimText":"EXACT TEXT", "sourceUrl":"https://lex.uz/...", "foundInSearch":true } ] }
If ZERO found: { "laws": [] }. Language: ${language}
`;

    const retrievalUserPrompt = `
RETRIEVAL TASK — Execute these searches:
${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

For each search, extract the laws/articles found. Combine all results into one JSON.
Return ONLY the JSON.
`;

    const retrievalResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: retrievalUserPrompt }] },
      config: {
        systemInstruction: retrievalSystemPrompt,
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

    let laws: any[] = [];
    try {
      const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
      laws = Array.isArray(parsed.laws) ? parsed.laws : [];
    } catch { laws = []; }

    laws = laws.filter((law: any) =>
      law.verbatimText?.trim().length > 10
      && law.foundInSearch !== false
      && law.lawName?.trim().length > 0
      && law.sourceUrl
    );

    // Deduplicate
    const seen = new Set<string>();
    laws = laws.filter((law: any) => {
      const key = `${law.lawName}:${law.articleNumber}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (laws.length === 0) {
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
    // ============================================================
    const lawsContext = laws.map((law: any, i: number) => `
[LAW ${i + 1}]
Name: ${law.lawName}
Article: ${law.articleNumber}${law.paragraph ? `, ${law.paragraph}` : ''}
Adopted: ${law.adoptionDate ?? 'not found'}
Last Amended: ${law.lastAmendmentDate ?? 'not found'}
Serial No: ${law.lawSerialNumber ?? 'not found'}
Status: ${law.status?.toUpperCase?.() ?? 'UNKNOWN'}
Source: ${law.sourceUrl}
Verbatim Text:
"""
${law.verbatimText}
"""
`).join('\n---\n');

    const generationSystemPrompt = `
You are LAWIFY, the official AI legal consultant for Uzbekistan.
${languageDirective}

ABSOLUTE CONSTRAINT — CLOSED-WORLD:
You have been given the COMPLETE AND FINAL list of verified laws below.
You MUST NOT cite any law, article, or legal provision NOT in this list.
You have NO access to external data. Do NOT use training memory for law references.
If the retrieved laws don't fully answer the question, say so explicitly.

CITATION RULE: Cite each law using its actual name and article number directly inline.
Example: "Mehnat kodeksining 153-moddasiga ko'ra..." — no [LAW N] tags.
For articles with a prime suffix, use Unicode superscripts: 126¹ (not 126-1), 141² (not 141-2).

STATUS RULE: If status is "REPEALED", do NOT base advice on it.
Write: "(eski qonun, endi amal qilmaydi)" and advise only on in-force laws.

VERIFIED LAWS FROM LEX.UZ (your ONLY allowed sources):
${lawsContext}

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
