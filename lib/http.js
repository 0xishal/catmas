// Small helpers shared by the API routes.

export function origin(req) {
  const proto = (req.headers["x-forwarded-proto"] || "https").split(",")[0];
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  return `${proto}://${host}`;
}

export function clientIp(req) {
  return String(req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
}

// Best-effort per-instance rate limit. Add a Vercel Firewall rate-limit rule
// on /api/register for a global limit (see README).
const hits = new Map();
export function rateLimited(key, max, windowMs) {
  const now = Date.now();
  const arr = (hits.get(key) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(key, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export function cleanText(v, max) {
  return String(v ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f<>"`]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export async function readRaw(req, limit) {
  if (Buffer.isBuffer(req.body)) return req.body;
  const chunks = []; let size = 0;
  for await (const c of req) { size += c.length; if (size > limit) throw Object.assign(new Error("too_large"), { status: 413 }); chunks.push(c); }
  return Buffer.concat(chunks);
}

export const escapeHtml = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
