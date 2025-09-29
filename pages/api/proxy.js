export default async function handler(req, res) {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.status(400).send("Missing ?url=");

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:143.0) Gecko/20100101 Firefox/143.0",
        "Referer": "https://booru.allthefallen.moe/"
      }
    });

    if (!upstream.ok) {
      res.status(upstream.status).send("Upstream error");
      return;
    }

    res.setHeader("Content-Type", upstream.headers.get("content-type") || "image/jpeg");
    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(500).send("Proxy error: " + err.message);
  }
}
