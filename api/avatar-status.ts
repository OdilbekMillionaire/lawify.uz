
export const config = { runtime: 'edge' };

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing talk id' }), { status: 400 });
  }

  const apiKey = process.env.D_ID_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Avatar service not configured.' }), { status: 503 });
  }

  try {
    const res = await fetch(`https://api.d-id.com/talks/${id}`, {
      headers: { 'Authorization': `Basic ${btoa(apiKey)}` },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to get talk status.' }), { status: 500 });
    }

    const data = await res.json();

    return new Response(JSON.stringify({
      // D-ID statuses: 'created' | 'processing' | 'done' | 'error' | 'rejected'
      status: data.status,
      videoUrl: data.result_url ?? null,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err: any) {
    console.error('Avatar status error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), { status: 500 });
  }
}
