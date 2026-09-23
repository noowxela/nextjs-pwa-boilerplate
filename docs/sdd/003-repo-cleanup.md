# SDD: Repo cleanup

- **Repo:** `o000o_active/a_3nextjs-pwa-boilerplate`
- **Status:** `implemented`
- **Date:** 2026-09-23
- **Related:** [000-architecture.md](./000-architecture.md), [002-pwa-hardening.md](./002-pwa-hardening.md)

## 1. Context / current architecture

The running app is the App Router PWA in `app/`, `lib/service-worker.js`, and `lib/subscriptions.ts`. Nothing imports `styles/`, `public/vercel.svg`, `public/examples/`, or `public/images/`.

`main` still has the cloned boilerplate history. The Pages/Firebase tree is already deleted on disk but still recorded in that history. Credit for the starting repo lives in the README, not here.

`public/favicon.ico` stays. Manifest and the service worker use `/icon.png`, `/icon-192x192.png`, `/icon-512x512.png`, and `/badge.png`. Those root icons are different files from `public/images/`. `.env`, `.env.local`, `certificates/`, `node_modules/`, and `.next/` stay local and gitignored.

## 2. Problem and non-goals

**Problem:** The folder and git history still look like a fork of the upstream boilerplate. The next step is publishing to the owner's own GitHub repo.

**Non-goals:**

- Changing push, install, or offline behavior
- Deleting local secrets, certs, `node_modules`, or `.next`
- Force-pushing to the previous origin

## 3. Questions asked and answers

| Question | Answer |
| --- | --- |
| Delete unused `styles/`, `public/vercel.svg`, `public/examples/`, and `public/images/`, and add `.DS_Store` to `.gitignore`? | Yes. Make the tree look like a new repo. |
| Commit so it can be published? | Yes. One root commit, then push to `https://github.com/noowxela/nextjs-pwa-boilerplate`. |

## 4. Proposed approach, pros / cons, rejected alternatives

**Approach:**

1. Delete `styles/`, `public/vercel.svg`, `public/examples/`, and `public/images/`.
2. Replace the long upstream `.gitignore` with a short Next.js ignore list (`.DS_Store`, env files, `data/`, `certificates/`, `.next/`).
3. Drop the `legacy` exclude from `tsconfig.json`.
4. Replace `LICENSE` with MIT copyright 2026 Alex Woon Jun Rong. The shipped source is the App Router rewrite, not the upstream Pages app.
5. Replace local history with one root commit on `main`.
6. Point `origin` at `https://github.com/noowxela/nextjs-pwa-boilerplate` and push `main`.

**Pros:**

- A new GitHub repo will not show the upstream author history or the fork parent.
- `git push` cannot hit the upstream URL by accident.

**Cons / risks:**

- Local upstream history is dropped. The previous remote on GitHub is left as it is.
- `public/images/` 256 and 384 icons go away. The manifest does not use them.

**Rejected alternatives:**

| Alternative | Why not |
| --- | --- |
| Commit on top of the 22 upstream commits | GitHub would still show the upstream history |
| `git clean -fdx` | Would remove `.env.local`, certs, and `node_modules` |
| Push to the current `origin` | That remote is not this owner's repo |

## 5. Acceptance criteria and verification

- [x] No `styles/`, `public/vercel.svg`, `public/examples/`, or `public/images/`
- [x] `.DS_Store`, `.env`, and `certificates/` are ignored
- [x] `public/favicon.ico` and manifest icons still present
- [x] `origin` is `https://github.com/noowxela/nextjs-pwa-boilerplate`
- [x] `main` has one commit and does not list the previous authors
- [x] `npm run build` succeeds
- [x] `main` is pushed to that repo

## 6. Status history

| Date | Status | Note |
| --- | --- | --- |
| 2026-09-23 | draft | Cleanup scoped |
| 2026-09-23 | approved | Unfork locally; one root commit; do not push |
| 2026-09-23 | note | File cleanup and README credit done. Root commit not created. |
| 2026-09-23 | implemented | One root commit pushed to noowxela/nextjs-pwa-boilerplate |
