# Fonts

All fonts are locally hosted, subsetted to the characters used across `index.html`, `work/*.html` and the UI strings in `script.js` / `work/work.js`, and licensed under the SIL Open Font License 1.1.

| File | Family | Source | License |
| --- | --- | --- | --- |
| `funnel-display.woff2` | Funnel Display (300–500) | [google/fonts](https://github.com/google/fonts/tree/main/ofl/funneldisplay) | `licenses/OFL-FunnelDisplay.txt` |
| `funnel-sans.woff2` | Funnel Sans (400–500) | [google/fonts](https://github.com/google/fonts/tree/main/ofl/funnelsans) | `licenses/OFL-FunnelSans.txt` |
| `noto-sans-sc.woff2` | Noto Sans SC (variable) | [google/fonts](https://github.com/google/fonts/tree/main/ofl/notosanssc) | `licenses/OFL-NotoSansSC.txt` |

Funnel Display carries the headings and numerals; Funnel Sans carries the body copy. Noto Sans SC is the Chinese fallback for both. The Funnel files are Latin subsets from the Google Fonts `text=` API; the Noto file is subsetted to the Chinese characters used by the four pages and their demo scripts. If you change the copy substantially and see fallback glyphs, regenerate the subsets with the same character set.
