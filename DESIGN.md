# Design System — Refract

## World

A sunlit optical bench. White plaster walls, a glazed window, one prism throwing a spectrum across a clear surface. Deep pool-blue ink on warm paper; measurement cards sit on the light like glass instrument panels. The pages are an engineer's bench, not a console or a marketing site.

The theme is **Refract (glass / pool)** from [Nutlope/hallmark](https://github.com/Nutlope/hallmark). The prism is the only source of color; the spectrum stays inside the light and never becomes a border, a button, or a gradient headline.

## Principles

- One lit ground per page. The hero stage holds the generated light; the rest of the page is quiet paper.
- Light is drawn, not blurred: a 2D canvas scene with a sun, glazing bars, caustic bands, a glass prism and a six-band spectrum fan.
- Clear surfaces, not frosted ones. No backdrop blur, no glassmorphism, no colored glows.
- Technical detail is content: line pairs, `f₀ = 1000 / p`, Imax/Imin, grid points, axes, channels, µm.
- Illustrative values are labelled `演示` / `示意`; no invented commercial claims.
- Sentence case; no tracked capitals, no mono-as-costume, no eyebrow chips, no hero metrics.
- One operator persona, not a mascot: a cameo mark, first-person field notes, a current status, and an honest offline Q&A. No 3D avatar, no fake live AI.

## Material and color

Refract tokens live in OKLCH.

| Token | Value | Role |
| --- | --- | --- |
| `--color-paper` | `oklch(98.2% 0.006 95)` | page ground |
| `--color-paper-2` | `oklch(96.4% 0.006 95)` | about band / stage base |
| `--color-paper-3` | `oklch(93.6% 0.008 95)` | tracks and bars |
| `--color-ink` | `oklch(23% 0.035 245)` | primary text and line work |
| `--color-ink-2` | `oklch(36% 0.035 245)` | body copy |
| `--color-muted` | `oklch(50% 0.025 240)` | secondary text |
| `--color-rule` | `oklch(89.5% 0.008 230)` | 1px rules |
| `--color-accent` | `oklch(50% 0.12 234)` | links, measured values, primary button |
| `--color-accent-hi` | `oklch(44% 0.12 236)` | accent hover |
| `--color-accent-soft` | `oklch(94% 0.025 220)` | row hover wash |
| `--color-light` | `oklch(99.7% 0.004 95)` | clear card surface |
| `--shadow-card` | tinted blue-grey, two layers | cards and nav |
| `--shadow-cast` | wide tinted cast | lit stage |

The spectrum (six bands in `light.js`) is reserved for the canvas. Never apply it to text, buttons, rules, or decorative borders.

## Type

| Role | Face | Size / weight |
| --- | --- | --- |
| Name | Funnel Display + Noto Sans SC | 76–116px / 400 |
| Page title | Funnel Display + Noto Sans SC | 42–62px / 400 |
| Section title | Funnel Display + Noto Sans SC | 30–52px / 300–400 |
| Statement | Funnel Display + Noto Sans SC | 22–34px / 300 |
| Body | Funnel Sans + Noto Sans SC | 15–17px / 400 |
| UI labels | Funnel Sans + Noto Sans SC | 12–14px / 500 |
| Readings | Funnel Display | 15–46px / 400, tabular numerals |

No mono face. No letter-spaced capitals. Units and numerals use tabular figures.

## Components

- **Nav pill**: fixed, floating, clear white; prism mark, name, three links, primary email button. Links collapse on mobile.
- **Hero**: two columns; name / Latin name / role / statement / actions left; lit stage right.
- **Lit stage**: rounded paper panel, tinted cast shadow, canvas light, clear card floating at its lower left. The card overlaps the light rather than sitting beside it.
- **Measurement card**: clear surface, `演示` pill, a line-pair, cross-target or crosshair-trajectory stage, large accent reading, 2px bar, three-cell data list, controls.
- **Project table**: five-column rows (project / input / output / precision / state); full-row links; hover accent-soft wash; the third row is marked `初版`.
- **About band**: paper-2 ground, statement left, fact list right.
- **Contact**: large display line, email / vCard / copy actions, confidentiality note.
- **Operator badge**: clear pill on the lit stage, 56px glass-cameo avatar (profile + prism), role, name, live status dot, links to the notes.
- **Operator notes**: first-person project trade-offs; label + display title + short body, separated by rules.
- **Ask the operator**: five native `<details>` rows; question + accent plus/minus; answers in first person. Labeled as offline preset answers, not a live AI.
- **Case pages**: back link, title, lead, four-cell meta table; test card in the lit stage; numbered method and specs below; next-tool + email; footer. The cross-target and trajectory schematics use ink line work with accent centerlines and one accent measurement marker.
- **Footer**: copyright, role, email, back to top.

## Layout

- Wrap 1240px; nav 960px; hero split `.92fr / 1.08fr`.
- Case split `.9fr / 1.1fr`; stage min-height 720px; card width 540px.
- Breakpoints: 1080px stacks the case hero and body; 760px collapses to one column and stacks readout lists; 420px tightens the hero.
- No horizontal overflow at 320px; full-row links reflow rather than scroll.

## Motion

- Canvas light runs at ~30fps, pauses off-screen, and draws one still frame under `prefers-reduced-motion`.
- Sliders update readings instantly; bar widths transition 150ms.
- Hover/focus transitions 150–200ms.
- No entrance animations, no parallax, no scroll-jacking.

## Accessibility

- Ink on paper and muted on paper meet body-text contrast; accent is used for values and links at ≥14px.
- Focus ring 2px accent, offset 3px.
- Semantic landmarks, skip link, labelled SVGs; the light canvas is aria-hidden.
- Color is never the only cue: every state has a word (`演示`, `初版`, `清晰` / `离焦`).
- Reduced motion removes transitions and freezes the light.
- Q&A uses native `<details>`/`<summary>`, so it works with keyboard and without JavaScript.

## Anti-patterns

Do not reintroduce: dark console / graphite grounds, cyan-and-amber signal palettes, manila work orders, stamps or barcodes, frosted glass, gradient text, colored glows, bento grids, eyebrow chips, tracked capitals, mono labels, or spectrum decorations outside the generated light.
