# Design Guidelines

Design system and conventions for the fitr UI. Every rule here is verified against the codebase — tokens live in `src/styles/theme.css`, component primitives in `src/app/components/Page.tsx`.

## Related documents

- **`AGENTS.md`** — repo setup, build commands, the `routes.ts`/`routes.tsx` shadowing gotcha, component layer notes, and other implementation caveats. Read before editing code.
- **`brand-direction.md`** — brand principles, core surfaces, naming explorations, and future opportunities. Authoritative for product naming and surface roles.
- **`ui.md`** — high-level UI reference for the layout and intended role of each surface. Meant for alignment, not implementation detail.

Note: the brand docs use product vocabulary (Flow/Drops/Studio) that does not yet match the codebase (ForYou/`/post`/Stylist). See `brand-direction.md` for the mapping.

## Tokens & color

All colors are CSS variables in `theme.css`, re-exported to Tailwind via `@theme inline`. Use the Tailwind utility (`bg-card`, `text-muted-foreground`, `border-border`) — never raw hex values in components.

| Token | Light | Use for |
|---|---|---|
| `background` | `#ffffff` | Page background |
| `foreground` | `oklch(0.145 0 0)` | Primary text, filled buttons |
| `card` | `#ffffff` | Card/section surfaces |
| `muted` | `#ececf0` | Subtle backgrounds, icon-on-avatar badges |
| `muted-foreground` | `#717182` | Meta text, timestamps, icons |
| `accent` | `#e9ebef` | Hover backgrounds, active tab pills |
| `destructive` | `#d4183d` | Destructive actions (log out, remove) |
| `border` | `rgba(0,0,0,0.1)` | All borders |

- **Selected/active fill:** `bg-foreground text-background` — used for tab pills, filter chips, selected store rows. Never use `zinc-800` or other raw grays.
- **Brand gradient (avatars + selected tags only):** `bg-gradient-to-br from-purple-400 to-pink-400`. No other gradients in the app.
- **Dark overlays (feed):** `bg-white/15`, `border-white/20`, `text-white` with `backdrop-blur-sm`. Only on dark/photo backgrounds.

## Typography

Font stack: `--font-family-sans` lists **Inter** first, followed by `ui-sans-serif, system-ui, -apple-system, ...` (`src/styles/theme.css`). Note: Inter is **never loaded as a webfont** — `src/styles/fonts.css` is empty and there is no `@font-face` or Google Fonts link. In practice the app renders in the system UI font (San Francisco on Apple, Roboto/system-ui elsewhere). Treat Inter as the intended font, not a guaranteed one. Base size 16px (`--font-size`). All text utility classes override the base element defaults in `@layer base`.

| Class | Size | Weight | Use |
|---|---|---|---|
| `text-xs` | 12px | normal | Meta, timestamps, captions |
| `text-sm` | 14px | normal/medium | Body text, usernames, labels |
| `text-base` | 16px | medium | Default body |
| `text-lg` | 18px | semibold | Page titles (`app-page-title`) |
| `text-xl` | 20px | semibold | Stat numbers |
| `text-2xl` | 24px | semibold | Hero numbers |

**Weight rules:**
- `font-semibold` — page titles, section titles, button labels.
- `font-medium` — usernames, list item titles, active tab text.
- `font-normal` — body copy, meta, descriptions. Never bold body text.

## Layout primitives

### Page structure

```
<PageShell>
  <PageHeader title="..." trailing={...} />   // optional
  <div className="app-page-content space-y-4">
    <PageSection className="p-4">...</PageSection>
  </div>
</PageShell>
```

- **`PageShell`** — wraps the page in `app-page` (`min-h-full bg-background text-foreground`).
- **`PageHeader`** — sticky, blurred, bottom-bordered. `title` is optional (omit on pages where nav pills or content signal the surface). Use `leading`/`trailing` for actions. Note: it **always renders** the `<header>` shell, so `<PageHeader />` with no props leaves a blank sticky bar — omit the component entirely on pages that don't need it.
- **`PageSection`** — renders `<section class="app-surface {className}">`. `app-surface` = `rounded-2xl border border-border bg-card` (no shadow). Pass padding via `className`.

### Content container

`app-page-content` = `mx-auto w-full max-w-2xl px-3 pt-3 pb-3`. The `max-w-2xl` cap centers content on wide screens. All page content goes inside this.

### Bottom navigation

A persistent `h-16` nav pinned to the bottom via flexbox (`Layout` is `flex h-[100dvh] flex-col`; `<main>` is `flex-1`, `<nav>` is `shrink-0`). Five items: four `NavLink`s (Home `/`, Bell `/notifications`, PlusSquare `/post`, Sparkles `/stylist`) plus a `motion.button` for Profile `/profile` (custom so it can detect press-and-hold for the account switcher). Active = `text-foreground`, inactive = `text-muted-foreground`. Each item is `min-w-[44px] min-h-[44px]` (touch target). Safe-area insets applied via `env()` on the outer container and nav.

## Spacing

| Context | Value |
|---|---|
| Between sections | `space-y-4` (in `app-page-content`) |
| Inside section, standard | `p-4` |
| Inside section, spacious/hero | `p-5` |
| Inside section, tab bar | `p-3` |
| Image-only section | `overflow-hidden p-0` |
| Between list rows | `space-y-1` |
| Inside list row | `px-2 py-2` |
| Grid gap (3-col) | `gap-1` (post grids), `gap-2` (wardrobe) |

## Radius

| Element | Class |
|---|---|
| Cards, sections, image thumbnails | `rounded-2xl` |
| Avatars, action buttons, pills, CTAs | `rounded-full` |
| Small sub-elements (icon badges, store covers) | `rounded-xl` |
| Chips | `rounded-md` (`app-chip`) |

Never use arbitrary radius (`rounded-[1.5rem]`, etc.). Stick to the scale.

## Avatars

- **List rows:** `h-10 w-10 rounded-full overflow-hidden` with `<img object-cover>`.
- **Profile hero:** `h-20 w-20 rounded-full ring-1 ring-border` (light bg) or `ring-white/15` (dark overlay).
- **Icon badge on avatar:** small `h-5 w-5` circle in bottom-right corner, `bg-foreground text-background` for activity icons, `bg-blue-500 text-white` for messages. Wrap in a `bg-background` ring so it clips cleanly.
- **Gradient avatar (initials):** `bg-gradient-to-br from-purple-400 to-pink-400 text-white` — only when no photo is available.

## Icons

Library: **lucide-react** exclusively.

| Context | Size | Class |
|---|---|---|
| Bottom nav | 24px | `w-6 h-6` |
| Feed action buttons (overlay) | 20px | `w-5 h-5` |
| Inline, list-leading, section-header | 16px | `w-4 h-4` |
| Icon badge on avatar | 12px | `h-3 w-3` |

Color: `text-muted-foreground` by default. `text-white` on dark overlays. `text-destructive` for destructive actions. `text-background` when inside a `bg-foreground` fill.

## Section labels

Two distinct patterns — don't mix them:

1. **Over-line label** (inside a card, above a list): `text-xs font-medium uppercase tracking-wider text-muted-foreground`. Used for "Source", "Recent", "Caption", "Activity", "Messages". No icon.

2. **Section heading** (a real heading): `app-section-title` = `text-base font-semibold tracking-tight text-foreground`. Often paired with a leading `w-4 h-4 text-muted-foreground` icon. Used for "Analytics", "Manage stores", "Stores Near You", "Related post".

3. **Chip** (inline tag/badge): `app-chip` = `rounded-md bg-muted px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground`. For step indicators, status tags, type labels.

## Buttons & CTAs

| Type | Style |
|---|---|
| **Primary CTA** (full-width) | `h-11 w-full rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90 active:scale-[0.98]` |
| **Sticky CTA** | Same as primary + `sticky bottom-4 shadow-sm` |
| **Secondary** (shadcn `Button variant="outline"`) | Bordered card-style |
| **Ghost icon** (header actions, back) | `Button variant="ghost"` or bare `h-9 w-9 rounded-full hover:bg-muted/60` |
| **Tag pill** (toggleable) | `rounded-full px-3 py-1 text-xs font-medium` — selected: gradient fill; unselected: `border border-border bg-card text-muted-foreground hover:bg-muted/60` |

- Never introduce new button shapes. Use `rounded-full` for all CTAs and pill-style toggles, `rounded-2xl` for card-style buttons.
- Destructive buttons: `bg-destructive text-white hover:bg-destructive/90`.

## Motion

`motion` v12, imported from `motion/react`. The patterns below are centralized in **`src/app/components/motion.ts`** (`usePressFeedback`, `usePanelMotion[WithScale]`, `useTabPanelMotion`, `useFadeUpVariants`, `useScaleInVariants`, `staggerVariants`) — prefer these helpers over hand-rolling.

- **Press feedback:** `whileTap: { scale: 0.9–0.98 }` with `transition={{ duration: 0.15, ease: "easeOut" }}`. Standard for all interactive elements.
- **Reduced motion:** gate animations with `const shouldAnimate = !useReducedMotion()`. Pass `whileTap={shouldAnimate ? { scale: 0.98 } : undefined}`.
- **Page/panel transitions:** `initial: { opacity: 0, y: 8 }`, `animate: { opacity: 1, y: 0 }` (`transition: { duration: 0.2, ease: "easeOut" }`), `exit: { opacity: 0, y: -8 }`. Post adds `scale: 0.98` to both phases (`usePanelMotionWithScale`).
- **Staggered entrances (items/sections):** `useFadeUpVariants` / `useScaleInVariants` use `duration: 0.25, ease: "easeOut"` with `staggerChildren: 0.08`.
- **Feed like animation:** `scale: [1, 1.35, 1]` over 0.3s.

## Lists & rows

**Compact list row** (Search results, store lists):
```
flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card p-3
```

**Tappable row inside a section** (notifications, menu options):
```
flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-muted/60
```

**Unread state:** add `bg-accent/30` to the row. Unread dot: `w-2 h-2 rounded-full bg-blue-500` or an icon badge.

**Row structure:** avatar (left, `h-10 w-10`) → text block (`min-w-0 flex-1`, title `text-sm font-medium`, subtitle `text-xs text-muted-foreground truncate`) → meta (`shrink-0`, time + chevron or just time).

## Images

- **Feed post (full-bleed):** `absolute inset-0 w-full h-full object-cover` on a `bg-black` container.
- **Post grid thumbnail:** `aspect-square w-full object-cover rounded-2xl bg-muted`.
- **Card image (media):** `aspect-[4/5] w-full object-cover` inside `overflow-hidden rounded-2xl bg-muted`.
- **Avatar:** `rounded-full h-full w-full object-cover`.
- All images get `bg-muted` as a loading/failure backdrop.

## Tab bars (pill style)

Used by Search and Stylist for in-page tab switching:
```
inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1
```
Each tab: `rounded-full px-3 py-1 text-xs font-medium`. Active: `bg-foreground text-background`. Inactive: `text-muted-foreground hover:bg-muted/60 hover:text-foreground`.

## Full-height routes

Routes that need to fill the viewport without scrolling (e.g. `/stylist`) set `isFullHeightRoute` in `Layout.tsx`. The `<main>` switches from `overflow-y-auto` to `overflow-hidden`. The page uses `<PageShell contentClassName="h-full min-h-0 overflow-hidden bg-background pb-0">` and its content wrapper uses `flex h-full min-h-0 flex-col`. (ForYou is also full-height but skips `PageShell` entirely — it's a full-bleed snap-scroll feed on a `bg-black` container.)

## Don'ts

- No raw `zinc-*` colors — use `foreground`/`background` tokens.
- No `shadow-sm` on sections — `app-surface` is intentionally flat.
- No `text-white` on light backgrounds — use `text-foreground` or `text-muted-foreground`.
- No `ring-white/15` on light backgrounds — use `ring-border`.
- No arbitrary radius values — use the Tailwind scale.
- No gradients except `from-purple-400 to-pink-400` for avatars/selected tags.
- No comments in shipped code.