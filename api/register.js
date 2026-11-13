import crypto from "node:crypto";
import { put, claimNext, sha256 } from "../lib/store.js";
import { origin, clientIp, rateLimited, cleanText } from "../lib/http.js";

const TYPES = new Set(["Street", "Community", "House", "Rescue"]);
const MAX_THUMB = 120 * 1024; // bytes

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (rateLimited("reg:" + clientIp(req), 6, 60_000)) return res.status(429).json({ error: "Too many requests" });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = null; } }
  if (!b || typeof b !== "object") return res.status(400).json({ error: "Invalid request." });

  const name = cleanText(b.name, 22);
  const city = cleanText(b.city, 24);
  const type = TYPES.has(b.type) ? b.type : "Street";
  let guardian = cleanText(b.guardian, 16).replace(/^@/, "");
  if (guardian && !/^[A-Za-z0-9_]{1,15}$/.test(guardian)) guardian = "";
  if (!name) return res.status(400).json({ error: "Please give your cat a name." });
  if (!city) return res.status(400).json({ error: "Please add a city." });

  const m = /^data:image\/jpeg;base64,([A-Za-z0-9+/=]+)$/.exec(String(b.thumb || ""));
  if (!m) return res.status(400).json({ error: "Please add a photo." });
  const thumb = Buffer.from(m[1], "base64");
  if (thumb.length > MAX_THUMB || thumb[0] !== 0xff || thumb[1] !== 0xd8) return res.status(400).json({ error: "That photo couldn't be used." });

  try {
    const t = await put(`thumbs/${crypto.randomUUID()}.jpg`, thumb, {
      access: "public", contentType: "image/jpeg", addRandomSuffix: false, cacheControlMaxAge: 31536000
    });
    const token = crypto.randomBytes(18).toString("base64url");
    const no = await claimNext({
      name, city, type, guardian: guardian ? "@" + guardian : "",
      thumbUrl: t.url, tokenHash: sha256(token), createdAt: new Date().toISOString()
    });
    return res.status(200).json({ no, token, shareUrl: `${origin(req)}/id/${no}` });
  } catch (err) {
    console.error("register failed", err);
    return res.status(503).json({ error: "The registry is busy. Please try again." });
  }
}
