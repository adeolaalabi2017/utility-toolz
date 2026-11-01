# ToolDeck × Larkfield — Adapted Design Language

Adapted from the Larkfield screenshot and the supplied `design.md` spec for ToolDeck's marketing/tool surface. Every rule below uses **must** (non-negotiable) or **should** (recommended). Target: WCAG 2.2 AA, keyboard-first.

## 1. Context and goals

Restate the design intent in one sentence: *a dependable, cream-and-deep-green workspace where display headings in Outfit carry confidence and a fixed six-accent system marks data, domains and states — with a "Night Desk" dark theme that keeps every pairing AA-compliant.* The adaptation reuses Larkfield's token system 1:1 where the tokens exist and adds only display typography and domain accents, which the source spec does not define.

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
| `--ink` | `#1f4a3f` in **both** themes — result panels, brand tiles, promo band (cream text 9.2:1) | kept for existing components |
| Deep accent text (`text-deep-green`, `-purple`, `-coral`, `-orange`, `-pink`, `-rust`) | light: `#1f5f45 #3f346f #a83a30 #a4502c #a83a67 #9c4726`; dark: `#6fd3a2 #b9aff2 #f7a097 #f5a66e #f290bd #f2a481` | flip per theme; ≥6:1 on cards and 15% accent washes in dark |
| Dark theme (“Night Desk”) | page `#0d1520`, card `#131f2d`, primary `#24805b` (white text 4.9:1) | `.dark` in globals.css |

Rules:
- Components **must** consume these tokens (Tailwind utilities like `bg-card`, `text-muted-foreground`, `text-deep-green`, `bg-lf-coral/10`); raw hex is allowed only inside `accents.ts`, `globals.css`, this document, cream text on `bg-ink` surfaces, and mock-ups of third-party UI (e.g. the SERP preview on white).
- Coloured text **must** use a `text-deep-*` token so it stays readable in dark mode; `lf-*` accents are for fills, borders, icons and large decorative text only.
- Raw Tailwind palette colours (`amber-500`, `red-600`, `green-600`, …) are prohibited.
- Saturated accent fills **must** only carry icons (≥3:1 verified) or `#fef5de` text where the pair is ≥4.5:1; orange fills carry ink icons, never cream text.

### 2.2 Typography

- Family: Geist (body, `font-sans`) and Outfit (headings, `font-display`), both self-hosted through `next/font` with `display: swap`, falling back to the system sans stack. No further webfonts **should** be added.
- Scale (design.md mapped onto Tailwind): `xs=11.5px`, `sm=12.5px`, `base=16px/lh24`, `lg=16.5px`, `xl=18px`; display serif sizes `display-sm=22px`, `display-md=28px`, `display-lg=34px`, `display-xl=clamp(36–50px)`.
- Headings **must** use `font-display` (Outfit), weight 400–600, tracking tight; eyebrows **must** be 11.5px uppercase, `tracking-[0.14em]`, deep orange `#a4502c`.

### 2.3 Radius, shadow, motion

- Radius tokens: `sm=7px`, `md=12px` (buttons/inputs), `lg=14px`, `xl/2xl=22px` (cards), pill `999px` (badges, chips). One-off radii are prohibited.
- Shadow: `--shadow-lark: 0 24px 48px -32px rgb(31 74 63/.42)` for elevated cards/dialogs; `--shadow-lark-sm` for resting panels. Default Tailwind `shadow-md`/`shadow-lg` on new work is prohibited.
- Motion: color/border/shadow transitions on interactive elements run at `--duration-instant` (300ms); overlays use 400/450ms. `prefers-reduced-motion` collapses all durations.

## 3. Component-level rules

### 3.1 Buttons (shadcn `Button`, restyled by tokens)
- Anatomy: label + optional icon; `rounded-md` (12px). Sizes are 44px tall below `sm` and 36px (default) / 32px (`sm`) from `sm` up — set in `ui/button.tsx`, so don't override heights with a fixed `h-8` without an `sm:` prefix.
- States: default `bg-primary`/`text-[#fef5de]`; hover darkens (`bg-ink`→`#173b32` family); focus-visible shows the 2px purple outline; active compresses to `shadow-lark-sm`; disabled at 50% opacity; loading swaps label for a spinner and sets `aria-busy`.
- Variants: filled (dark green), outline (1px `#24443b`-strength border, transparent fill), ghost (text-only, hover `--accent`), cream-on-dark (promo band).
- Keyboard: `Enter`/`Space` activate; focus order follows DOM.

### 3.2 Cards (domain cards, tool cards, stat cards)
- Resting: `bg-card`, 1px `--border`, `rounded-xl` (22px). Hover: `-translate-y-0.5`, `border-primary/40`, `shadow-lark`. Focus-visible: purple outline.
- Domain/tool icon chips use the domain accent from `accents.ts` (`chip` solid for domain cards, `soft` wash for tool cards) — accents **must not** be reassigned ad hoc.
- Long content: titles clamp to 2 lines (`line-clamp-2`); cards in a row stretch to equal height (`h-full` on grids).
- Empty state: dashed border, muted icon, one sentence + one action.

### 3.3 Inputs (`NumberField`, `TextAreaField`, `SelectField`)
- `rounded-md` (12px), `--input` border; 44px tall on mobile; focus ring purple; numerals use `.tnum`.
- Every control **must** have a programmatic label: the shared fields wire `<Label htmlFor>` to a `useId()` id; hand-built fields use `htmlFor`/`id`, and button groups use `role="group"` + `aria-labelledby`.
- `NumberField` strips non-numeric characters, validates the format (and `min` when given), sets `aria-invalid`, and shows `text-deep-coral` error text linked through `aria-describedby`. Inside `CalcLayout`, any invalid field pauses the results panel instead of showing misleading numbers.
- Money prefixes use the visitor's chosen currency (`CurrencyProvider`); write `prefix="$"` or `(<Cur />)` and the symbol is swapped automatically.

### 3.4 Result panels (`ResultHero`, `OutputPanel`)
- Dark green `bg-ink` surface (same in both themes), cream `#fef5de` text, tabular numerals; `ResultHero` is a polite live region so screen readers hear the new headline result.
- Copy/download actions are outline buttons with visible focus.
- Verdict tones (good/warn/bad) use the accent wash + `text-deep-*` pairs defined in `tools/ui.tsx`.
- Toggle buttons expose `aria-pressed`; steppers (−/+) carry an `aria-label`.

### 3.5 Navigation (header, footer, breadcrumbs)
- Header: sticky, translucent page-cream with blur, `border-b`; brand mark = ink tile + `#7fbb92` glyph; links hover to `--accent`.
- Footer: `bg-card`, `border-t`, ink text at 75–90% opacity; hover `text-deep-orange`. Legal links go to `/privacy` and `/terms`. Must stick to viewport bottom on short pages (`min-h-screen flex flex-col` + `mt-auto`).
- Breadcrumbs: `Home / Domain / Tool`, current page non-interactive.

### 3.6 Motion
- GSAP animations **must** run inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`; the CSS reduced-motion rule does not stop JS tweens.
- Moving content that contains links (the domain ticker) **must** pause on hover *and* keyboard focus, and duplicated loop items are `aria-hidden` with `tabIndex={-1}`.

### 3.7 Ads, counts and claims
- `AdSlot` renders nothing until `NEXT_PUBLIC_ADSENSE_CLIENT` is set (a faint outline in development only). Visitors never see placeholder ad copy.
- Tool and domain counts **must** come from the registry (`TOOLS.length`, `toolsByDomain(slug).length`), never typed by hand.
- A confirmation (toast, "you're on the list") is shown only after the action really succeeded.

### 3.8 Known page density (from the reference audit)
The marketing surface runs ~81 links, 28 cards, 9 lists, 6 buttons, 2 navigation landmarks per page. New sections **should** respect this density: prefer converting existing patterns over adding new interaction types, and keep every card a single link target.

## 4. Accessibility acceptance criteria (testable)

1. Every interactive element shows a ≥2px `--ring` outline at 2px offset when keyboard-focused — pass: tab through home, a domain hub and a tool page and observe no hidden focus.
2. Body text contrast ≥ 4.5:1 and large text ≥ 3:1 — pass: `#1f4a3f/#365a4f` on `#fff6e0`/`#faf5ea` measured 9.2/7.1:1; deep accents ≥ 5.1:1 (scripted check).
3. Icon-only buttons expose `aria-label`; the search trigger, mobile menu and copy buttons all name their action.
4. Dialogs (search, mobile sheet) trap focus, close on `Esc`, and return focus to the trigger.
5. Accordions (FAQ) are operable with `Enter`/`Space` and expose `aria-expanded`.
6. Touch targets ≥ 44px on mobile for buttons, inputs, nav items and the hero search.
8. Every form control has an accessible name that matches its visible label; axe reports no `label` violations on a tool page.
9. Dark mode: the headline result, verdicts and coloured text stay ≥ 4.5:1 (check ROAS calculator and Tip Splitter).
7. `prefers-reduced-motion` disables transitions/animations — verified in code and browser emulation.

## 5. Content and tone standards

- Concise, confident, implementation-focused. Labels name the object ("Search tools…", "Browse domains"); vague actions like "Submit"/"Learn more ↓" are prohibited.
- Numbers display with tabular figures and explicit units ("40.0%", "$12,400").
- Example copy: ✓ "Search {TOOLS.length} tools…" · ✗ "Click here". Don't make claims the product can't back (e.g. "zero tracking" on an ad-supported page).

## 6. Anti-patterns (prohibited)

- The previous ToolDeck light theme (`#0b1c2c` hero, `#529286`, `#8fb8ae`). The screenshots in `scripts/` and `download/` show that old theme and are historical only. The Night Desk navy (`#0d1520`) is the deliberate dark theme.
- Low-contrast text (rust/orange raw values on cream), hidden focus indicators, or `outline-none` without a replacement.
- One-off spacing (non `space.1–8` steps), non-token radii, or per-component shadow invents.
- Non-descriptive labels, icon-only actions without `aria-label`, and component guidance without state rules.

## 7. QA checklist

- [ ] `bun run lint` clean.
- [ ] Home, domain hub, tool page and profession hub render correctly in light **and** dark.
- [ ] Typing letters into a calculator field shows an error and pauses results.
- [ ] Focus ring visible on: nav links, search trigger, hero search, first tool card, FAQ trigger, footer links.
- [ ] Search dialog opens via `⌘K` and `/`, filters, and navigates.
- [ ] A calculator returns correct math (spot-check margin, discount, break-even).
- [ ] Footer sticks to viewport bottom at short and tall page heights.
- [ ] 390px viewport: no horizontal overflow, mobile sheet navigates, hero stacks.
- [ ] No console errors in `dev.log` during the pass.
