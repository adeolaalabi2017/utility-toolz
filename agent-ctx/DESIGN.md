# ToolDeck × Larkfield — Adapted Design Language

Adapted from the Larkfield screenshot and the supplied `design.md` spec for ToolDeck's marketing/tool surface. Every rule below uses **must** (non-negotiable) or **should** (recommended). Target: WCAG 2.2 AA, keyboard-first.

## 1. Context and goals

Restate the design intent in one sentence: *a dependable, cream-and-deep-green workspace where serif display headings carry enterprise confidence and a fixed six-accent system marks data, domains and states.* The adaptation reuses Larkfield's token system 1:1 where the tokens exist and adds only display typography and domain accents, which the source spec does not define.

## 2. Design tokens and foundations

### 2.1 Color (semantic tokens — raw hex must not appear in new component code)

| Semantic token | Value | Source |
| --- | --- | --- |
| `--background` (page) | `#fff6e0` (surface.strong) | design.md |
| `--card` (cards, panels) | `#faf5ea` (surface.muted) | design.md |
| `--foreground` / ink | `#1f4a3f` | screenshot headings (design.md border.muted doubles as ink) |
| `--muted-foreground` | `#365a4f` (text.tertiary) | design.md |
| `--primary` (filled controls) | `#1f4a3f`, text `#fef5de` | screenshot buttons |
| `--border` / `--input` | `#e6ddc4` / `#d9cfb2` (warm hairlines; strong edges use `#24443b` = border.default) | design.md + screenshot |
| `--ring` (focus) | `#6b5faf` (purple, text.inverse family) | design.md |
| `--destructive` | `#cf4f43` | screenshot |
| Accent set | green `#308f68`, purple `#6b5faf`, coral `#cf4f43`, pink `#d1548a`, orange `#e07a3c`, rust `#c9603c`; deep text variants per `src/lib/registry/accents.ts` | screenshot stat/example cards |
| `--ink` (legacy alias) | `#1f4a3f` — dark result panels, promo band | kept for existing components |

Rules:
- Components **must** consume these tokens (Tailwind utilities like `bg-card`, `text-muted-foreground`, or the `--lf-*` variables); raw hex is allowed only inside `accents.ts`, `globals.css` and this document.
- Text on cream **must** be `#1f4a3f`, `#365a4f`, or a deep accent (`#a4502c`, `#1f5f45`, `#3f346f`, `#a83a30`, `#a83a67`, `#9c4726`); rust `#c9603c` and orange `#e07a3c` are decorative/large-text only.
- Saturated accent fills **must** only carry icons (≥3:1 verified) or `#fef5de` text where the pair is ≥4.5:1; orange fills carry ink icons, never cream text.

### 2.2 Typography

- Family: system sans stack (`-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, …`) for everything; serif display stack (`ui-serif, Georgia, Cambria, …`) for headings via `font-display`. No webfonts **must** be introduced (fast delivery).
- Scale (design.md mapped onto Tailwind): `xs=11.5px`, `sm=12.5px`, `base=16px/lh24`, `lg=16.5px`, `xl=18px`; display serif sizes `display-sm=22px`, `display-md=28px`, `display-lg=34px`, `display-xl=clamp(36–50px)`.
- Headings **must** be serif, regular weight (400–600 for the wordmark), tracking tight; eyebrows **must** be 11.5px uppercase, `tracking-[0.14em]`, deep orange `#a4502c`.

### 2.3 Radius, shadow, motion

- Radius tokens: `sm=7px`, `md=12px` (buttons/inputs), `lg=14px`, `xl/2xl=22px` (cards), pill `999px` (badges, chips). One-off radii are prohibited.
- Shadow: `--shadow-lark: 0 24px 48px -32px rgb(31 74 63/.42)` for elevated cards/dialogs; `--shadow-lark-sm` for resting panels. Default Tailwind `shadow-md`/`shadow-lg` on new work is prohibited.
- Motion: color/border/shadow transitions on interactive elements run at `--duration-instant` (300ms); overlays use 400/450ms. `prefers-reduced-motion` collapses all durations.

## 3. Component-level rules

### 3.1 Buttons (shadcn `Button`, restyled by tokens)
- Anatomy: label + optional icon; `rounded-md` (12px); height ≥ 36px, touch targets ≥ 44px on mobile.
- States: default `bg-primary`/`text-[#fef5de]`; hover darkens (`bg-ink`→`#173b32` family); focus-visible shows the 2px purple outline; active compresses to `shadow-lark-sm`; disabled at 50% opacity; loading swaps label for a spinner and sets `aria-busy`.
- Variants: filled (dark green), outline (1px `#24443b`-strength border, transparent fill), ghost (text-only, hover `--accent`), cream-on-dark (promo band).
- Keyboard: `Enter`/`Space` activate; focus order follows DOM.

### 3.2 Cards (domain cards, tool cards, stat cards)
- Resting: `bg-card`, 1px `--border`, `rounded-xl` (22px). Hover: `-translate-y-0.5`, `border-primary/40`, `shadow-lark`. Focus-visible: purple outline.
- Domain/tool icon chips use the domain accent from `accents.ts` (`chip` solid for domain cards, `soft` wash for tool cards) — accents **must not** be reassigned ad hoc.
- Long content: titles clamp to 2 lines (`line-clamp-2`); cards in a row stretch to equal height (`h-full` on grids).
- Empty state: dashed border, muted icon, one sentence + one action.

### 3.3 Inputs (`NumberField`, `TextAreaField`, selects)
- `rounded-md` (12px), `--input` border, `bg-card`; focus ring purple; numerals use `.tnum`.
- Error text uses `#a83a30` (coral-deep, AA on cream) and must be paired with `aria-describedby`.

### 3.4 Result panels (`ResultHero`, `OutputPanel`)
- Dark green `bg-ink` surface, cream `#fef5de` text, tabular numerals; copy/download actions are outline buttons with visible focus.
- Verdict tones (good/warn/bad) use the accent wash + deep text pairs defined in `tools/ui.tsx`; raw Tailwind palette colors (e.g. `amber-50`) are prohibited.

### 3.5 Navigation (header, footer, breadcrumbs)
- Header: sticky, translucent page-cream with blur, `border-b`; brand mark = ink tile + `#7fbb92` glyph; links hover to `--accent`.
- Footer: cream `#faf5ea`, `border-t`, ink text at 45–80% opacity steps; hover accent `#a4502c`. Must stick to viewport bottom on short pages (`min-h-screen flex flex-col` + `mt-auto`).
- Breadcrumbs: `Home / Domain / Tool`, current page non-interactive.

### 3.6 Known page density (from the reference audit)
The marketing surface runs ~81 links, 28 cards, 9 lists, 6 buttons, 2 navigation landmarks per page. New sections **should** respect this density: prefer converting existing patterns over adding new interaction types, and keep every card a single link target.

## 4. Accessibility acceptance criteria (testable)

1. Every interactive element shows a ≥2px `--ring` outline at 2px offset when keyboard-focused — pass: tab through home, a domain hub and a tool page and observe no hidden focus.
2. Body text contrast ≥ 4.5:1 and large text ≥ 3:1 — pass: `#1f4a3f/#365a4f` on `#fff6e0`/`#faf5ea` measured 9.2/7.1:1; deep accents ≥ 5.1:1 (scripted check).
3. Icon-only buttons expose `aria-label`; the search trigger, mobile menu and copy buttons all name their action.
4. Dialogs (search, mobile sheet) trap focus, close on `Esc`, and return focus to the trigger.
5. Accordions (FAQ) are operable with `Enter`/`Space` and expose `aria-expanded`.
6. Touch targets ≥ 44px for primary mobile actions (hero search, nav items).
7. `prefers-reduced-motion` disables transitions/animations — verified in code and browser emulation.

## 5. Content and tone standards

- Concise, confident, implementation-focused. Labels name the object ("Search tools…", "Join the waitlist"); vague actions like "Submit"/"Learn more ↓" are prohibited.
- Numbers display with tabular figures and explicit units ("40.0%", "$12,400").
- Example copy: ✓ "Search 78 tools — try 'margin', 'pomodoro' or 'gpa'…" · ✗ "Click here".

## 6. Anti-patterns (prohibited)

- Blue/indigo palette or dark-navy surfaces from the previous ToolDeck theme (`#0b1c2c`, `#529286`, `#8fb8ae`) anywhere in the UI.
- Low-contrast text (rust/orange raw values on cream), hidden focus indicators, or `outline-none` without a replacement.
- One-off spacing (non `space.1–8` steps), non-token radii, or per-component shadow invents.
- Non-descriptive labels, icon-only actions without `aria-label`, and component guidance without state rules.

## 7. QA checklist

- [ ] `bun run lint` clean.
- [ ] Home, domain hub, tool page and profession hub render with cream surfaces, serif headings and no leftover navy/teal pixels.
- [ ] Focus ring visible on: nav links, search trigger, hero search, first tool card, FAQ trigger, footer links.
- [ ] Search dialog opens via `⌘K` and `/`, filters, and navigates.
- [ ] A calculator returns correct math (spot-check margin, discount, break-even).
- [ ] Footer sticks to viewport bottom at short and tall page heights.
- [ ] 390px viewport: no horizontal overflow, mobile sheet navigates, hero stacks.
- [ ] No console errors in `dev.log` during the pass.
