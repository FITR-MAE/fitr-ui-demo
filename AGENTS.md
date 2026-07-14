# Agents

## Related documents

- **`documentation/design-guidelines.md`** — design system: tokens, typography, layout primitives, spacing, radius, icons, buttons, motion, lists, images, and don'ts. Verified against `theme.css` and `Page.tsx`. Consult before adding UI.
- **`documentation/brand-direction.md`** — brand principles, core surfaces, naming explorations, future opportunities. Authoritative for product naming.
- **`documentation/ui.md`** — high-level UI reference for each surface's role and structure. Alignment-oriented, not implementation detail.

## Commands

```bash
bun install        # use Bun — bun.lock is the tracked, newer lockfile
bun run dev        # vite dev server, binds 0.0.0.0
bun run build      # vite build → dist/
```

The README says `bun install` / `bun run dev` and that is correct. Do **not** use `pnpm` despite `pnpm-workspace.yaml` and `pnpm-lock.yaml` existing — `pnpm-lock.yaml` is untracked and stale; `bun.lock` is the source of truth.

No `test`, `lint`, or `typecheck` scripts are defined in `package.json`. There is no CI (`.github/` absent).

## Critical: duplicate routes file

`src/app/App.tsx` does `import { router } from "./routes"`. There are **two** files that resolve to that specifier:
- `src/app/routes.ts` — stale, missing the `ActivityDetail` route
- `src/app/routes.tsx` — current, the one you almost certainly want to edit

Vite's default extension resolution tries `.ts` before `.tsx`, so **`routes.ts` silently shadows `routes.tsx`**. Edits to `routes.tsx` will appear to do nothing. Either edit `routes.ts`, delete it, or change the import to an explicit `./routes.tsx`. Do not assume the `.tsx` file is the active one.

## App structure

- Entry: `src/main.tsx` → `src/app/App.tsx` (renders `RouterProvider`) → `src/app/routes.*` (`createBrowserRouter`).
- All routes are children of a single root `Layout` (`src/app/components/Layout.tsx`) which renders `<Outlet />` plus a fixed bottom nav. Routes: `/` (ForYou), `/search`, `/post`, `/stylist`, `/profile`, `/notifications`, `/activity/:id` (currently unreachable — see the duplicate routes caveat below).
- `Layout` dynamically sets `document.title` and meta tags per pathname in a `useEffect` — there is no `<head>` meta component. Update `getRouteMeta` in `Layout.tsx` when adding a route.
- `/stylist` is treated as a full-height route (no scroll container on `<main>`); other routes scroll. See `isFullHeightRoute` in `Layout.tsx` (`location.pathname === "/stylist"`).

## Aliases & asset imports

- `@/` → `./src` (vite.config.ts).
- `vite.config.ts` adds `assetsInclude: ["**/*.svg", "**/*.csv"]` for raw imports. The config comment says: never add `.css`, `.tsx`, or `.ts` to `assetsInclude`.

## Styling (Tailwind v4)

- Tailwind v4 via `@tailwindcss/vite`. **No** `tailwind.config.*` — config lives in CSS. `postcss.config.mjs` is an empty stub; do not add `tailwindcss`/`autoprefixer` there (the Vite plugin handles it).
- CSS entry: `src/styles/index.css` imports `fonts.css` → `tailwind.css` → `theme.css`. Loaded once in `src/main.tsx`. Note: `fonts.css` is **empty** — Inter is named first in the `--font-family-sans` stack (`theme.css`) but is never loaded as a webfont, so the app renders in the system UI font (SF/Roboto/system-ui).
- `tailwind.css` uses `@import 'tailwindcss' source(none)` plus `@source '../**/*.{js,ts,jsx,tsx}'` — class scanning covers `src/`. If you add classes outside `src` (e.g. in `public/`), they will not be scanned. It also imports `tw-animate-css`.
- Design tokens (`--background`, `--foreground`, `--primary`, `--muted`, `--accent`, `--border`, etc.) are defined as CSS variables in `src/styles/theme.css` and re-exported to Tailwind via `@theme inline`. Light values are hex/oklch literals; dark mode overrides live under the `.dark` class. `@custom-variant dark (&:is(.dark *))` defines the `dark:` variant.

## Theme switching caveat

Dark mode tokens exist (`.dark` in `theme.css`) and `next-themes` is a dependency, but **no theme provider is wired in `src/main.tsx` or `App.tsx`**. `next-themes` is only imported inside `src/app/components/ui/sonner.tsx` (the shadcn Toaster wrapper). If you use `<Toaster />` without adding a `<ThemeProvider>`/`next-themes` `ThemeProvider`, theme detection will fall back to system. Do not assume dark mode is reachable in the app today.

## Component layer

- `src/app/components/Page.tsx` exports `PageShell`, `PageHeader`, `PageSection`. Pages compose via `<PageShell><PageHeader/><div className="app-page-content">…<PageSection className="p-4">…`. `PageHeader` renders `title`/`subtitle`/`leading`/`trailing` into `app-page-header` / `app-page-header-inner` / `app-page-title` (classes in `theme.css`). `PageSection` renders `<section className="app-surface {className}">` — it applies `app-surface` (rounded-2xl border bg-card, no shadow) and merges the page-supplied `className` for padding (e.g. `p-4`, `p-5`, `overflow-hidden p-0`).
- `src/app/components/ui/` is the shadcn/ui component set (generated). `utils.ts` exports `cn()` (clsx + tailwind-merge). Prefer these over hand-rolled equivalents.
- `src/app/components/figma/ImageWithFallback.tsx` exists but is **not imported by any page**; pages use plain `<img>`. Don't assume it's wired in.
- Icons: `lucide-react` exclusively. Tab/nav icons are `w-6 h-6`; feed overlay action icons `w-5 h-5`; inline/leading/section-header icons `w-4 h-4`.
- `AccountProvider` (`src/app/components/AccountProvider.tsx`) wraps the app in `App.tsx` and exposes `useAccounts()` (accounts, `activeAccountId`, `activeAccount`, `setActive`, `addAccount`, `logout`). Demo accounts: one personal (Sarah Connor) and one business (Maison Margiela). `Profile.tsx` switches its entire body based on `activeAccount.type === "business"` (recharts analytics + store management vs. the personal tabs). Press-and-hold (~450ms, `LONG_PRESS_MS` in `Layout.tsx`) on the user nav icon opens the `AccountSwitcher` bottom `Drawer` (vaul); a quick tap navigates to `/profile`. A `Toaster` (sonner) is mounted in `App.tsx` for log-out feedback.
- `CommentsPanel` and `SharePanel` (`src/app/components/`) are vaul `Drawer`-based bottom sheets for post interactions (a comments thread with replies + likes, and share targets). Wired into ForYou; `CommentsPanel` exports a `mockComments` seed. Both use the `motion.ts` press-feedback helpers.

## Motion

`motion` (v12, import from `motion/react`) is used heavily. `whileTap: { scale: 0.9–0.98 }` is the standard press feedback pattern; animations are gated by `useReducedMotion()`. Prefer the centralized helpers in **`src/app/components/motion.ts`** — `usePressFeedback`, `useShouldAnimate`, `usePanelMotion` / `usePanelMotionWithScale`, `useTabPanelMotion`, `useFadeUpVariants`, `useScaleInVariants`, and `staggerVariants` — rather than hand-rolling `whileTap`/`shouldAnimate` per component. It is already imported by Layout, AccountSwitcher, CommentsPanel, SharePanel, Post, Profile, Search, Stylist, and ForYou.

## Untracked / external directories

- `mini/fitr-ui-demo/` is a **separate git checkout** (has its own `.git`) and is untracked from the parent repo. Do not edit it as part of tasks in this repo — it is a snapshot/reference.
- `ATTRIBUTIONS.md` notes shadcn/ui (MIT) and Unsplash assets.

## Figma origin

This is a Figma Make export. Original design: https://www.figma.com/design/mFPVHzl88bwe4nMLLYtNuH/Untitled .