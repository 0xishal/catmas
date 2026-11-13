// Share page for one Cat ID: /id/:no
// Gives X / Telegram / Discord a large preview image of the card.
import { getCard, getCardImageUrl, pad } from "../lib/store.js";
import { origin, escapeHtml as e } from "../lib/http.js";

export default async function handler(req, res) {
  const no = parseInt(req.query.no, 10);
  const site = origin(req);
  const card = Number.isInteger(no) && no > 0 ? await getCard(no).catch(() => null) : null;

  if (!card) {
    res.setHeader("Cache-Control", "public, s-maxage=30");
    res.status(404).setHeader("Content-Type", "text/html; charset=utf-8");
    return res.send(page({ site, title: "Cat ID not found · Catmas", desc: "This Cat ID doesn't exist (yet). Make one for your cat.", image: `${site}/og.jpg`, body: `<h1>Cat not found</h1><p>This Cat ID doesn't exist yet.</p>` }));
  }

  const id = "CM-" + pad(card.no, 6);
  const img = await getCardImageUrl(card.no).catch(() => null);
  const image = img || card.thumbUrl || `${site}/og.jpg`;
  const title = `Meet ${card.name} — Catmas Cat ID ${id}`;
  const desc = `${card.name} from ${card.city} is officially registered on the Catmas Nice List. Get a free Cat ID for your cat.`;
  res.setHeader("Cache-Control", img ? "public, s-maxage=86400, stale-while-revalidate=604800" : "public, s-maxage=30");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  return res.status(200).send(page({
    site, title, desc, image, url: `${site}/id/${card.no}`,
    body: `
      <p class="eyebrow">Official Catmas Cat ID</p>
      <h1>Meet <em>${e(card.name)}</em></h1>
      <p class="sub">${e(id)} · ${e(card.city)}${card.guardian ? " · guarded by " + e(card.guardian) : ""}</p>
      <img class="card" src="${e(image)}" alt="Cat ID card of ${e(card.name)}">
      <div class="ctas"><a class="btn red" href="/#cat-id">Make your cat's ID</a><a class="btn ghost" href="/">What is Catmas?</a></div>`
  }));
}

function page({ site, title, desc, image, url, body }) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title><meta name="description" content="${e(desc)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="Catmas"><meta property="og:title" content="${e(title)}"><meta property="og:description" content="${e(desc)}"><meta property="og:image" content="${e(image)}">${url ? `<meta property="og:url" content="${e(url)}">` : ""}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${e(title)}"><meta name="twitter:description" content="${e(desc)}"><meta name="twitter:image" content="${e(image)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,900;1,9..144,600&family=DM+Sans:wght@400;700&display=swap" rel="stylesheet">
<style>body{margin:0;min-height:100vh;background:radial-gradient(120% 70% at 50% 0%,#1d3a5c,#0d1726 70%);color:#fbf3e4;font-family:"DM Sans",system-ui,sans-serif;display:grid;place-items:center;text-align:center;padding:40px 18px}
main{max-width:860px;width:100%}.eyebrow{color:#f6d27e;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:13px}
h1{font-family:Fraunces,Georgia,serif;font-weight:900;font-size:clamp(40px,7vw,72px);margin:8px 0}h1 em{font-style:italic;font-weight:600;color:#e8b04a}
.sub{color:#a9b4c4}.card{width:100%;border-radius:24px;margin:26px 0;box-shadow:0 30px 70px -30px #000}
.ctas{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}.btn{padding:14px 24px;border-radius:999px;font-weight:700;text-decoration:none}
.red{background:#c8332b;color:#fff}.ghost{border:1px solid rgba(255,255,255,.2);color:#fbf3e4}
footer{margin-top:28px;font-size:13px;color:#7f8ca0}</style></head>
<body><main>${body}<footer>Novelty Cat ID · not a government-issued ID · <a href="${e(site)}" style="color:#fbf3e4">${e(site.replace(/^https?:\/\//, ""))}</a></footer></main></body></html>`;
}
