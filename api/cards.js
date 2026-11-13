import { listCards } from "../lib/store.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const cards = await listCards(48);
    res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=60");
    return res.status(200).json({ latest: cards.length ? cards[0].no : 0, cards });
  } catch (err) {
    console.error("cards failed", err);
    return res.status(503).json({ error: "Registry unavailable." });
  }
}
