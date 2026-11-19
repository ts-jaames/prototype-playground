# Prototype Playground

A personal collection of small, self-contained prototypes in one Next.js app.

- Prototypes live in `app/prototypes/<slug>/` and are created by coding agents following [`AGENTS.md`](./AGENTS.md).
- The site is password-gated in production (`PLAYGROUND_PASSWORD`). Prototypes flagged `"public": true` are also served at `/p/<slug>`.

```bash
npm install
npx playwright install chromium   # for thumbnails / OG capture
npm run dev
npm run verify                    # validate + lint + typecheck + build
```

## Deploying

Import the repo in Vercel (framework preset: Next.js). Set `PLAYGROUND_PASSWORD` for **Production and Preview**. Optionally set `NEXT_PUBLIC_SITE_URL` to the production origin. Every pull request gets a preview deployment; `npm run preview-url` prints its link.
