
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

      // STEP 1: Retrieval with targeted queries
      const retrievalPrompt = `
RETRIEVAL TASK — Execute these searches:
${searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}
For each search, extract laws/articles. Return ONLY JSON:
{ "laws": [ { "lawName":"...", "articleNumber":"...", "status":"in_force|repealed|unknown", "verbatimText":"exact text", "sourceUrl":"https://lex.uz/..." } ] }
If no law found: { "laws": [] }
`;

      const retrievalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: retrievalPrompt }] },
        config: {
          systemInstruction: `You are a LEGAL DATABASE RETRIEVAL AGENT for Uzbekistan law. You ONLY search lex.uz and copy verbatim text. You do NOT explain. Execute Google Search. Do NOT use training data. If text not found: set verbatimText to "". Language: ${language}`,
          tools: [{ googleSearch: {} }],
          temperature: 0.0,
        }
      });

      try {
        const parsed = JSON.parse(
          (retrievalResponse.text || '{}')
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim()
        );
        const laws = Array.isArray(parsed.laws)
          ? parsed.laws.filter((l: any) => l.verbatimText?.trim().length > 10)
          : [];

        if (laws.length === 0) {
          const noLawMsg = language === 'uz'
            ? "Men bu savol bo'yicha rasmiy qonunni lex.uz'da topa olmadim.\n\nIltimos, yurist bilan maslahatlashing yoki [lex.uz](https://lex.uz) saytida o'zingiz qidiring."
            : language === 'ru'
            ? "Я не нашёл официальный закон на lex.uz по вашему вопросу.\n\nОбратитесь к юристу или поищите на [lex.uz](https://lex.uz)."
            : "I could not find an official law on lex.uz for this question.\n\nPlease consult a lawyer.";
          return new Response(JSON.stringify({ text: noLawMsg }), {
            headers: { 'Content-Type': 'application/json' }
          });
        }

        verifiedLawsBlock = laws.map((l: any, i: number) =>
          `[LAW ${i + 1}]: ${l.lawName}, ${l.articleNumber}-modda\nStatus: ${l.status}\nText: "${l.verbatimText}"\nSource: ${l.sourceUrl}`
        ).join('\n\n');
      } catch {
        const errMsg = language === 'uz'
          ? "Tizimda xatolik. Iltimos, qayta urinib ko'ring."
          : "System error. Please try again.";
        return new Response(JSON.stringify({ text: errMsg }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // ---- STEP 2: SIMPLIFICATION (NO search tool — closed world) ----
    const systemInstruction = `
You are Odilbek — a friendly "aka" (big brother) legal translator for ordinary citizens of Uzbekistan.
Language: ${language}.

YOUR ONLY JOB: Explain the VERIFIED LAWS below in simple, warm language.

ABSOLUTE RULES:
1. You MUST ONLY explain the laws provided in the VERIFIED LAWS block below.
2. You MUST NOT mention any other law, article number, or legal fact not in that block.
3. If the laws provided do not answer the user's question, say: "Bu savol bo'yicha rasmiy qonunni topa olmadim — yurist bilan maslahatlashing."
4. Cite article numbers when explaining: "153-modda bo'yicha..."
5. If a law's status is "repealed", note: "(eski qonun, endi amal qilmaydi)".

VERIFIED LAWS (your ONLY source):
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
