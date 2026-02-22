
export const config = { runtime: 'edge' };

// Voice IDs for Microsoft TTS via D-ID
const VOICE_IDS: Record<string, string> = {
  uz: 'uz-UZ-SardorNeural',  // Uzbek male
  ru: 'ru-RU-DmitryNeural',  // Russian male
  en: 'en-US-GuyNeural',     // English male
};

// Professional male presenter (Adam - suit, library background)
const PRESENTER_ID = 'v2_public_Adam_BlackShirt_Library@6uEefixtDc';

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const { text, language } = await req.json();

    const apiKey = process.env.D_ID_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Avatar service not configured. Add D_ID_API_KEY.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Clean markdown and trim to D-ID limit (~1500 chars)
    const script = text
      .replace(/#{1,6}\s/g, '')       // Remove heading markers
      .replace(/\*\*|__/g, '')        // Remove bold
      .replace(/\*|_/g, '')           // Remove italic
      .replace(/`/g, '')              // Remove code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Collapse links to text
      .replace(/\n{2,}/g, '. ')       // Paragraph breaks → sentence pause
      .replace(/\n/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 1400);

    if (!script || script.length < 20) {
      return new Response(JSON.stringify({ error: 'Text too short for avatar.' }), { status: 400 });
    }

    const voiceId = VOICE_IDS[language] ?? VOICE_IDS['en'];
    // D-ID key format: base64(email):api_secret — use btoa(key) directly, NOT btoa(key + ':')
    const authHeader = `Basic ${btoa(apiKey)}`;

    const res = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        presenter_id: PRESENTER_ID,
        script: {
          type: 'text',
          subtitles: false,
          provider: {
            type: 'microsoft',
            voice_id: voiceId,
          },
          input: script,
        },
        config: {
          fluent: true,
          pad_audio: 0.5,
          stitch: true,
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error('D-ID create talk error:', res.status, errBody);
      return new Response(JSON.stringify({ error: 'Failed to create avatar video.' }), { status: 500 });
    }

    const { id } = await res.json();
    return new Response(JSON.stringify({ talkId: id }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Avatar API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
}
