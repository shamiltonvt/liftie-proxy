let cachedData = null;
let lastFetch = 0;
const cacheDuration = 10 * 60 * 1000; // 10 minutes

export default async function handler(req, res) {
  const now = Date.now();

  if (cachedData && now - lastFetch < cacheDuration) {
    console.log("Serving cached data");
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
    lastFetch = now;

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Unable to fetch lift status" });
  }
}
