# Design System — Optical Instrument Console

## World

A dark optical-instrument console: a live measurement surface, not a paper document. Graphite ground, fine white line work, cyan signal, amber measurement, red alert. The identity is a personnel module inside the console; the projects are modules in a manifest; the case pages are test benches.

The previous warm manila “work order” world was rejected by the user as not technical enough. Do not reintroduce paper, manila, seals, stamps, or print metaphors.

## Principles

- Technical detail is content, not decoration: axes, units, channels, readouts, tolerances, and the three measurement schematics.
- Data and diagrams lead; chrome recedes. No cards, glows, gradients, glass, or ornamental grids.
- One authored interaction moment at most; the case demos are the interactive core.
- Functional text is legible: body 16px, labels 12px, chart annotations may be smaller inside SVG figures.
- Illustrative values are labeled `SIM` / `示意数据`; no invented commercial claims.

## Color

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#0a0d0f` | page ground |
| `--panel` | `#0f1417` | primary panels |
| `--panel-2` | `#0c1113` | schematic / demo sheets |
| `--line` | `rgba(230,240,240,.14)` | 1px rules |
| `--line-soft` | `rgba(230,240,240,.08)` | internal dividers |
| `--text` | `#e6eef0` | primary text / line work |
| `--muted` | `#93a2a6` | secondary text |
| `--dim` | `#6f8085` | de-emphasized metadata / ticks |
| `--cyan` | `#6fd5c5` | signal, links, measured values |
| `--amber` | `#dfa55c` | secondary measurement value |
| `--red` | `#ff6b4f` | alert / measurement marker |

No colored glows, gradient text, glass, or decorative two-axis backgrounds. The page uses neutral panel shadows and 1px rules only.

## Type

| Role | Face | Size / weight |
| --- | --- | --- |
| Name | Noto Sans SC | 68–102px / 900 |
| Page title | Noto Sans SC | 44–68px / 900 |
| Section title | Noto Sans SC | 30–38px / 900 |
| Statement | Noto Sans SC | 21–28px / 500 |
| Body | Noto Sans SC | 16px / 400 |
| System labels | Archivo | 12px / 600–700, tracked caps |
| Data / units / readings | IBM Plex Mono | 11–24px / 400 |
| SVG annotations | Archivo / IBM Plex Mono | 11–14px inside figures |

The mono face is used for data, units, job IDs and readings only; labels use Archivo. Numerals are tabular where the face supports it.

## Components

- **System bar**: sticky, 54px, graphite, 1px rule; brand mark, system ID, ACTIVE status, email. On mobile: brand + status.
- **Profile console**: panel with a 64×2px cyan top accent; name, Latin name, role, statement; a four-row spec table (DOMAIN / PRECISION / STATUS / BASE); email, COPY, VCARD.
- **Optical schematic**: panel with header/footer rules; a 960×600 instrument drawing containing line-pair target, dual-path lens diagram, distortion grid, live-style readouts, a scale bar, and `SIMULATED DATA`.
- **Work manifest**: a five-column table (MODULE / INPUT / OUTPUT / PRECISION / STATE); full-row links; schematic thumbnails; state is cyan `VIEW` or amber `INITIAL`.
- **Case head**: panel with cyan top accent; project title, lead, four-cell facts row.
- **Test bench**: panel with station label and simulated-data note; a dark stage, readout panel, profile chart, and monospace controls.
- **Readout**: cyan measured value, mono subvalues, cyan progress bar, three-cell data list.
- **Case body**: numbered measurement table and a definition-list specification table.
- **Footer**: closing line, email, back-to-top, system metadata, legal fineprint.

## Layout

- System bar 54px; wrap 1280px.
- Hero console: 4.8fr / 7.2fr; 18px gap; profile and schematic panels stretch together.
- Manifest: full-width table; 1fr / 150 / 140 / 100 / 100 columns.
- Case pages: 1280px wrap; case head; test bench; two-column case body.
- Responsive: console stacks below 1080px; manifest rows become stacked records below 780px; facts and readout lists become single-column rows; schematic annotations remain inside the figure.
- All interactive rows are full-row links; slider handles are 10×18px; focus rings are cyan.

## Motion

- No page entrance animations. The console is static; the measurements are the live element.
- Sliders update values instantly; bar widths transition 150ms.
- Hover/focus color and arrow transitions 150ms.
- `prefers-reduced-motion` removes transitions and smooth scrolling.

## Accessibility

- Body text ≥4.5:1; large text ≥3:1; labels ≥12px. The muted and dim tones are tested against the dark panels.
- Focus ring 2px cyan, offset 3px; full-row links use an inset ring.
- Semantic landmarks; SVG figures have titles; decorative marks are aria-hidden.
- Color is never the only state cue: labels, values, and state words are explicit.
- Page works at 320px and 200% zoom; tables reflow rather than scroll horizontally.

## Anti-patterns

Do not reintroduce: manila/cream paper, stamps/seals/barcodes, dark colored glows, gradient text, glass, bento cards, eyebrow chips, numbered section kickers, tiny functional labels, decorative grid backgrounds, or unlabeled simulated data.

## Detector note

The Impeccable static detector is calibrated around a light page background for its contrast pass. On this dark console it reports low-contrast findings for light text as if it sat on white, plus a manifest padding advisory. The rendered contrast was checked directly; the remaining static findings are false positives, not ship blockers.
