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

## Constraints

- Static HTML/CSS/JS, no build step, no external runtime requests.
- Local, subsetted OFL fonts only: Funnel Display, Funnel Sans, Noto Sans SC.
- Do not expose internal model codes, company data, customer information, internal UI, raw measurement images, or line-specific parameters. Algorithm descriptions stay at a public-safe conceptual level.
- Demos must remain understandable without JS: the copy and figures carry the explanation; the controls enhance it.
- The spectrum exists only inside the generated light; never as a decorative UI color.

## Success

A first-time visitor reads this as a technical measurement engineer's bench: the name, the prism light, the three tools, the µm precision, and a clear way into each test bench. It should feel like daylight on an optical table, not a marketing page or a dark console.
