# Catmas ($CATMAS)

**Every stray deserves a Christmas dinner.** Website for the Catmas charity memecoin: Catmas advent calendar, stray-cat ASMR, the Catdex, and a free **Cat ID card generator** with an automatic, globally unique ID number and a shareable link that shows the card as a preview on X.

## Stack

- `public/` — static site (no build step). Edit **`public/config.js`** to change content.
- `api/` — Vercel Functions (Node 20+)
  - `POST /api/register` — validates input, stores the thumbnail, atomically claims the next ID number
  - `POST /api/card-image?no=&token=` — stores the rendered card (one-time, token-protected)
  - `GET  /api/cards` — latest 48 community cats (CDN-cached 20 s)
  - `GET  /id/:no` — share page with Open Graph / Twitter card image
  - `POST /api/admin-delete?no=` — removes an abusive card (header `x-admin-key`)
- Storage: **Vercel Blob** (public store). ID numbers are claimed by creating a blob that must not already exist, so two people can never get the same number.

## Environment variables

| Name | Where it comes from |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when the Blob store is connected to the project |
| `ADMIN_KEY` | Any random string ≥ 16 characters, used for `/api/admin-delete` |

## Launch checklist (mainnet)

1. In `public/config.js` set `ca`, `pumpUrl`, `xHandle`, and confirm `launchAt`.
2. Replace placeholder art: put photos/videos in `public/media/` and reference them in `config.js` (strip GPS/EXIF first).
3. Connect a custom domain in Vercel → Project → Domains.
4. Add a Firewall rate-limit rule for `/api/register` (e.g. 10 requests / minute / IP) in Vercel → Firewall.
5. Push to `main` — Vercel deploys automatically.

## Moderation

```bash
curl -X POST "https://YOUR_DOMAIN/api/admin-delete?no=123" -H "x-admin-key: $ADMIN_KEY"
```

## Local preview

Open `public/index.html` directly: the registry isn't reachable, so the page runs in preview mode with numbers saved in the browser. For the full stack: `npx vercel dev` (needs `BLOB_READ_WRITE_TOKEN`).

---

$CATMAS is a memecoin with no intrinsic value or expectation of financial return. Not an investment. Cat ID cards are novelty items, not government-issued identification.
