export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");
  if (!targetUrl) {
    return new Response("Missing ?url=", { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
        "Referer": "https://booru.allthefallen.moe/"
      }
    });

    if (!upstream.ok) {
      return new Response("Upstream error", { status: upstream.status });
    }

    const body = await upstream.arrayBuffer();
    return new Response(body, {
      headers: { "Content-Type": upstream.headers.get("content-type") || "image/jpeg" }
    });
  } catch (err) {
    return new Response("Proxy error: " + err.message, { status: 500 });
  }
}
