# Next.js PWA boilerplate

App Router PWA with **VAPID web push** and a custom service worker, based on the [Next.js Progressive Web Apps guide](https://nextjs.org/docs/app/guides/progressive-web-apps).

Firebase Cloud Messaging twin: [nextjs-pwa-boilerplate-fcm](https://github.com/noowxela/nextjs-pwa-boilerplate-fcm).

Static UI (no push server): [GitHub Pages](https://noowxela.github.io/nextjs-pwa-boilerplate/). Subscribe and send stay on `npm run dev`.

Requires **Node.js >= 20**.

## Quick start

```bash
npm install
cp .env.example .env.local
npm run vapid
```

Copy the generated public/private keys into `.env.local`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

Then start with HTTPS (required for reliable push / install testing):

```bash
npm run dev:https
```

Open the local HTTPS URL Next prints (usually `https://localhost:3000`).

Plain HTTP: `npm run dev` (push may be limited outside localhost).

## Firefox + macOS notifications

1. In the app, grant **site** notification permission (`granted`).
2. macOS: **System Settings → Notifications → Firefox** → Alerts or Banners (not None).
3. Unfocus or minimize Firefox — banners often do not show while Firefox is focused.
4. Use **Show test banner** on the homepage to verify OS delivery before testing push.

## HTTPS / mkcert trust

`next dev --experimental-https` uses a local cert (often under `certificates/`). If the browser warns about the certificate:

- Trust the generated cert in Keychain (macOS) or follow Next’s mkcert guidance, **or**
- Proceed once for localhost in the browser (push may still work on localhost).

Do not commit `certificates/` or real VAPID keys.

## Project structure

| Path | Role |
| --- | --- |
| `app/page.tsx` | Client UI: notification check, push subscribe/send, install prompt |
| `app/actions.ts` | Server Actions: subscribe / unsubscribe / sendNotification |
| `app/manifest.ts` | Web app manifest |
| `lib/service-worker.js` | Offline cache + push + notificationclick |
| `lib/subscriptions.ts` | Persist subscriptions to `data/subscriptions.json` |
| `public/icon*.png`, `badge.png` | Icons for manifest and notifications |
| `docs/sdd/` | Architecture and change SDDs |

Subscriptions are stored under `data/` (gitignored). Restarting the server does **not** clear them.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server (HTTP) |
| `npm run dev:https` | Dev server with experimental HTTPS |
| `npm run build` / `start` | Production build and serve |
| `npm run vapid` | Generate VAPID key pair |

## Docs

See [docs/sdd/INDEX.md](docs/sdd/INDEX.md) for architecture and change history.

## Credit

Started from [nextjs-pwa-boilerplate](https://github.com/JithinAntony4/nextjs-pwa-boilerplate) (MIT). This tree is an App Router rewrite for Web Push.
