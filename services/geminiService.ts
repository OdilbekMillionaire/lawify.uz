
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Language, UserSettings, Attachment, Source, GeneratedDocument, DrafterResponse, VerifiedLaw, RetrievalResult } from "../types";
import { LEGAL_TEMPLATES } from "../data/legal_templates";

// --- AUDIO HELPERS ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- INITIALIZE AI CLIENT ---
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing. Please check your .env file.");
    throw new Error("API Key Missing");
  }
  return new GoogleGenAI({ apiKey });
};

// --- RETRY HELPER ---
const retry = async <T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T> => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, delay));
      return retry(fn, retries - 1, delay * 2); // Exponential backoff
    }
    throw err;
  }
};

// ============================================================
// ANTI-HALLUCINATION: TWO-STEP RETRIEVE-THEN-GENERATE SYSTEM
// ============================================================

const RETRIEVAL_SYSTEM_PROMPT = (language: Language): string => `
You are a LEGAL DATABASE RETRIEVAL AGENT for Uzbekistan law.
Your ONLY function is to search lex.uz and norma.uz and transcribe what you find.
You do NOT explain, summarize, or advise. You ONLY copy.

CRITICAL RULES:
1. You MUST execute a Google Search before generating any output.
2. Search using site:lex.uz OR site:norma.uz operators.
3. Do NOT cite any law not found in the current search results.
4. Do NOT use training data to fill gaps. If text not found: set verbatimText to "" and foundInSearch to false.
5. Include the exact lex.uz/norma.uz URL where you found the article.
6. Verify whether the law is currently in force ("amaldagi tahrir" / "действующая редакция").
7. If law is repealed, set status to "repealed" but still include what you found.
8. Find as many relevant laws/articles as possible (aim for 2-5 relevant provisions).

OUTPUT: Respond ONLY with this exact JSON, no prose, no markdown:
{
  "laws": [
    {
      "lawName": "Official full name of the law",
      "articleNumber": "exact article number from lex.uz",
      "paragraph": "specific paragraph or null",
      "adoptionDate": "YYYY-MM-DD or null",
      "lastAmendmentDate": "YYYY-MM-DD or null",
      "lawSerialNumber": "registration number or null",
      "status": "in_force | repealed | amended | suspended | unknown",
      "verbatimText": "EXACT VERBATIM TEXT copied from lex.uz. Empty string if not found.",
      "sourceUrl": "https://lex.uz/docs/...",
      "foundInSearch": true
    }
  ]
}

If ZERO laws found: { "laws": [] }
Language context: ${language}
`;

const buildRetrievalUserPrompt = (query: string, language: Language): string => {
  const currency = language === 'uz' ? 'amaldagi tahrir'
    : language === 'ru' ? 'действующая редакция' : 'current edition in force';
  return `
RETRIEVAL TASK:
User query: "${query}"

SEARCH:
1. Search: site:lex.uz OR site:norma.uz ${query} ${currency}
2. Find EACH relevant law, article number, and its full text.
3. Check status (in force / repealed).
4. Find ALL applicable laws, not just one.

Return ONLY the JSON. No other text.
`;
};

export async function retrieveLaws(query: string, language: Language): Promise<RetrievalResult> {
  const ai = getAIClient();

  const response = await retry(async () => {
    return await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { role: 'user', parts: [{ text: buildRetrievalUserPrompt(query, language) }] },
      config: {
        systemInstruction: RETRIEVAL_SYSTEM_PROMPT(language),
        tools: [{ googleSearch: {} }],
        temperature: 0.0,
      }
    });
  }, 2, 1000);

  const rawText = response.text || '';
  const retrievalSources: Source[] = [];
  if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
    response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title)
        retrievalSources.push({ title: chunk.web.title, uri: chunk.web.uri });
    });
  }

  let laws: VerifiedLaw[] = [];
  try {
    const parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
    laws = Array.isArray(parsed.laws) ? parsed.laws : [];
  } catch { laws = []; }

  laws = filterVerifiedLaws(laws);

  return { laws, retrievalSources, noLawsFound: laws.length === 0, rawRetrievalText: rawText };
}

function filterVerifiedLaws(laws: VerifiedLaw[]): VerifiedLaw[] {
  return laws.filter(law =>
    law.verbatimText?.trim().length > 10
    && law.foundInSearch !== false        // Accept true or undefined, reject only explicit false
    && law.lawName?.trim().length > 0
    && law.sourceUrl                       // Must have a source URL
  );
}

function handleNoLawsFound(language: Language, query: string, sources: Source[]): { text: string; sources: Source[] } {
  const msg: Record<string, string> = {
    uz: `### Rasmiy Manba Topilmadi\n\nLex.uz va Norma.uz da quyidagi so'rovingiz bo'yicha aniq qonun moddasi topilmadi:\n> "${query}"\n\n**Nima qilish mumkin:**\n1. Savolni aniqroq bering (kodeks nomi, modda raqami).\n2. [Lex.uz](https://lex.uz) saytida o'zingiz qidiring.\n3. Malakali yurist bilan maslahatlashing.\n\n*Lawify aniq qonuniy asossiz maslahat bermaydi.*`,
    ru: `### Официальный источник не найден\n\nНа Lex.uz и Norma.uz не найдена норма закона по вашему запросу:\n> "${query}"\n\n**Что делать:**\n1. Уточните вопрос (название кодекса, номер статьи).\n2. Поищите на [Lex.uz](https://lex.uz).\n3. Обратитесь к квалифицированному юристу.\n\n*Lawify не даёт советов без официального правового основания.*`,
    en: `### No Official Source Found\n\nNo law was found on Lex.uz or Norma.uz for:\n> "${query}"\n\n**What to do:**\n1. Refine your question (code name, article number).\n2. Search directly on [Lex.uz](https://lex.uz).\n3. Consult a qualified lawyer.\n\n*Lawify does not advise without an official legal basis.*`,
  };
  return { text: msg[language] ?? msg['en'], sources };
}

const buildGenerationSystemPrompt = (
  language: Language, settings: UserSettings,
  laws: VerifiedLaw[], structureLabels: string, languageDirective: string
): string => {
  const lawsContext = laws.map((law, i) => `
[LAW ${i + 1}]
Name: ${law.lawName}
Article: ${law.articleNumber}${law.paragraph ? `, ${law.paragraph}` : ''}
Adopted: ${law.adoptionDate ?? 'not found in search'}
Last Amended: ${law.lastAmendmentDate ?? 'not found in search'}
Serial No: ${law.lawSerialNumber ?? 'not found in search'}
Status: ${law.status.toUpperCase()}
Source: ${law.sourceUrl}
Verbatim Text:
"""
${law.verbatimText}
"""
`).join('\n---\n');

  return `
You are LAWIFY, the official AI legal consultant for Uzbekistan.
${languageDirective}

ABSOLUTE CONSTRAINT — CLOSED-WORLD:
You have been given the COMPLETE AND FINAL list of verified laws below.
You MUST NOT cite any law, article, or legal provision NOT in this list.
You have NO access to external data. Do NOT use training memory for law references.
If the retrieved laws don't fully answer the question, say so explicitly.

CITATION RULE: Reference laws as [LAW N] inline.
Example: "Mehnat kodeksining 153-moddasiga ko'ra... [LAW 1]"

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
};

function validateCitations(text: string, laws: VerifiedLaw[]): { hasViolations: boolean; violatingCitations: string[] } {
  const allowed = new Set(laws.map(l => l.articleNumber.replace(/\s+/g, '').toLowerCase()));
  const pattern = /(?:(?:modda|статья|article|moddasi)\s*(\d+[\w\-]*)|(\d+[\w\-]*)\s*-?\s*(?:modda|moddasi|статья))/gi;
  const violations: string[] = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const num = (m[1] || m[2]).toLowerCase().replace(/\s+/g, '');
    if (!allowed.has(num)) violations.push(num);
  }
  return { hasViolations: violations.length > 0, violatingCitations: [...new Set(violations)] };
}

function appendCitationWarning(text: string, citations: string[], language: Language): string {
  const warn: Record<string, string> = {
    uz: `\n\n---\n> **Tekshiruv ogohlantirishsi:** Quyidagi modda raqamlari rasmiy manbada tasdiqlanmagan: ${citations.join(', ')}. Bu ma'lumotlarga tayanmang — yurist bilan maslahatlashing.`,
    ru: `\n\n---\n> **Предупреждение:** Следующие статьи не подтверждены официальным источником: ${citations.join(', ')}. Не полагайтесь на них — проконсультируйтесь с юристом.`,
    en: `\n\n---\n> **Audit Warning:** These article numbers were not confirmed by official sources: ${citations.join(', ')}. Do not rely on them — consult a lawyer.`,
  };
  return text + (warn[language] ?? warn['en']);
}

// ============================================================
// --- CLIENT-SIDE LOGIC IMPLEMENTATIONS ---
// ============================================================

export const verifyPaymentScreenshot = async (base64Image: string, expectedAmount: string) => {
  try {
    const ai = getAIClient();
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
    return JSON.parse(resultText);
  } catch (e) {
    console.error("Payment Verification Error", e);
    return { verified: false, reason: "Connection failed" };
  }
};

export const verifyLegalAdvice = async (originalPrompt: string, aiResponse: string, language: string) => {
  try {
    const ai = getAIClient();
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

    return response.text || "Verification failed.";
  } catch (e) {
    console.error("Verification Error", e);
    return "Verification system unavailable (Client Error).";
  }
};

export const generateOdilbekResponse = async (prompt: string, language: Language, chatHistory: string, legalContext: string) => {
    try {
        const ai = getAIClient();

        // If legalContext is pre-provided (from LAWIFY response), skip retrieval
        if (legalContext && legalContext.trim().length > 0) {
          return await generateOdilbekSimplification(prompt, legalContext, language, chatHistory, ai);
        }

        // ============================================================
        // STEP 1: RETRIEVE LAWS — same retrieveLaws() helper
        // ============================================================
        let retrievalResult: RetrievalResult;
        try {
          retrievalResult = await retrieveLaws(prompt, language);
        } catch (e) {
          console.error("Odilbek Retrieval Failed:", e);
          return language === 'uz'
            ? "Uzr, hozir rasmiy manbaga ulanishda muammo bor. Biroz kutib, qayta urinib ko'ring."
            : "Sorry, trouble connecting to official sources right now. Please try again.";
        }

        if (retrievalResult.noLawsFound) {
          return language === 'uz'
            ? `Men bu savol bo'yicha rasmiy qonunni lex.uz'da topa olmadim.\n\nIltimos, yurist bilan maslahatlashing yoki [lex.uz](https://lex.uz) saytida o'zingiz qidiring.`
            : `I could not find an official law on lex.uz for this question.\n\nPlease consult a lawyer or search [lex.uz](https://lex.uz) directly.`;
        }

        // ============================================================
        // STEP 2: SIMPLIFICATION — NO search tool, closed-world
        // ============================================================
        const verifiedLawsBlock = retrievalResult.laws.map((law, i) =>
          `[LAW ${i + 1}]: ${law.lawName}, ${law.articleNumber}-modda\nStatus: ${law.status}\nText: "${law.verbatimText}"\nSource: ${law.sourceUrl}`
        ).join('\n\n');

        return await generateOdilbekSimplification(prompt, verifiedLawsBlock, language, chatHistory, ai);
    } catch (e) {
        console.error("Odilbek Error", e);
        return "Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
    }
};

async function generateOdilbekSimplification(
  prompt: string, lawContext: string, language: Language, chatHistory: string, ai: any
): Promise<string> {
  const systemInstruction = `
You are Odilbek — a friendly "aka" (big brother) legal translator for ordinary citizens of Uzbekistan.
Language: ${language}.

YOUR ONLY JOB: Explain the VERIFIED LAWS below in simple, warm language.

ABSOLUTE RULES:
1. You MUST ONLY explain the laws provided in the VERIFIED LAWS block below.
2. You MUST NOT mention any other law, article number, or legal fact not in that block.
3. If the laws provided do not answer the user's question, say: "Bu savol bo'yicha rasmiy qonunni topa olmadim — yurist bilan maslahatlashing."
4. You MUST cite the article number when you explain it: "153-modda bo'yicha..."
5. If a law's status is "repealed", explain it as old law: "(eski qonun, endi amal qilmaydi)".

VERIFIED LAWS (your ONLY source):
${lawContext}

FORMATTING:
- Use **BOLD** for key legal terms.
- Use > blockquotes for the "Main Point" summary.
- Use ### headers.
- Use numbered lists for steps.
- Warm, supportive tone — like a knowledgeable older brother.
`;

  const response = await retry(async () => {
    return await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: [
          ...(chatHistory ? [{ text: `[Chat History]\n${chatHistory}` }] : []),
          { text: `[User Question]: ${prompt}` }
        ]
      },
      config: {
        systemInstruction,
        // CRITICAL: NO tools — closed-world simplification only
        temperature: 0.3,
      }
    });
  }, 2, 1000);

  return response.text || (language === 'uz' ? "Uzr, tushuna olmadim." : "Sorry, I couldn't understand.");
}

export const generateLegalResponse = async (
  prompt: string,
  attachment: Attachment | undefined,
  language: Language,
  settings: UserSettings,
  chatHistory: string,
  additionalContext: string = "",
  isPro: boolean = false
): Promise<{ text: string, sources: Source[] }> => {
  const ai = getAIClient();

  // --- LANGUAGE CONFIG ---
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

  // --- AUDIO FALLBACK: single-step grounded call (audio can't do JSON retrieval) ---
  if (attachment?.mimeType?.startsWith('audio/')) {
    return generateLegalResponseSingleStep(prompt, attachment, language, settings, chatHistory, additionalContext, isPro, ai, structureLabels, languageDirective);
  }

  // ============================================================
  // STEP 1: RETRIEVAL — search lex.uz, output structured JSON only
  // ============================================================
  let retrievalResult: RetrievalResult;
  try {
    retrievalResult = await retrieveLaws(prompt, language);
  } catch (e) {
    console.error("Retrieval Step Failed:", e);
    const errMsg = language === 'uz'
      ? "Rasmiy manba (Lex.uz) bilan bog'lanishda xatolik. Iltimos, qayta urinib ko'ring."
      : language === 'ru'
      ? "Ошибка подключения к официальному источнику (Lex.uz). Попробуйте снова."
      : "Error connecting to official source (Lex.uz). Please try again.";
    return { text: errMsg, sources: [] };
  }

  if (retrievalResult.noLawsFound) {
    return handleNoLawsFound(language, prompt, retrievalResult.retrievalSources);
  }

  // ============================================================
  // STEP 2: GENERATION — closed-world, NO search tool
  // ============================================================
  const generationSystemPrompt = buildGenerationSystemPrompt(
    language, settings, retrievalResult.laws, structureLabels, languageDirective
  );

  const parts: any[] = [{ text: prompt }];
  if (chatHistory) parts.push({ text: `[Chat History]\n${chatHistory}` });
  if (additionalContext) parts.push({ text: `[User Profile]\n${additionalContext}` });
  if (attachment) {
    parts.push({ inlineData: { mimeType: attachment.mimeType, data: attachment.data } });
  }

  try {
    const modelName = isPro ? 'gemini-2.5-flash' : 'gemini-2.0-flash';

    const response = await retry(async () => {
      return await ai.models.generateContent({
        model: modelName,
        contents: { role: 'user', parts },
        config: {
          systemInstruction: generationSystemPrompt,
          // CRITICAL: NO tools — model has zero search access, can only use retrieved laws
          temperature: 0.2,
          thinkingConfig: isPro ? { thinkingBudget: 8000 } : undefined,
        }
      });
    }, 2, 1000);

    const text = response.text;
    if (!text || text.trim().length === 0) {
      return handleNoLawsFound(language, prompt, retrievalResult.retrievalSources);
    }

    // Post-processing: validate generated text only cites retrieved laws
    const validation = validateCitations(text, retrievalResult.laws);
    const finalText = validation.hasViolations
      ? appendCitationWarning(text, validation.violatingCitations, language)
      : text;

    return { text: finalText, sources: retrievalResult.retrievalSources };

  } catch (e: any) {
    console.error("Generation Step Failed:", e);
    return {
      text: language === 'uz' ? "Tizimda xatolik yuz berdi. Iltimos, qayta urinib ko'ring." : "System error. Please try again.",
      sources: retrievalResult.retrievalSources
    };
  }
};

// --- Audio fallback: single-step grounded call (kept for audio attachments only) ---
async function generateLegalResponseSingleStep(
  prompt: string, attachment: Attachment, language: Language, settings: UserSettings,
  chatHistory: string, additionalContext: string, isPro: boolean, ai: any,
  structureLabels: string, languageDirective: string
): Promise<{ text: string, sources: Source[] }> {
  const systemInstruction = `
    You are LAWIFY, the official AI legal consultant for Uzbekistan.
    ${languageDirective}
    USER SETTINGS: Tone: ${settings.tone}, Length: ${settings.answerLength}.
    RESPONSE STRUCTURE: ${structureLabels}
    RULES: You MUST use Google Search. You MUST cite lex.uz/norma.uz sources. If you cannot find a law, DO NOT INVENT ONE.
  `;
  const searchContext = `Listen to the attached audio. Search for the legal issues mentioned on "site:lex.uz OR site:norma.uz". Explain in ${language}.`;
  const parts: any[] = [
    { text: searchContext },
    ...(chatHistory ? [{ text: `[Chat History]\n${chatHistory}` }] : []),
    ...(additionalContext ? [{ text: `[User Profile]\n${additionalContext}` }] : []),
    { inlineData: { mimeType: attachment.mimeType, data: attachment.data } }
  ];

  try {
    const response = await retry(async () => {
      return await ai.models.generateContent({
        model: isPro ? 'gemini-2.5-flash' : 'gemini-2.0-flash',
        contents: { role: 'user', parts },
        config: { systemInstruction, tools: [{ googleSearch: {} }], temperature: 0.2 }
      });
    }, 2, 1000);

    const text = response.text || '';
    const sources: Source[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) sources.push({ title: chunk.web.title, uri: chunk.web.uri });
      });
    }
    return { text: text || (language === 'uz' ? "Ma'lumot topilmadi." : "No data found."), sources };
  } catch (e: any) {
    console.error("Audio Legal Response Error:", e);
    return { text: language === 'uz' ? "Tizimda xatolik." : "System error.", sources: [] };
  }
}

export const generateArticleCommentary = async (
  lawName: string,
  articleNumber: string,
  language: Language
): Promise<{ text: string; sources: Source[] }> => {
  try {
    const ai = getAIClient();

    const langDir =
      language === Language.UZ
        ? "Javobni O'ZBEK TILIDA yozing. Rasmiy-huquqiy uslubdan foydalaning. Barcha matnni o'zbek tilida yozing."
        : language === Language.RU
        ? "Пишите ответ НА РУССКОМ ЯЗЫКЕ. Используйте официально-правовой стиль."
        : "Write the entire answer in ENGLISH. Use formal legal language.";

    const h = {
      article:    language === Language.UZ ? "Rasmiy Modda Matni"       : language === Language.RU ? "Официальный Текст Статьи"    : "Official Article Text",
      analysis:   language === Language.UZ ? "Modda Tahlili"            : language === Language.RU ? "Анализ Статьи"               : "Article Analysis",
      official:   language === Language.UZ ? "Rasmiy Sharhlar"          : language === Language.RU ? "Официальные Комментарии"     : "Official Commentary",
      related:    language === Language.UZ ? "Bog'liq Moddalar"         : language === Language.RU ? "Связанные Статьи"            : "Related Articles",
      practical:  language === Language.UZ ? "Amaliy Qo'llanma"        : language === Language.RU ? "Практическое Руководство"    : "Practical Guidance",
    };

    const systemInstruction = `
You are a senior legal scholar and official legal commentator specializing in the laws of Uzbekistan (O'zbekiston qonunchiligi). Your commentary is published in authoritative legal journals and referenced by courts.

${langDir}

CRITICAL FORMATTING RULES — STRICTLY ENFORCE:
- DO NOT use any markdown formatting: no asterisks (*), no double asterisks (**), no hash symbols (#), no backticks (\`), no underscores for emphasis.
- DO NOT use "**bold**" syntax anywhere in the output body.
- For emphasis, simply write the important term normally — the reader will understand from context.
- Use plain numbered lists (1., 2., 3.) and plain dashes (-) for bullet points.
- Use SECTION TAGS to delimit sections. Each section MUST start with [SECTION:emoji:Title] on its own line and end with [/SECTION] on its own line.

YOUR MANDATORY TASK:
The user provides a law/code name and article number. Execute these steps:
1. SEARCH lex.uz and norma.uz for the EXACT CURRENT text of the specified article.
2. If the article has been amended, note the latest amendment date.
3. Write a thorough multi-section commentary (minimum 500 words total across all sections).
4. NEVER fabricate article text. If you truly cannot find it, state which source was searched and why it may not be found.

OUTPUT FORMAT — use exactly these section tags:

[SECTION:📋:${h.article}]
Write the COMPLETE verbatim text of the article as found on lex.uz or norma.uz. Include every paragraph, sub-clause, and numbered item. If the article has multiple parts, list them all. State the source URL at the end of this section.
[/SECTION]

[SECTION:🔍:${h.analysis}]
Provide a detailed clause-by-clause legal analysis. For each paragraph or sub-clause of the article:
- Explain the legal meaning and scope
- Identify the subjects of the legal relationship (who is bound, who has rights)
- Note any legal conditions, thresholds, or deadlines
- Point out exceptions or special cases
- Reference any judicial practice or legal doctrine applicable in Uzbekistan
This section must be at minimum 200 words.
[/SECTION]

[SECTION:📚:${h.official}]
Provide official and doctrinal commentary on this article:
- Reference any official commentary books or publications on this law (e.g., "O'zbekiston Respublikasi Mehnat Kodeksiga Sharhlar" or similar)
- Note any positions of the Supreme Court of Uzbekistan or Constitutional Court regarding this article
- Reference legal doctrine (huquqiy ta'limot) from Uzbek and Soviet-era legal scholarship if relevant
- If no official commentary exists, provide a scholarly analysis referencing comparable norms in CIS countries
[/SECTION]

[SECTION:🔗:${h.related}]
List all directly related articles:
- Other articles in the same code that must be read together with this article
- Articles in other laws that supplement or interact with this article
- Any presidential decrees or government resolutions that specify procedures under this article
Format: "Article [N] of [Law Name] — [brief explanation of the connection]"
[/SECTION]

[SECTION:⚡:${h.practical}]
Provide concrete step-by-step practical guidance for citizens, businesses, and lawyers:
- What rights does this article grant, and how to exercise them
- What obligations does it impose, and what are the consequences of violation
- Deadlines and procedural steps to follow
- Practical examples of real-world application
- Common mistakes to avoid
- Which government body or court handles disputes under this article
This section must be at minimum 150 words.
[/SECTION]

ACCURACY RULES:
- Ground every statement in the official sources found via web search.
- If you find the article text, cite the exact lex.uz URL.
- If the article number in the current law differs from the user's input (due to renumbering), note both numbers.
- Write in a professional, authoritative tone. Avoid speculative language.

LEGISLATION CURRENCY — NON-NEGOTIABLE:
- You MUST search for the CURRENT IN-FORCE version of the article. Include "amaldagi tahrir" or "действующая редакция" in your search.
- Do NOT cite an old or repealed version of the article as if it is current.
- If the article text you find on lex.uz shows an amendment date, that IS the current version — use it.
- If the article has been repealed entirely, state clearly: "Bu modda kuchini yo'qotgan" / "Данная статья утратила силу" and search for the replacement.
- Do NOT use your training data for article text. ONLY use verbatim text found via Google Search. If search returns nothing, say so.
    `;

    const searchQuery =
      language === Language.UZ
        ? `${lawName} ${articleNumber}-modda amaldagi tahrir rasmiy matni site:lex.uz`
        : language === Language.RU
        ? `${lawName} статья ${articleNumber} действующая редакция site:lex.uz`
        : `${lawName} article ${articleNumber} current version in force site:lex.uz`;

    const response = await retry(async () => {
      return await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: {
          role: 'user',
          parts: [{
            text: `Provide a full legal commentary on: ${lawName}, ${articleNumber}-modda.\n\nSearch these sources: lex.uz, norma.uz, zakon.uz\nSearch query: ${searchQuery}\n\nFollow the output format with [SECTION] tags exactly as instructed.`
          }],
        },
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
        },
      });
    }, 2, 1000);

    let text = response.text || '';

    // Safety net: strip any stray markdown symbols from body text
    // (preserve SECTION tags which use [ ] not markdown)
    text = text
      .replace(/(?<!\[SECTION[^\]]*\])(?<!\[\/SECTION\])\*\*/g, '')
      .replace(/(?<!\[SECTION[^\]]*\])(?<!\[\/SECTION\])\*/g, '')
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`/g, '');

    const sources: Source[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    if (!text || text.trim().length === 0) {
      const errMsg =
        language === Language.UZ
          ? "Kechirasiz, bu modda lex.uz'da topilmadi. Qonun nomini to'liq va to'g'ri kiriting."
          : language === Language.RU
          ? "Извините, статья не найдена на lex.uz. Укажите полное и корректное название закона."
          : "Sorry, this article was not found on lex.uz. Please provide the full and correct law name.";
      return { text: errMsg, sources: [] };
    }

    return { text, sources };
  } catch (e) {
    console.error("Article Commentary Error:", e);
    const errMsg =
      language === Language.UZ
        ? "Tizimda xatolik yuz berdi. Qaytadan urinib ko'ring."
        : language === Language.RU
        ? "Произошла системная ошибка. Попробуйте снова."
        : "A system error occurred. Please try again.";
    return { text: errMsg, sources: [] };
  }
};

export const draftDocument = async (
    prompt: string,
    currentDocument: GeneratedDocument,
    language: Language,
    docType: string
): Promise<DrafterResponse | null> => {
    try {
        // 1. INSTANT TEMPLATE CHECK
        if (LEGAL_TEMPLATES[prompt]) {
            const template = LEGAL_TEMPLATES[prompt];
            
            let introMsg = "Official template loaded. I need some details to fill it out.";
            if (language === 'uz') introMsg = "Rasmiy sud hujjati andozasi yuklandi. Uni to'ldirish uchun sizdan ba'zi ma'lumotlarni so'rashim kerak. Masalan: Da'vogarning to'liq ismi kim?";
            if (language === 'ru') introMsg = "Официальный шаблон загружен. Мне нужны детали. Например: Как зовут Истца?";

            return {
                chatResponse: introMsg,
                documentUpdate: template
            };
        }

        // 2. AI Generation
        const ai = getAIClient();

        const responseSchema = {
          type: Type.OBJECT,
          properties: {
            chatResponse: {
              type: Type.STRING,
              description: "The AI asking specific questions to fill placeholders (e.g., 'Please provide the Plaintiff's Passport Number').",
            },
            documentUpdate: {
              type: Type.OBJECT,
              description: "The updated document JSON.",
              properties: {
                title: { type: Type.STRING },
                sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      heading: { type: Type.STRING, description: "Clause title" },
                      content: { type: Type.STRING, description: "Legal text content with placeholders filled." }
                    }
                  }
                },
                isComplete: { type: Type.BOOLEAN, description: "True if all placeholders like [Name], [Date] are filled." }
              }
            }
          }
        };

        const systemInstruction = `
          You are 'AI Kotib' (AI Legal Drafter) for Uzbekistan.
          Current Language: ${language}.
          
          TASK: Conduct a step-by-step interview to fill an Official Legal Document.
          
          PROCESS:
          1. Look at 'Current Document State'. Identify placeholders like [Da'vogar F.I.O], [Pasport], [Sana], [Summa].
          2. Ask the user ONE or TWO simple questions at a time to get this info.
          3. When the user answers (e.g., "My name is Alisher"), REPLACE the placeholder [Da'vogar F.I.O] with "Alisher" in the JSON.
          4. Do NOT rewrite the whole legal text unless necessary. Just fill the gaps.
          5. Keep the legal tone formal (Rasmiy uslub).
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

        let jsonStr = response.text || "{}";
        jsonStr = jsonStr.replace(/^```json/, '').replace(/```$/, '');
        return JSON.parse(jsonStr);

    } catch (e) {
        console.error("Drafting Error", e);
        return null;
    }
};

export const textToSpeech = async (text: string, voiceName: string = 'Kore'): Promise<AudioBuffer | null> => {
    try {
        const ai = getAIClient();
        const cleanText = text.replace(/[*#]/g, '').slice(0, 500);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName } },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) return null;

        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
        return await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
    } catch (e) {
        console.error("TTS Error", e);
        return null;
    }
}

// --- SECURE TURN-BASED LIVE SESSION MANAGER ---
export class LiveSessionManager {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private onStatusChange: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void;
  private onError: (error: string) => void;
  private language: Language = Language.UZ;
  private voiceName: string = 'Kore';
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private active: boolean = false;

  constructor(
    onStatusChange: (status: 'listening' | 'processing' | 'speaking' | 'idle') => void,
    onError: (error: string) => void
  ) {
    this.onStatusChange = onStatusChange;
    this.onError = onError;
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
  }

  async start(language: Language, voiceName: string = 'Kore') {
    this.language = language;
    this.voiceName = voiceName;
    this.active = true;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.mediaRecorder = new MediaRecorder(stream);
        
        this.mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => this.handleRecordingStop();
        
        this.startRecording();
    } catch (err) {
        this.onError("Microphone access denied.");
        this.stop();
    }
  }

  startRecording() {
      if (!this.mediaRecorder || !this.active) return;
      this.audioChunks = [];
      this.mediaRecorder.start();
      this.onStatusChange('listening');
  }

  stopRecordingAndProcess() {
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
          this.onStatusChange('processing');
      }
  }

  private async handleRecordingStop() {
      if (!this.active) return;

      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      
      reader.onloadend = async () => {
          const base64String = (reader.result as string).split(',')[1];
          await this.processUserAudio(base64String);
      };
      
      reader.readAsDataURL(audioBlob);
  }

  private async processUserAudio(base64Audio: string) {
      try {
          const { text } = await generateLegalResponse(
              "", 
              { name: 'voice.webm', mimeType: 'audio/webm', data: base64Audio },
              this.language,
              { answerLength: 'Short', tone: 'Simple', outputStyle: 'Paragraphs', clarifyingQuestions: false, documentType: 'General', perspective: 'Neutral' },
              "", 
              "This is a spoken conversation. Keep answers brief.",
              true 
          );

          const audioBuffer = await textToSpeech(text, this.voiceName);

          if (audioBuffer && this.audioContext && this.active) {
              this.onStatusChange('speaking');
              this.currentSource = this.audioContext.createBufferSource();
              this.currentSource.buffer = audioBuffer;
              this.currentSource.connect(this.audioContext.destination);
              
              this.currentSource.onended = () => {
                  if (this.active) {
                      setTimeout(() => this.startRecording(), 500);
                  }
              };
              
              this.currentSource.start();
          } else {
               if (this.active) this.startRecording();
          }

      } catch (err) {
          console.error(err);
          this.onError("Connection error");
          if (this.active) setTimeout(() => this.startRecording(), 2000);
      }
  }

  stop() {
    this.active = false;
    if (this.mediaRecorder) {
        this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    if (this.currentSource) {
        this.currentSource.stop();
    }
    this.onStatusChange('idle');
  }
}
