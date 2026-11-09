# Utility Toolz — Highlighter design language

Every tool is a machine with an input and an output. The design makes that the same on all of them, whether the output is a number, text, a table or a file. Target: WCAG 2.2 AA, keyboard-first, light and dark designed together. Rules use **must** (non-negotiable) or **should** (recommended).

## 1. The three rules

1. **Accent is a highlighter.** One lime fill, `--highlight`, always behind ink text (`text-on-highlight`), and once per screen. It marks the result, or the main action where there is no result yet. It **must not** be used as text colour.
2. **Border means touchable.** Controls and whole-card links get a `1.5px` `border-input` edge. Information **must** sit on tone alone: no border, no shadow. The hard `3px` offset shadow is for the primary action only, and it collapses when pressed.
3. **Plain voice on results.** Copy near a result is literal. Wit is allowed only in empty states and the 404.

## 2. Tokens (`src/app/globals.css`)

Components **must** use tokens. Raw hex is allowed only in `globals.css`, this document, generated output such as invoice HTML, sample values inside tools, and mock-ups of third-party UI.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--background` | `#f3f3ef` | `#131412` | page |
| `--card` | `#ffffff` | `#1e1f1c` | tiles |
| `--muted` | `#e6e6e0` | `#2a2b27` | insets, ad slots, code output |
| `--foreground` | `#111210` | `#f2f2ec` | text |
| `--muted-foreground` | `#555952` | `#adb0a7` | labels, secondary text |
| `--input` | `#111210` | `#f2f2ec` | edge of anything touchable |
| `--border` | `#dcdcd6` | `#383a34` | quiet dividers only |
| `--ring` | `#111210` | `#f2f2ec` | focus outline |
| `--highlight` / `--on-highlight` | `#d4f53c` / `#111210` | same | the one accent |

- State colours are for meaning only: `text-deep-green` good, `text-deep-orange` warn, `text-deep-coral` bad, with `bg-lf-green/10`, `bg-lf-orange/10` and `bg-lf-coral/10` washes.
- Domains are told apart by icon, never colour.
- Radius: controls `rounded-md` 10px, cards `rounded-xl` 16px, chips full. One-off radii are prohibited.
- Shadow: `shadow-lark*` is intentionally `none`. Only overlays (dialogs, menus, toasts) cast a soft shadow.

## 3. Type

- Geist for body, Outfit for headings, both self-hosted through `next/font`. No further webfonts.
- Headings are large and quiet: weight 500, tracking `-0.03em`, one colour.
- Numbers use `.tnum` tabular sans, tracking no tighter than `-0.03em`. Mono is for code only.
- Decimals are de-emphasised at half size. Long results step down in size, then wrap (`ResultHero`).
- Sentence case. Nothing that holds data is rotated.

## 4. Components

- **Tool shell (`ToolPage`)**: breadcrumb, title and one toolbar, tool, ad, how it works, worked example, FAQ with side ad, related tools. Tools **must** send Share, Export and similar through `ToolbarPortal` (`ToolShareBar` and `ExportToolbar` already do).
- **`CalcLayout`**: In and Out panels of equal width. Invalid input pauses Out.
- **`ResultHero`** and **`ResultValue`**: the highlighted result. A tool **should** render one at a time. Use `ResultValue compact live` inside hand-built stat cards.
- **Phones**: Out comes first. Use `CalcLayout inputFirst` where there is nothing to show until something is pasted or dropped.
- **`Button`**: `default` has the hard shadow and is the primary action. `outline` is every other control. `highlight` is lime, only where no result is on screen.
- **`ToolCard`**: one link per card, star above it as a sibling button.
- **Ads (`AdSlot`)**: render nothing until `NEXT_PUBLIC_ADSENSE_CLIENT` is set, and **must never** sit between a tool's input and output.
- **Motion**: colour and edge transitions only, at `--duration-instant`. `prefers-reduced-motion` collapses all durations.

## 5. Claims and counts

Tool and domain counts **must** come from the registry, never typed by hand. A confirmation is shown only after the action really succeeded. Do not make claims the product can't back.

## 6. Accessibility acceptance

1. Every interactive element shows a 2px `--ring` outline at 2px offset on keyboard focus.
2. Body text at least 4.5:1, large text and control edges at least 3:1, in both themes.
3. Icon-only buttons have `aria-label`. Every form control has a programmatic label.
4. Dialogs trap focus, close on `Esc`, return focus to the trigger.
5. Touch targets at least 44px on mobile.

## 7. QA checklist

- [ ] `bun test`, `tsc --noEmit` and `next build` pass.
- [ ] Home, a domain hub, a number tool, a text tool, a file tool and a profession hub in light **and** dark.
- [ ] One highlighter per screen.
- [ ] `$12,345,678.00` fits at desktop and 390px with no horizontal overflow.
- [ ] Typing letters into a calculator field shows an error and pauses Out.
- [ ] Search opens via `⌘K` and `/`, filters, and navigates.
