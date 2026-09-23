# SDD: GitHub Pages deploy

- **Repo:** `o000o_active/a_3nextjs-pwa-boilerplate`
- **Status:** `implemented`
- **Date:** 2026-09-23
- **Related:** [000-architecture.md](./000-architecture.md)

## 1. Context / current architecture

The app is a Next.js App Router server. `app/page.tsx` is a client UI. Subscribe, unsubscribe, and send call server actions in `app/actions.ts` (`web-push` plus `data/subscriptions.json`). `next.config.ts` sets security headers and does not use `output: 'export'`.

The GitHub repo is `noowxela/nextjs-pwa-boilerplate`. There is no Actions workflow. GitHub Pages for a project site is `https://noowxela.github.io/nextjs-pwa-boilerplate/`.

## 2. Problem and non-goals

**Problem:** Pushes to `main` should publish the frontend on GitHub Pages.

**Non-goals:**

- Running VAPID subscribe or send on Pages (no Node server, no private key, no writable disk)
- Changing local `npm run dev` / `npm run build` so they stay a server app
- Deploying the FCM repo in this file (that repo has its own SDD)

## 3. Questions asked and answers

| Question | Answer |
| --- | --- |
| Same workflow for `a_3nextjs-pwa-boilerplate_fcm`? | Yes. Separate workflow in that repo. |

## 4. Proposed approach, pros / cons, rejected alternatives

**Approach:**

1. When `GITHUB_PAGES=true`, `next.config.ts` uses `output: 'export'`, `basePath` `/nextjs-pwa-boilerplate`, `trailingSlash: true`, and skips `headers()` (static export cannot emit them).
2. That build does not import `app/actions.ts`. The page still shows the notification check and install prompt. Subscribe and send show a short note that those need the local server.
3. `.github/workflows/pages.yml` on push to `main`: `npm ci`, `npm run build` with `GITHUB_PAGES=true`, upload the `out/` artifact, deploy with `actions/deploy-pages`.
4. Pages source is GitHub Actions. Live URL: `https://noowxela.github.io/nextjs-pwa-boilerplate/`.

**Pros:**

- The UI publishes on every push to `main`.
- Local push testing is unchanged.

**Cons / risks:**

- The Pages site cannot deliver web push.
- Service worker scope is under the project path, not the domain root.
- The first run needs the repo Pages setting set to GitHub Actions.

**Rejected alternatives:**

| Alternative | Why not |
| --- | --- |
| `output: 'export'` for every build | Local `next start` would lose server actions |
| Host the server on Pages | Pages serves files only |

## 5. Acceptance criteria and verification

- [x] `GITHUB_PAGES=true npm run build` writes `out/` and does not bundle `subscribeUser`
- [x] `npm run build` without `GITHUB_PAGES` still produces a server build
- [ ] Push to `main` runs the Pages workflow
- [ ] `https://noowxela.github.io/nextjs-pwa-boilerplate/` shows the notification check and install prompt

## 6. Status history

| Date | Status | Note |
| --- | --- | --- |
| 2026-09-23 | draft | Static Pages UI; server actions stay local |
| 2026-09-23 | approved | FCM repo gets the same workflow |
| 2026-09-23 | implemented | Workflow and static export; live URL after the Actions run |
