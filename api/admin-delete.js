// Remove an abusive card: POST /api/admin-delete?no=123  with header  x-admin-key: <ADMIN_KEY>
import crypto from "node:crypto";
import { deleteCard } from "../lib/store.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const key = process.env.ADMIN_KEY || "";
  const given = String(req.headers["x-admin-key"] || "");
  const ok = key.length >= 16 && given.length === key.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(key));
  if (!ok) return res.status(401).json({ error: "Unauthorized" });
  const no = parseInt(req.query.no, 10);
  if (!Number.isInteger(no) || no < 1) return res.status(400).json({ error: "Invalid number" });
  const removed = await deleteCard(no);
  return res.status(200).json({ removed });
}
