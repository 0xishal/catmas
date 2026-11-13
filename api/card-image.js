import { put, getCard, imageKey, isConflict, sha256 } from "../lib/store.js";
import { readRaw } from "../lib/http.js";

const MAX = 1.5 * 1024 * 1024;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const no = parseInt(req.query.no, 10);
  const token = String(req.query.token || "");
  if (!Number.isInteger(no) || no < 1 || !token) return res.status(400).json({ error: "Invalid request." });

  let buf;
  try { buf = await readRaw(req, MAX); }
  catch (e) { return res.status(e.status || 400).json({ error: "Image too large." }); }
  if (buf.length < 1000 || buf[0] !== 0xff || buf[1] !== 0xd8) return res.status(400).json({ error: "Expected a JPEG image." });

  const card = await getCard(no);
  if (!card || !card.tokenHash || card.tokenHash !== sha256(token)) return res.status(403).json({ error: "Not allowed." });

  try {
    const r = await put(imageKey(no), buf, {
      access: "public", contentType: "image/jpeg", addRandomSuffix: false, allowOverwrite: false, cacheControlMaxAge: 31536000
    });
    return res.status(200).json({ url: r.url });
  } catch (err) {
    if (isConflict(err)) return res.status(409).json({ error: "Card image already uploaded." });
    console.error("card-image failed", err);
    return res.status(503).json({ error: "Upload failed." });
  }
}
