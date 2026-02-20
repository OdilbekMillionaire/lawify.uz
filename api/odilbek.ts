
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
      const currency = language === 'uz' ? 'amaldagi tahrir'
        : language === 'ru' ? 'действующая редакция' : 'current edition in force';

      const retrievalPrompt = `
RETRIEVAL TASK:
User query: "${prompt}"
SEARCH:
1. Search: site:lex.uz OR site:norma.uz ${prompt} ${currency}
2. Find EACH relevant law, article number, and its full text.
3. Check status (in force / repealed).
Return ONLY JSON: { "laws": [ { "lawName": "...", "articleNumber": "...", "status": "in_force|repealed|unknown", "verbatimText": "exact text from lex.uz", "sourceUrl": "https://lex.uz/..." } ] }
If no law found: { "laws": [] }
`;

      const retrievalSystemPrompt = `
You are a LEGAL DATABASE RETRIEVAL AGENT for Uzbekistan law.
Your ONLY function is to search lex.uz and norma.uz and transcribe what you find.
You do NOT explain, summarize, or advise. You ONLY copy.
CRITICAL: You MUST execute a Google Search. Do NOT use training data.
If text not found: set verbatimText to "".
Language context: ${language}
`;

      const retrievalResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { role: 'user', parts: [{ text: retrievalPrompt }] },
        config: {
          systemInstruction: retrievalSystemPrompt,
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

    return new Response(JSON.stringify({ text: response.text || "Uzr, tushuna olmadim." }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Odilbek API Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
