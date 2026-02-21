
import { GoogleGenAI } from "@google/genai";

export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { prompt, language, chatHistory, legalContext } = await req.json();
    const apiKey = process.env.API_KEY;
    if (!apiKey) return new Response(JSON.stringify({ error: 'Config error' }), { status: 500 });

    const ai = new GoogleGenAI({ apiKey });

    // ---- STEP 1: RETRIEVAL (only if no legalContext pre-provided) ----
    let verifiedLawsBlock = legalContext || '';

    if (!verifiedLawsBlock.trim()) {
      // STEP 0: Query Intelligence — figure out what to search for
      let searchQueries: string[] = [];
      try {
        const analysisResp = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { role: 'user', parts: [{ text: `User question: "${prompt}"` }] },
          config: {
            systemInstruction: `You are a LEGAL QUERY ANALYST for Uzbekistan law. Analyze the question, identify relevant codes/articles, generate 3-5 precise search queries with "site:lex.uz" prefix. RESPOND ONLY JSON: { "searchQueries": ["site:lex.uz ...", ...] }. Language: ${language}`,
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 1024 },
          }
        });
        const parsed = JSON.parse((analysisResp.text || '{}').replace(/```json/g, '').replace(/```/g, '').trim());
        searchQueries = Array.isArray(parsed.searchQueries) ? parsed.searchQueries.slice(0, 5) : [];
      } catch { /* fallback below */ }
      if (searchQueries.length === 0) searchQueries = [`site:lex.uz ${prompt}`];

      // STEP 1A: GROUNDED SEARCH — natural text output (compatible with googleSearch)
      // NOTE: googleSearch and responseMimeType:'application/json' are INCOMPATIBLE.
      // So we do 2 calls: 1A gets raw grounded text, 1B parses it into JSON.
      const searchInstructions = searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n');
      const retrievalPrompt = `
LEGAL RESEARCH TASK for: "${prompt}"

Execute each search and for EVERY article found, write it in this format:

=== ARTICLE START ===
LAW NAME: [full official name]
ARTICLE NUMBER: [exact number]
STATUS: [in_force / repealed / amended / unknown]
SOURCE URL: [https://lex.uz/... URL]
VERBATIM TEXT:
[Copy the EXACT text of the article from lex.uz]
=== ARTICLE END ===

SEARCHES TO EXECUTE:
${searchInstructions}
`;

      const retrievalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: retrievalPrompt }] },
        config: {
          systemInstruction: `You are a legal database retrieval agent for Uzbekistan. Search lex.uz and norma.uz. Copy verbatim article text exactly. Use === ARTICLE START/END === format. Do NOT summarize or explain. Language: ${language}`,
          tools: [{ googleSearch: {} }],
          temperature: 0.0,
        }
      });

      const rawRetrievalText = retrievalResponse.text || '';
      const groundingSources: any[] = [];
      if (retrievalResponse.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        retrievalResponse.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri && chunk.web?.title) groundingSources.push({ title: chunk.web.title, uri: chunk.web.uri });
        });
      }

      // noLawsFound: based on rawText content, NOT JSON parsing (JSON parsing is unreliable)
      if (rawRetrievalText.trim().length < 100) {
        const noLawMsg = language === 'uz'
          ? "Men bu savol bo'yicha rasmiy qonunni lex.uz'da topa olmadim.\n\nIltimos, yurist bilan maslahatlashing yoki [lex.uz](https://lex.uz) saytida o'zingiz qidiring."
          : language === 'ru'
          ? "Я не нашёл официальный закон на lex.uz по вашему вопросу.\n\nОбратитесь к юристу или поищите на [lex.uz](https://lex.uz)."
          : "I could not find an official law on lex.uz for this question.\n\nPlease consult a lawyer.";
        return new Response(JSON.stringify({ text: noLawMsg }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Pass raw research text directly — no JSON parsing in critical path
      verifiedLawsBlock = rawRetrievalText;
    }

    // ---- STEP 2: SIMPLIFICATION (NO search tool — closed world) ----
    const systemInstruction = `
You are Odilbek — a friendly "aka" (big brother) legal translator for ordinary citizens of Uzbekistan.
Language: ${language}.

YOUR ONLY JOB: Explain the legal research below in simple, warm language that ordinary citizens understand.

ABSOLUTE RULES:
1. You MUST ONLY explain laws explicitly mentioned in the LEGAL RESEARCH below.
2. You MUST NOT mention any other law, article number, or legal fact not found in that research.
3. If the research does not answer the user's question, say: "Bu savol bo'yicha rasmiy qonunni topa olmadim — yurist bilan maslahatlashing."
4. Cite article numbers when explaining: "153-modda bo'yicha..."
5. If a law is described as repealed in the research: "(eski qonun, endi amal qilmaydi)".

LEGAL RESEARCH FROM LEX.UZ (your ONLY source):
${verifiedLawsBlock}

FORMATTING:
- Use **BOLD** for key legal terms.
- Use > blockquotes for the "Main Point" summary.
- Use ### headers.
- Use numbered lists for steps.
- Warm, supportive tone — like a knowledgeable older brother.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: {
        role: 'user',
        parts: [
          ...(chatHistory ? [{ text: `[Context]\n${chatHistory}` }] : []),
          { text: `[User Question]: ${prompt}` }
        ]
      },
      config: {
        systemInstruction,
        // CRITICAL: NO tools — closed-world simplification only
        temperature: 0.3,
      }
    });

    const superscripts: Record<string, string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    const rawText = response.text || "Uzr, tushuna olmadim.";
    const finalText = rawText
      .replace(/\s*\[LAW\s*\d+\]/gi, '')
      .replace(/(\d+)-(\d+)([-\s]*(modda|moddasi|статья|article))/gi,
        (_: string, base: string, prime: string, suffix: string) =>
          `${base}${prime.split('').map((d: string) => superscripts[d] ?? d).join('')}${suffix}`
      );

    return new Response(JSON.stringify({ text: finalText }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Odilbek API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
