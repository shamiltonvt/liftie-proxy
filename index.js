let cachedData = null;
let lastFetched = 0;
const CACHE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = Date.now();
  if (cachedData && (now - lastFetched < CACHE_INTERVAL)) {
    console.log("✅ Returning cached lift status");
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(cachedData);
  }

  try {
    const response = await fetch("https://liftie.info/api/resort/killington", {
      headers: {
        "User-Agent": "Mozilla/5.0 (LiftStatus Proxy)"
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `Liftie returned ${response.status}` });
    }

    const data = await response.json();
    cachedData = data;
    lastFetched = now;

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Unable to fetch lift status" });
  }
}
