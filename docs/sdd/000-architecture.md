# Architecture: nextjs-pwa-boilerplate

- **Repo:** `o000o_active/a_3nextjs-pwa-boilerplate`
- **Status:** living doc
- **Date:** 2026-09-23

## Stack (current)

- Next.js **App Router** (`^16`) — `app/`
- React / React DOM (`^19`)
- TypeScript (`^5.9`, Node `>=20`)
- Web Push via `web-push` + VAPID (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` in `.env.local`)
- Service worker: `lib/service-worker.js` (precache + network-first navigations + push handlers), registered from the client with `import.meta.url`
- Subscription persistence: `lib/subscriptions.ts` → `data/subscriptions.json` (gitignored)
- Web app manifest: `app/manifest.ts`
- Security headers: `next.config.ts` (per the [Next.js PWA guide](https://nextjs.org/docs/app/guides/progressive-web-apps))

## Layout

| Path | Role |
| --- | --- |
| `app/layout.tsx` | Root HTML / metadata |
| `app/page.tsx` | Client UI: NotificationSettingsCheck, PushNotificationManager, InstallPrompt |
| `app/actions.ts` | Server Actions: subscribe / unsubscribe / sendNotification (fail fast without VAPID) |
| `app/manifest.ts` | PWA manifest |
| `lib/service-worker.js` | Offline cache + push + notificationclick |
| `lib/subscriptions.ts` | File-backed PushSubscriptionJSON store |
| `public/icon-*.png`, `icon.png`, `badge.png` | Manifest + notification icons |
| `data/subscriptions.json` | Runtime subscriptions (not in git) |

## Runtime notes

- Prefer **Node 20+** (`engines.node`).
- Local push testing: `npm run dev:https` (`next dev --experimental-https`).
- Do not set `NODE_ENV=production` in `.env` for local `next dev`.
- Subscriptions survive server restart via `data/subscriptions.json`.
- Install UX: Chromium `beforeinstallprompt`; iOS Share → Add to Home Screen; otherwise a short “no install prompt” note.
- `NotificationSettingsCheck` shows site `Notification.permission` and a test banner. It **cannot** read macOS System Settings → Notifications → Firefox.
- Serwist / full offline framework is out of scope; optional future upgrade.
