# PRODUCT — 刘东琦 / AI 软件开发工程师

## What this is

A Refract personal card for 刘东琦 (Liu Dongqi), an AI software development engineer at an optical lens company: a sunlit homepage with a live MTF card, plus three project test-bench pages.

## Audience

- Optical / metrology engineers and engineering leads
- Hiring managers and technical interviewers
- Potential collaborators who need to understand the measurement work quickly

## Surface and mode

- Surface: personal portfolio / personal card
- Mode: Experience — the measurement work and the person lead; the interface recedes

## Truth

- Name: 刘东琦 / Liu Dongqi
- Role: AI 软件开发工程师 · 光学测量软件
- Email: 2823641678@qq.com
- Projects:
  - MTF calculation software (MATLAB): batch bright-field / dark-field / detection images → automatic target and four-direction ROI → MTF with quality status, NRMSE flags and an independent Michelson check → Excel / MAT reports.
  - Distortion calculation software (Python, OpenCV, PySide6): cross-target images → ESF/gradient hybrid edge localization → Huber line fitting → O1/O2 intersections → batch template alignment and first-order residual → CSV, annotated images, residual map and QC report.
  - Decentration instrument software (first version, Python, OpenCV, PySide6): reflective crosshair images → subpixel center → one-revolution trajectory → robust circle fit → linear and angular eccentricity with calibration, tolerance and records.
- Precision is stated at µm level. Angular eccentricity depends on the calibrated µm/px factor and the surface curvature radius; no specific tolerance has been supplied.
- Case demo values are synthetic and labelled `演示` / `示意`; the site note says they are simulated.
- Internal model codes, customer data and raw production measurements are intentionally omitted.

## Personal profile and desktop pet

The site's virtual image is a light personal profile plus a small interactive character, not a 3D avatar:

- A real 4:5 portrait in the about section, with a first-person bio and the current facts (`现在 / 方向 / 精度 / 地点 / 更新`).
- A circular portrait companion using the real photo, with a presence dot and name. On desktop it sits bottom-right, can be dragged, floats and tilts toward the pointer. On mobile it docks after the hero stage so it never covers copy.
- A voice Q&A panel with the real portrait, page-aware quick questions, a text input, a browser-synthesized Chinese voice, and a `换声` control when multiple voices exist. The default rate/pitch is deliberately softer. Keyword matching runs locally; questions are not uploaded. It is labelled as an offline肖像分身, not a live AI.
- First-person work notes describing real trade-offs, and five offline preset Q&A entries in the user's voice.
- The pet is a playful representation, not a claim of sentience or a live AI. No invented biography.

## Constraints

- Static HTML/CSS/JS, no build step, no external runtime requests.
- Local, subsetted OFL fonts only: Funnel Display, Funnel Sans, Noto Sans SC.
- Do not expose internal model codes, company data, customer information, internal UI, raw measurement images, or line-specific parameters. Algorithm descriptions stay at a public-safe conceptual level.
- Demos must remain understandable without JS: the copy and figures carry the explanation; the controls enhance it.
- The Q&A is honest about being offline/preset. Do not label it as a live AI or imply it can answer arbitrary questions.
- Voice is browser `speechSynthesis` only; never record the user, upload questions, or autoplay speech before a click.
- The mobile pet must stay in the document flow; it must never cover the bio, facts, or CTAs.
- The spectrum exists only inside the generated light; never as a decorative UI color.

## Success

A first-time visitor reads this as a technical measurement engineer's bench and a specific person: the portrait profile, the prism light, the three tools, the first-person notes, the desktop pet, the µm precision, and a clear way into each test bench. It should feel like daylight on an optical table, not a marketing page or a dark console.
