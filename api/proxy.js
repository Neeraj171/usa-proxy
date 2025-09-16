export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).send("Missing path");
  }

  // Build today’s and tomorrow’s UTC date
  const today = new Date();
  const yyyy = today.getUTCFullYear();
  const mm = String(today.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(today.getUTCDate()).padStart(2, "0");
  const startDate = `${yyyy}${mm}${dd}000000Z`;

  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);
  const yyyy2 = tomorrow.getUTCFullYear();
  const mm2 = String(tomorrow.getUTCMonth() + 1).padStart(2, "0");
  const dd2 = String(tomorrow.getUTCDate()).padStart(2, "0");
  const endDate = `${yyyy2}${mm2}${dd2}000000Z`;

  const originUrl = `https://p-cdn1-a-cg14-linear-cbd46b77.movetv.com/clipslist/672/${startDate}/${endDate}/spanning_ads.mpd`;

  try {
    const response = await fetch(originUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Referer": "https://www.sling.com/",
        "Origin": "https://www.sling.com",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch .mpd");
    }

    const data = await response.text();
    res.setHeader("Content-Type", "application/dash+xml");
    return res.send(data);
  } catch (err) {
    return res.status(500).send("Proxy error: " + err.message);
  }
}
