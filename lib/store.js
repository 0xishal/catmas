import { put, list, head, del, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import crypto from "node:crypto";

// Cards are stored under an inverted number so the newest card sorts first
// (Vercel Blob lists pathnames in lexicographic order).
const INV = 9_999_999;
export const pad = (n, w) => String(n).padStart(w, "0");
export const cardKey = n => `cards/${pad(INV - n, 7)}.json`;
export const imageKey = n => `cardimg/${pad(n, 7)}.jpg`;
export const numberFromKey = p => { const m = /cards\/(\d{7})\.json$/.exec(p); return m ? INV - parseInt(m[1], 10) : 0; };
export const sha256 = s => crypto.createHash("sha256").update(s).digest("hex");

export function isConflict(err) {
  return err instanceof BlobPreconditionFailedError || /already exists/i.test(String(err && err.message));
}

/** Highest registered number (0 if none). One list call. */
export async function latestNumber() {
  const r = await list({ prefix: "cards/", limit: 1 });
  return r.blobs.length ? numberFromKey(r.blobs[0].pathname) : 0;
}

/** Atomically claim the next free number by creating a blob that must not exist yet. */
export async function claimNext(body) {
  let n = (await latestNumber()) + 1;
  for (let attempt = 0; attempt < 40; attempt++, n++) {
    try {
      await put(cardKey(n), JSON.stringify({ ...body, no: n }), {
        access: "public", contentType: "application/json",
        addRandomSuffix: false, allowOverwrite: false, cacheControlMaxAge: 60
      });
      return n;
    } catch (err) {
      if (isConflict(err)) continue;
      throw err;
    }
  }
  throw new Error("registry_busy");
}

export async function getCard(n) {
  try {
    const h = await head(cardKey(n));
    const r = await fetch(h.url, { cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch (err) {
    if (err instanceof BlobNotFoundError) return null;
    throw err;
  }
}

export async function getCardImageUrl(n) {
  try { return (await head(imageKey(n))).url; }
  catch (err) { if (err instanceof BlobNotFoundError) return null; throw err; }
}

export async function listCards(limit = 48) {
  const r = await list({ prefix: "cards/", limit });
  const cards = await Promise.all(r.blobs.map(async b => {
    try { const res = await fetch(b.url); return res.ok ? await res.json() : null; } catch { return null; }
  }));
  return cards.filter(Boolean).map(publicCard);
}

export function publicCard(c) {
  return { no: c.no, name: c.name, city: c.city, type: c.type, guardian: c.guardian || "", thumbUrl: c.thumbUrl, createdAt: c.createdAt };
}

export async function deleteCard(n) {
  const c = await getCard(n);
  const urls = [];
  try { urls.push((await head(cardKey(n))).url); } catch {}
  const img = await getCardImageUrl(n).catch(() => null); if (img) urls.push(img);
  if (c && c.thumbUrl) urls.push(c.thumbUrl);
  if (urls.length) await del(urls);
  return urls.length;
}

export { put };
