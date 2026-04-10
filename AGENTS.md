# Agents

## Dev server

```bash
bun run dev   # or: pnpm dev, npm run dev
```

Vite dev server binds to `0.0.0.0` and permits `.lhr.life` and `.ngrok-free.app` as allowed hosts (for local tunneling).

## Build

```bash
bun run build   # vite build → dist/
```

## Package manager

Use `pnpm` (pnpm-workspace.yaml at root). The README says `npm i` but that may not be accurate.

## Aliases

`@/` maps to `./src` (defined in vite.config.ts).

## SVG and CSV imports

SVG and CSV files are importable as raw assets (configured in `vite.config.ts`). Do not add `.css`, `.tsx`, or `.ts` to `assetsInclude`.

## Tailwind CSS v4

This repo uses Tailwind v4 via `@tailwindcss/vite`. There is no `tailwind.config.js` or `tailwind.config.ts` — configuration is done directly in CSS or via the Vite plugin. The `postcss.config.mjs` is a stub; Tailwind v4 auto-sets up PostCSS plugins.

## React Router v7

Routes are defined in `src/app/routes.tsx` using `createBrowserRouter`. The root layout component wraps all pages. Route path: `src/app/App.tsx` → `src/app/routes.tsx`.

## No test/lint/typecheck scripts

The package.json has only `build` and `dev` scripts. No tests, no lint, no typecheck configured.

## Figma export origin

This is a Figma-generated codebase. The original design is at `https://www.figma.com/design/mFPVHzl88bwe4nMLLYtNuH/Untitled`.

---

## Style Guide

### Colors

**Light mode palette:**
| Token | Value | Usage |
|---|---|---|
| `--background` | `#ffffff` | Page background |
| `--foreground` | `oklch(0.145 0 0)` | Primary text (near-black) |
| `--primary` | `#030213` | Buttons, active states (dark navy) |
| `--primary-foreground` | `oklch(1 0 0)` | Text on primary |
| `--secondary` | `oklch(0.95 0.0058 264.53)` | Secondary surfaces (lavender tint) |
| `--muted` | `#ececf0` | Subtle backgrounds |
| `--muted-foreground` | `#717182` | Meta text, timestamps |
| `--accent` | `#e9ebef` | Hover backgrounds (purple-gray) |
| `--destructive` | `#d4183d` | Error/danger states |
| `--border` | `rgba(0, 0, 0, 0.1)` | Subtle borders |

**Dark mode palette:**
| Token | Value |
|---|---|
| `--background` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.985 0 0)` (white) |
| `--secondary` | `oklch(0.269 0 0)` |
| `--muted` | `oklch(0.269 0 0)` |
| `--accent` | `oklch(0.269 0 0)` |
| `--border` | `oklch(0.269 0 0)` |

**Feed/overlay colors (always dark):**
- Action button background: `bg-white/15`
- Action button border: `border-white/20`
- Overlay gradient: `from-black/20 via-transparent to-black/75`
- User avatar ring on feed: `border-white/15`

**Avatar gradients:**
- Profile avatar: `from-purple-400 to-pink-400`

**Notification badge:** `bg-blue-500` (full red-500 for like state)

---

### Typography

**Font:** Inter (loaded in `src/styles/fonts.css`)

**Typographic scale:**
| Class | Size | Weight | Line height | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | normal/medium | 1.5 | Meta, timestamps, captions |
| `text-sm` | 14px | normal/medium | 1.5 | Body text, subtitles, list items |
| `text-base` | 16px | medium | 1.5 | Page titles, section headings |
| `text-lg` | 18px | semibold | 1.5 | Page titles (`app-page-title`) |
| `text-xl` | 20px | semibold | 1.5 | Stats numbers (profile) |
| `text-2xl` | 24px | semibold | 1.5 | h1 base |
| `text-3xl` | 30px | semibold | 1.5 | Profile avatar initial (`text-3xl`) |

**Font weights in use:**
- `font-normal` (400) — body copy, meta text
- `font-medium` (500) — usernames, subtitles, labels, list titles
- `font-semibold` (600) — page titles, section titles, button text

---

### Text Styles

**What should be bold (`font-semibold` or `font-medium`):**
- Page titles and section titles (always)
- Usernames in feed/messages (`text-sm font-medium`)
- List item titles (`text-sm font-medium`)
- Button labels
- Tab bar active state text

**What should NOT be bold:**
- Body text (`text-sm font-normal`)
- Meta/timestamps (`text-xs text-muted-foreground`)
- Subtitles and descriptions (`text-xs text-muted-foreground`)
- Input placeholder text

**Text decoration:**
- No `text-decoration` styles observed in the codebase
- No `<em>` tags used — emphasis is done with `font-medium` or weight
- No underlined text (links use `hover:underline` or are styled as ghost buttons)
- No `line-through` or strikethrough

**Text transforms:**
- Chip labels: `uppercase tracking-[0.16em]` (via `app-chip`)
- Confidence percentages: `uppercase tracking-[0.14em]`
- No sentence-case or title-case transforms applied via CSS

---

### Icons

**Icon library:** `lucide-react` (used exclusively across all pages)

**Icon sizes:**
| Context | Size | Class |
|---|---|---|
| Tab bar / nav | 24px | `w-6 h-6` |
| Feed action buttons | 20px | `w-5 h-5` |
| List item leading icon | 16px | `w-4 h-4` |
| Inline icon (settings row) | 16px | `w-4 h-4` |
| Empty state | 48px | `w-12 h-12` |
| Settings icon (in header) | 18px | `h-[18px] w-[18px]` |

**Icon color:** Always `text-muted-foreground` unless on a dark/overlay background where it should be `text-white`

**Icon placement:**
- List items: leading (left), before text label
- Feed overlay: centered inside action button container
- Tab bar: centered, full width of tab
- Stat label: never has icon — just text
- Section headers may have leading icon + title on same line

---

### Gradients

**Allowed gradient — Avatar (user avatars only):**
```
bg-gradient-to-br from-purple-400 to-pink-400
```
- Direction: top-left (`br`) to bottom-right
- Colors: purple-400 → pink-400
- Used for: message avatars, notification avatars, profile hero avatar, action button icons (media selection)

**Allowed gradient — Selected tag pill:**
```
bg-gradient-to-br from-purple-400 to-pink-400
```
- Same gradient as avatar, used when tag/style preference is selected

**No other gradients in the codebase** — buttons are solid, cards are solid, surfaces are solid. Do not introduce new gradients.

---

### Images

**Feed post image (full-screen):**
```
absolute inset-0 w-full h-full object-cover
```
- Covers entire viewport height (`100dvh`)
- No border, no border-radius (full bleed)

**Post grid thumbnail (Profile):**
```
rounded-2xl bg-muted overflow-hidden
aspect-square w-full object-cover
```
- Border-radius: `rounded-2xl` (~16px)
- Background: `bg-muted` (visible if image fails to load)
- Aspect ratio: square (`aspect-square`)
- Gap between items: `gap-1`
- Grid: 3 columns (`grid-cols-3`)

**Wardrobe item thumbnail:**
```
rounded-xl bg-muted overflow-hidden
aspect-square w-full object-cover
```
- Border-radius: `rounded-xl` (~12px)
- Label overlay: `bg-black/50` at bottom with `text-xs text-white`

**Avatar image (user):**
```
rounded-full bg-gradient-to-br from-purple-400 to-pink-400
```
- No image src used — avatar uses gradient background + initial letter
- Size: `h-10 w-10` (40×40) for list items, `h-24 w-24` (96×96) for profile hero

**Media card thumbnail (Post page):**
```
aspect-[4/5] w-full object-cover rounded-2xl overflow-hidden
```

**Image borders:** None on any image except avatar uses gradient ring (`border border-white/15` in feed overlay context)

---

### Buttons

**Primary button** (filled, dark — actions: Share, Next, Submit):
```
h-10 rounded-full bg-foreground text-background px-5 text-sm font-semibold
```
- Hover: `hover:bg-foreground/90`
- Active: `active:scale-95`
- Used in: Post page Share/Next, confirmations

**Secondary button** (outlined card — media options, list rows):
```
rounded-2xl border border-border bg-card p-4
```
- Internal: `flex items-center gap-4`
- Hover: `hover:bg-muted/60`
- Active: `active:scale-[0.98]`
- Icon container: `h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400`
- Text: `text-sm font-medium`, subtitle `text-xs text-muted-foreground`
- Used in: Post media selection cards, settings menu rows

**Tertiary button** (ghost icon — back, close):
```
h-11 w-11 rounded-full border border-border bg-card
```
- Icon only, centered
- Hover: `hover:bg-muted/60`
- Active: `active:scale-95`
- Used in: Back button, close button, settings icon in header

**Ghost button** (subtle — nav, tab bar):
```
hover:bg-accent hover:text-accent-foreground
```
- No background/border by default
- Used in: Nav items, tab bar active states

**Tag pill (toggleable):**
```
rounded-full px-3 py-1 text-xs font-medium
```
- Selected: `bg-gradient-to-br from-purple-400 to-pink-400 text-white`
- Unselected: `border border-border bg-card text-muted-foreground hover:bg-muted/60`

---

### Cards

**`app-surface` / PageSection** (standard page section):
```
rounded-2xl border border-border bg-card shadow-sm p-4
```
- Internal gap: `space-y-3` to `space-y-4`

**`Card` component** (shadcn card):
```
rounded-xl border bg-card text-card-foreground flex flex-col gap-6
```
- CardHeader: `gap-1.5 px-6 pt-6`
- CardContent: `px-6 [&:last-child]:pb-6`
- CardFooter: `px-6 pb-6`

**List item card** (media options, settings rows):
```
rounded-2xl border border-border bg-card p-4
```
- Internal: `flex items-center gap-4`

**Post grid thumbnail item:**
```
rounded-2xl bg-muted overflow-hidden
```
- Aspect: `aspect-square`
- Hover overlay: `bg-black/50 opacity-0 group-hover:opacity-100`

**Chat bubble:**
```
max-w-[85%] rounded-2xl px-3 py-2 text-sm
```
- User: `bg-foreground text-background`
- AI: `border border-border bg-card text-foreground`

---

### Sections

**`app-page-content`** (page wrapper):
```
max-w-2xl mx-auto px-4 pt-6 pb-6 space-y-4
```

**`app-surface` / PageSection** (individual section):
```
rounded-2xl border border-border bg-card shadow-sm p-4
```

**Spacing between cards/sections:** `space-y-4` (default), `space-y-6` (generous between major sections)

**Padding inside cards/sections:**
- Standard: `p-4`
- Spacious: `p-5` (section with more breathing room)
- Hero: `p-6` (profile hero)

---

### List Items

**Activity/notification row:**
```
flex items-center gap-3 rounded-2xl px-1 py-1.5
```
- Icon: `w-4 h-4 text-muted-foreground`
- Title: `text-sm font-medium`
- Subtitle: `text-xs`
- Right meta: `shrink-0 flex flex-row items-center gap-1`

**Message item:**
```
flex items-center gap-3 rounded-2xl px-2 py-2
```
- Unread: add `bg-accent/30`
- Avatar: `h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400`
- Name: `text-sm font-medium`
- Message: `text-xs text-muted-foreground truncate`
- Unread dot: `w-2 h-2 rounded-full bg-blue-500`

**Settings row:**
```
flex items-center gap-3 px-4 py-3.5 text-left border-b border-border
```
- Icon: `w-4 h-4 text-muted-foreground`
- Label: `text-sm text-foreground`
- Right meta: `text-xs text-muted-foreground`

**Search bar:**
```
h-12 w-full rounded-full border border-border bg-card pl-10 pr-4 text-sm
```
- Icon prefix: `absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5`
- Focus: `focus:outline-none focus:ring-2 focus:ring-ring`

---

### Interactive Patterns

- **Hover on list items**: `hover:bg-muted/60` (Notifications list items)
- **Unread message item**: `bg-accent/30`
- **Tap feedback**: `whileTap: { scale: 0.9 }` via motion/react
- **Scroll snap**: `snap-y snap-mandatory` for full-screen feed
- **Hide scrollbar**: `.hide-scrollbar` class (scrollbar-width: none)