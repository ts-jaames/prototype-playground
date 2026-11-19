# Prototype Playground: Rules for Agents

Read this whole file before you touch anything. Every rule here is non-negotiable unless the owner explicitly overrides it for a specific task. The owner often works from a phone: they can't easily inspect your work, so the rules and checks below are how quality is guaranteed.

This repo is one Next.js app that holds many small, self-contained prototypes (apps, games, simulations, tools). Prototypes are only ever created by a coding agent following this file. Never add a "new prototype" button, form, or create API to the app.

---

## Map

```
app/
├── page.tsx                    gallery (search, tags, hidden toggle, static thumbnails)
├── layout.tsx                  root layout: ThemeProvider (dark default + system), Tooltip, Toaster
├── prototypes/
│   ├── layout.tsx              slim header (back, title, theme) above every private prototype
│   ├── [slug]/page.tsx         catch-all: unknown slugs → 404
│   └── <slug>/                 ONE FOLDER PER PROTOTYPE (see "Creating a prototype")
├── p/[slug]/page.tsx           public route: same component, only for "public": true, + OG tags
├── login/                      password page
└── api/
    ├── auth/route.ts           sets the auth cookie
    ├── <slug>/...              private API routes for a prototype
    └── public/<slug>/...       API routes a PUBLIC prototype needs (not behind the gate)
components/
├── ui/                         shadcn/ui (all installed; vendored, see "Platform notes")
├── playground/controls/        schema-driven control panel library
├── playground/collapse.tsx     height-animated open/close wrapper
├── playground/hooks.ts         useCssColor, usePrefersReducedMotion
└── gallery/                    homepage gallery components
lib/
├── prototypes.ts               discovery + metadata for the app (build time)
├── prototype-meta.ts           shared fs/metadata helpers (also used by scripts)
└── auth.ts                     gate helpers
proxy.ts                        password gate (Next 16 renamed middleware → proxy)
public/thumbnails/              <slug>-light.jpg / <slug>-dark.jpg (640x400)
public/og/                      <slug>.png / <slug>.mp4 for public prototypes (1200x630)
scripts/                        validate, thumbnails, og, preview-url
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server (gate disabled outside production) |
| `npm run verify` | validate + lint + typecheck + production build. **Run before every PR.** |
| `npm run validate` | checks every prototype against the mechanical rules below |
| `npm run thumbnails -- --slug a` | builds, then captures light + dark thumbnails. `--slug a,b` or repeat `--slug` for several, `--missing` for only missing ones, no flag for all, `--no-build` to reuse `.next` |
| `npm run og -- --slug a` | captures `og:image` + `og:video` for a **public** prototype (same flags) |
| `npm run preview-url -- --slug a` | waits for the PR's preview deployment and prints the direct link |

First run on a new machine: `npx playwright install chromium`.

---

## Creating a prototype (start to pull request)

1. **Branch.** `git checkout main && git pull && git checkout -b proto/<slug>`.
2. **Slug.** Lowercase kebab-case, short, descriptive (`pendulum-wave`, `recipe-scaler`). It is the folder name and the URL.
3. **Folder.** Create `app/prototypes/<slug>/` containing at least:
   - `page.tsx`: thin route (~60 lines max, usually ~10)
   - `metadata.json`: see "Metadata"
   - `HOW_IT_WORKS.md`: see "Documentation"
   - `types.ts`, `data.ts`, pure logic files, one file per meaningful component (see "Self-contained and decomposed")
4. **Follow every rule in "Rules for every prototype"** below. Read `app/prototypes/flow-field/` first; it is the reference implementation.
5. **Look at it.** Run the dev server and check it at 375px wide and on desktop, in dark and light. Use Playwright or the browser tool for real screenshots; don't assume.
6. **Thumbnails.** `npm run thumbnails -- --slug <slug>`, then open both images in `public/thumbnails/` and confirm they show the prototype in a good state.
7. **Verify.** `npm run verify` must pass with zero errors.
8. **Commit and PR.** Commit everything (code, metadata, docs, thumbnails) together, push, and `gh pr create --fill` (title: `New prototype: <Title>`).
9. **Post the preview link.** `npm run preview-url -- --slug <slug>`, then end your reply with that link so the owner can open it from their phone. If no preview deployment appears, post the PR link and say so.

`page.tsx` template:

```tsx
import type { Metadata } from "next";

import meta from "./metadata.json";
import { MyThing } from "./my-thing";

export const metadata: Metadata = { title: meta.title, description: meta.description };

export default function MyThingPage() {
  return <MyThing />;
}
```

The page must be a default export with **no props** (no `params` or `searchParams`); `/p/<slug>` renders the same component. Put state in client components.

## Editing a prototype

Same branch → verify → PR → preview-link flow. On every edit: bump `updatedAt`, update `HOW_IT_WORKS.md` if anything it describes changed, and regenerate thumbnails if anything visual changed.

## Making a prototype public

**Only when the owner explicitly asks for that specific prototype.** Never as a side effect, never "while you're at it."

1. Set `"public": true` in its `metadata.json` (and bump `updatedAt`).
2. If it calls an API route, move that route to `app/api/public/<slug>/` (the gate blocks everything else) and think about abuse: rate limits, input size caps, cost caps on model calls.
3. **Always** run `npm run og -- --slug <slug>` to create `public/og/<slug>.png` (og:image) and `public/og/<slug>.mp4` (og:video). Open both and confirm they look great; that's what people see when the link is shared. `npm run validate` fails if a public prototype is missing them.
4. Share link: `<site>/p/<slug>`. Unknown or private slugs on `/p/` return 404, never a login redirect, so private names don't leak.

---

## Rules for every prototype

### Metadata

Every prototype has `metadata.json`:

```json
{
  "title": "My Prototype",
  "description": "What it does",
  "tags": ["tag1"],
  "createdAt": "YYYY-MM-DD",
  "updatedAt": "2026-01-01T12:00:00.000Z",
  "hidden": false,
  "public": false
}
```

- Bump `updatedAt` (full ISO timestamp, `new Date().toISOString()`) on **every** edit. The gallery sorts by it.
- `hidden: true` hides it from the gallery unless "Hidden" is toggled on.
- `public` stays `false` unless the owner explicitly asked (see above).
- Tags: lowercase, reuse existing tags before inventing new ones.

### Documentation

Every prototype has `HOW_IT_WORKS.md`, kept current on every change, with these `##` sections:

- **What It Does**: 1–2 sentences
- **Architecture**: ASCII data-flow diagram
- **Frontend** and/or **API**: bullets on state, shortcuts, responsive behavior; request/response shapes
- **AI Usage** (required if any model is called): model ID, why that model, how it's called, key parameters, system prompt summary, user prompt shape
- **Key Dependencies**, **Component Tree**, **Error Handling**, **File Structure**

`npm run validate` checks that the sections exist.

### Self-contained and decomposed

- A prototype lives entirely in its own folder (plus its own `app/api/<slug>/` routes) and never imports from another prototype. Reusable things belong in `components/` or `lib/`, and only when two or more prototypes need them.
- Never write one giant file. Keep `page.tsx` thin and split out:
  - `types.ts`: shared types
  - `data.ts`: mock data, constants, config, control schemas
  - pure logic (`simulation.ts`, `search.ts`, `utils.ts`, …): no React, testable on their own
  - one file per meaningful UI component, named descriptively (`score-board.tsx`, not `components.tsx`)
- Files over ~300 lines get a validator warning. Split them.

### Design system

- Use the shared components in `components/ui/` and the design tokens: `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `bg-muted`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `bg-secondary`, `bg-accent`, `border-border`, `ring-ring`, `text-destructive`, `bg-chart-1`…`bg-chart-5` for data/accent colors.
- **Never hardcode colors**: no `bg-black`, `text-white`, `bg-blue-500`, hex values, `rgb()`, or inline color styles. The validator fails on these.
- For canvas / WebGL / SVG drawn in JS, read tokens with `useCssColor("chart-1")` from `@/components/playground/hooks`; it updates when the theme changes.
- **Check the component source in `components/ui/` before using a prop.** This shadcn version (radix-nova) differs from older docs: e.g. `Button` sizes are `xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg`, components import `cn` from the `cn` package.

### Clean and minimal by default

- Start with a single centered column: `mx-auto w-full max-w-2xl px-4`. No sidebars, split panels, or tab-heavy layouts unless asked. (The control panel sidebar from `ControlsLayout` is the one exception.)
- Build only what was asked for. No extra dashboards, charts, stats, settings, or views.
- Fewer elements is better; every element must justify its existence. Plain badges (`variant="secondary"` or `"outline"`) over colorful ones. No decorative icons.
- Minimal interface copy. Cut captions that restate labels, helper text nobody needs, and marketing-style headings.

### Control panels

Anything with tunable parameters (speed, color, size, count, …) gets a control panel, never scattered inputs. Use the shared library:

```tsx
// data.ts
import { defineControls } from "@/components/playground/controls";
export const NAMESPACE = "my-slug";
export const controls = defineControls({
  speed: { type: "slider", label: "Speed", min: 0.1, max: 5, step: 0.1, default: 1 },
  count: { type: "slider", label: "Count", min: 1, max: 500, default: 100 },
  mode:  { type: "select", label: "Mode", default: "a", options: [{ value: "a", label: "A" }, { value: "b", label: "B" }] },
  trails: { type: "toggle", label: "Trails", default: true },
  color: { type: "color", label: "Color", default: "chart-1" },          // design-token swatches
  paused: { type: "toggle", label: "Paused", default: false, randomize: false }, // excluded from Randomize
});

// my-thing.tsx ("use client")
const c = useControls(NAMESPACE, controls); // c.values is fully typed; persisted per prototype
return (
  <ControlsLayout panel={<ControlPanel controls={c} />}>
    <Subject settings={c.values} />
  </ControlsLayout>
);
```

- You get persistence (try/catch, loaded on mount, namespaced), Reset, and **Randomize** for free. Every panel must have both Reset and Randomize; `ControlPanel` always renders them.
- `ControlsLayout` places the panel in a sidebar on desktop (`lg:`) so it never covers the subject, and in a bottom sheet behind a floating button on mobile.
- Need a control type that doesn't exist? Add it to `components/playground/controls/` (schema + field + randomize + sanitize) rather than hand-rolling a one-off panel.

### Mobile first

- Everything must work at ~375px wide with no horizontal scrolling.
- Tap targets at least 44×44px. `globals.css` enforces this for shadcn buttons, toggles, inputs and selects on touch devices; custom tappables (`<button>`, swatches, list rows) need `size-11` / `min-h-11` yourself.
- Icon-only buttons on mobile, labels from `sm:` up: `<Icon /><span className="hidden sm:inline">Label</span>` plus an `aria-label`.
- No hover-only interactions. Every hover state needs a visible touch equivalent (`active:`, `focus-visible:`, or always-visible on touch).
- Code blocks wrap (global `pre { white-space: pre-wrap }`); never add horizontal scroll.
- Modals / lightboxes need visible prev/next buttons or swipe on mobile, not just keyboard shortcuts.
- Respect safe areas for anything fixed to the bottom: `bottom-[max(1rem,env(safe-area-inset-bottom))]`.

### Light and dark mode

- Design dark-first; light mode must also work, and it will if you only use tokens.
- Never hardcode a `dark` class on a page or element. The theme is global (`next-themes`, dark default, system supported).
- Use `useTheme()` / `resolvedTheme` only when *behavior* (not just color) changes by theme. For colors drawn in JS use `useCssColor`.

### Motion

- Rows or sections the user adds or removes animate their height open and closed; nothing pops in and makes the page jump. Use `Collapse` from `@/components/playground/collapse`: it animates in on mount automatically; to remove, set `open={false}` and delete the item in `onExited`. For shadcn `Collapsible`/`Accordion` content use `data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up`.
- Smooth deceleration curves only: `ease-(--ease-smooth)` (cubic-bezier(0.22, 1, 0.36, 1)) or `ease-out`. No bouncy overshoot, no spring overshoot.
- Respect `prefers-reduced-motion`. CSS durations are globally collapsed for those users; JS animation loops must check `usePrefersReducedMotion()` (e.g. start paused and render a still frame; see `flow-field`).
- **Verify animations actually run**: in the browser, read `getComputedStyle(el).animationName` / `transitionProperty`, or measure height mid-transition. Utility classes silently do nothing if their CSS isn't loaded.

### AI-backed prototypes

- Call models server-side in an API route (`app/api/<slug>/route.ts`). Never expose keys to the client; never prefix keys with `NEXT_PUBLIC_`. Keys live in Vercel env vars and `.env.local`.
- If a model generates UI or layout, put explicit layout constraints in the system prompt (max columns, max width, no wide tables, mobile-first). Defensive CSS is a backup, not the fix.
- Parse JSON from model output defensively: extract the first `{...}` block, `JSON.parse` in try/catch, validate the shape, and handle failure in the UI.
- Always wrap API routes in try/catch and return proper status codes (400 bad input, 401/403, 429, 500, 502 for upstream model errors) with a JSON `{ error }` body.
- Document it in **AI Usage** in `HOW_IT_WORKS.md`.

### Storage

- Wrap every `localStorage` access in try/catch (Safari private mode, quotas).
- Load on mount (`useEffect`), never during server render. Don't write until the saved value has been read, or the defaults will overwrite it (see `use-controls.ts`).
- Namespace keys per prototype: `pp:<slug>:<key>`.

### Thumbnails

- New prototype or any visual change → regenerate that prototype's thumbnails in the same commit (`npm run thumbnails -- --slug <slug>`).
- Global style change (tokens, `globals.css`, shared components) → regenerate all (`npm run thumbnails`).
- **Open the captured images before committing.** A stale or broken thumbnail is worse than none. If the default state looks empty, make the prototype's initial state look good (a thumbnail is a first impression) rather than faking the capture.
- The capture hides `[data-playground-chrome]` (the header). OG captures also hide `[data-playground-panel]` (control panel).

---

## Workflow rules

- Work on a branch (`proto/<slug>` for new prototypes, `fix/…` or `chore/…` otherwise). Never commit directly to `main`.
- When done: push and open a pull request with `gh pr create`. The PR triggers the CI check (validate, lint, typecheck, build) and a preview deployment.
- Before finishing, run `npm run verify` (validate, lint, type-check, production build). Don't open a PR with failures, and don't silence checks to make them pass.
- End every task by posting the preview link (`npm run preview-url -- --slug <slug>`) so the owner can open the prototype straight from their phone.
- When something goes wrong and gets fixed, add the lesson to **Lessons learned** below in the same PR, so it doesn't happen again. This file should grow over time. Keep entries to one or two lines: the symptom and the rule.

---

## Platform notes

- **Next.js 16.** `middleware.ts` is now `proxy.ts`. Read `node_modules/next/dist/docs/` before using an API you're unsure of.
- **Cache Components are off on purpose** (`next.config.ts`). With them on, `generateStaticParams` can't return an empty list (breaks `/p/[slug]` when nothing is public), `dynamicParams` is rejected, and every uncached read needs `<Suspense>`. Don't turn them on.
- **Discovery is build-time.** `lib/prototypes.ts` reads `app/prototypes/*/metadata.json` with `fs` during the build. Pages that use it must stay static; don't read the filesystem at request time.
- **The gate** runs only when `NODE_ENV=production` (Vercel previews + prod, `next start`). It needs `PLAYGROUND_PASSWORD` set for Production *and* Preview; without it nobody can sign in. Public paths: `/login`, `/api/auth`, `/p/*`, `/og/*`, `/api/public/*`, `/_next/*`.
- **`components/ui/` is vendored shadcn** (style `radix-nova`). Add components with `npx shadcn@latest add <name>`. Avoid editing them; wrap instead. If you must edit, keep it minimal; a re-add overwrites changes.
- **Icons:** `lucide-react`. Functional icons only.

## Suggested libraries

Install at the repo root, only when a prototype needs them.

| Need | Use |
|---|---|
| 3D / WebGL | `three`, `@react-three/fiber`, `@react-three/drei` |
| Physics | `@dimforge/rapier2d-compat` / `rapier3d-compat`, `matter-js` |
| Charts | `recharts` (installed, with `components/ui/chart.tsx`), or plain SVG for sparklines |
| Maps | `maplibre-gl` |
| Text layout / typography effects | `@chenglou/pretext` |
| Audio / synths | Web Audio API, `tone` |
| AI | `@anthropic-ai/sdk` (server-side only) |
| Generated UI from JSON | `json-render` or similar |
| Browser automation | `playwright` (installed: thumbnails, OG, visual checks, demo videos) |
| Native app wrapper | Capacitor, if a prototype graduates to the App Store |

WebGL/canvas libraries that touch `window` at import time: load them from a `"use client"` component, or with `next/dynamic` and `ssr: false`.

---

## Lessons learned

- **localStorage overwritten on mount.** A persist effect that runs on the first commit writes defaults over saved values (and React dev double-mounting then reads the defaults back). Gate writes on a `hydrated` state set after the load.
- **`asChild` triggers drop `data-slot="button"`.** `DropdownMenuTrigger asChild` + `Button` renders `data-slot="dropdown-menu-trigger"`. Style or query buttons by `data-variant`/`data-size`, not only `data-slot`.
- **OG video URLs must be absolute.** `metadataBase` absolutizes `og:image` but not `og:video`. `/p/[slug]` builds absolute URLs with `siteUrl()`.
- **Playwright "Executable doesn't exist".** The browser build doesn't match the installed `playwright`. Run `npx playwright install chromium`.
- **Canvas trails leave a faint residue** when fading with a low-alpha fill (8-bit rounding never reaches the background). Fine for effects; if a perfectly clean background matters, clear fully and redraw instead.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
