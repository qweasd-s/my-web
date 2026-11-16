const SVG_NS = 'http://www.w3.org/2000/svg';

/* Refract palette — the same paper, ink and one blue the page is built on. */
const INK = '#1d3145';
const MUTED = '#6a7d86';
const ACCENT = '#1e6b92';
const PAPER = '#fbf8ef';
const RULE = 'rgba(29,49,69,.2)';
const LABEL_FONT = "'Funnel Sans', 'Noto Sans SC', ui-sans-serif, sans-serif";

const svgNode = (name, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
};

const setAll = (selector, value) => {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
};

/* ------------------------------------------------------------------
   01 / MTF — single-frequency line-pair measurement
   ------------------------------------------------------------------ */

const initMtf = () => {
  const stage = document.querySelector('[data-mtf-stage]');
  const linepair = document.querySelector('[data-linepair-svg]');
  const pattern = linepair ? linepair.querySelector('#mtf-lp') : null;
  const periodInput = document.querySelector('[data-period-input]');
  const focusInput = document.querySelector('[data-focus-input]');
  const bar = document.querySelector('[data-mtf-bar]');
  const focusLabel = document.querySelector('[data-focus-label]');
  const profilePath = document.querySelector('[data-profile-path]');
  const imaxLine = document.querySelector('[data-imax-line]');
  const iminLine = document.querySelector('[data-imin-line]');
  const profileDot = document.querySelector('[data-profile-dot]');

  if (!stage || !linepair || !pattern || !periodInput) return;

  const W = 900;
  const MID = 75;
  const CYCLES = 12;
  const state = {
    period: Number(periodInput.value) || 20,
    focus: focusInput ? Number(focusInput.value) || 0 : 0,
  };

  const render = () => {
    const frequency = 1000 / state.period;
    const periodPx = 4 + (state.period - 10) * 0.32;
    const blurPx = 0.3 + (state.focus / 100) * 3.2;
    const base = 0.94 * Math.exp(-0.5 * Math.pow(frequency / 85, 2));
    const mtf = Math.min(
      0.98,
      Math.max(0.02, base * (1 - 0.62 * (state.focus / 100)))
    );
    const imax = 0.5 + mtf / 2;
    const imin = 0.5 - mtf / 2;
    const amplitude = 12 + mtf * 52;

    pattern.setAttribute('width', periodPx.toFixed(2));
    const rects = pattern.querySelectorAll('rect');
    if (rects[0]) rects[0].setAttribute('width', periodPx.toFixed(2));
    if (rects[1]) rects[1].setAttribute('width', (periodPx / 2).toFixed(2));
    linepair.style.setProperty('--blur-px', `${blurPx.toFixed(2)}px`);

    setAll('[data-period]', String(state.period));
    setAll('[data-frequency]', Number.isInteger(frequency) ? String(frequency) : frequency.toFixed(1));
    setAll('[data-mtf]', mtf.toFixed(2));
    setAll('[data-imax]', imax.toFixed(2));
    setAll('[data-imin]', imin.toFixed(2));
    setAll('[data-michelson]', mtf.toFixed(2));
    setAll('[data-mtf-quality]', state.focus < 25 ? '正常' : state.focus < 60 ? '关注' : '失效');

    if (bar) bar.style.width = `${Math.round(mtf * 100)}%`;

    if (focusLabel) {
      focusLabel.textContent =
        state.focus < 25 ? '清晰' : state.focus < 60 ? '轻微离焦' : '离焦';
    }

    if (profilePath) {
      let d = '';
      for (let x = 0; x <= W; x += 5) {
        const y = MID - amplitude * Math.cos((x / W) * Math.PI * 2 * CYCLES);
        d += `${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
      }
      profilePath.setAttribute('d', d);
    }

    if (imaxLine) {
      imaxLine.setAttribute('y1', String(MID - amplitude));
      imaxLine.setAttribute('y2', String(MID - amplitude));
    }

    if (iminLine) {
      iminLine.setAttribute('y1', String(MID + amplitude));
      iminLine.setAttribute('y2', String(MID + amplitude));
    }

    if (profileDot) {
      const dotY = MID - amplitude * Math.cos(Math.PI * 2 * CYCLES * 0.5);
      profileDot.setAttribute('cy', dotY.toFixed(1));
    }
  };

  periodInput.addEventListener('input', (event) => {
    state.period = Number(event.target.value);
    render();
  });

  if (focusInput) {
    focusInput.addEventListener('input', (event) => {
      state.focus = Number(event.target.value);
      render();
    });
  }

  render();
};

/* ------------------------------------------------------------------
   02 / Distortion — cross target O1/O2 and residual
   ------------------------------------------------------------------ */

const initDistortion = () => {
  const svg = document.querySelector('[data-dist-svg]');
  const plot = svg ? svg.querySelector('[data-dist-plot]') : null;
  const diffInput = document.querySelector('[data-dist-diff]');
  const lineToggle = document.querySelector('[data-dist-centerlines]');
  const bar = document.querySelector('[data-dist-bar]');

  if (!svg || !plot) return;

  const state = {
    diff: diffInput ? Number(diffInput.value) : 0.12,
    showLines: lineToggle ? lineToggle.checked : true,
  };

  const label = (x, y, text, fill, anchor = 'start', size = '16') => {
    const node = svgNode('text', {
      x,
      y,
      fill,
      'font-family': LABEL_FONT,
      'font-size': size,
      'text-anchor': anchor,
    });
    node.textContent = text;
    return node;
  };

  const render = () => {
    const group = svgNode('g');

    group.appendChild(
      svgNode('rect', {
        x: '36',
        y: '36',
        width: '648',
        height: '388',
        rx: '10',
        fill: 'none',
        stroke: 'rgba(29,49,69,.08)',
      })
    );

    const bars = [
      [290, 80, 20, 170],
      [210, 180, 155, 20],
      [420, 210, 20, 170],
      [365, 260, 155, 20],
    ];
    bars.forEach(([x, y, w, h]) => {
      group.appendChild(svgNode('rect', { x, y, width: w, height: h, fill: 'rgba(29,49,69,.82)' }));
    });

    if (state.showLines) {
      const lines = [
        [300, 64, 300, 310],
        [194, 190, 381, 190],
        [430, 194, 430, 396],
        [349, 270, 536, 270],
      ];
      lines.forEach(([x1, y1, x2, y2]) => {
        group.appendChild(
          svgNode('line', {
            x1,
            y1,
            x2,
            y2,
            stroke: ACCENT,
            'stroke-width': '1.1',
            'stroke-dasharray': '4 6',
            opacity: '.75',
          })
        );
      });
    }

    group.appendChild(
      svgNode('line', {
        x1: '300',
        y1: '190',
        x2: '430',
        y2: '270',
        stroke: ACCENT,
        'stroke-width': '1',
        'stroke-dasharray': '2 5',
        opacity: '.5',
      })
    );
    group.appendChild(label(346, 248, 'dx / dy', MUTED, 'start', '15'));

    const centres = [
      [300, 190, 'O1', 314, 174],
      [430, 270, 'O2', 444, 254],
    ];
    centres.forEach(([x, y, name, tx, ty]) => {
      group.appendChild(svgNode('circle', { cx: x, cy: y, r: '8', fill: PAPER }));
      group.appendChild(svgNode('circle', { cx: x, cy: y, r: '4', fill: ACCENT }));
      group.appendChild(label(tx, ty, name, ACCENT, 'start', '18'));
    });

    // Residual map inset: one point inside the tolerance ring.
    const rx = 580;
    const ry = 345;
    const rr = 46;
    group.appendChild(
      svgNode('circle', {
        cx: rx,
        cy: ry,
        r: rr,
        fill: 'none',
        stroke: RULE,
        'stroke-width': '1',
        'stroke-dasharray': '4 5',
      })
    );
    group.appendChild(
      svgNode('circle', { cx: rx, cy: ry, r: rr * 0.54, fill: 'none', stroke: RULE, 'stroke-width': '1' })
    );
    group.appendChild(svgNode('line', { x1: rx - rr - 8, y1: ry, x2: rx + rr + 8, y2: ry, stroke: RULE, 'stroke-width': '1' }));
    group.appendChild(svgNode('line', { x1: rx, y1: ry - rr - 8, x2: rx, y2: ry + rr + 8, stroke: RULE, 'stroke-width': '1' }));
    const px = rx + rr * 0.42;
    const py = ry - rr * 0.2;
    group.appendChild(svgNode('line', { x1: rx, y1: ry, x2: px, y2: py, stroke: ACCENT, 'stroke-width': '1' }));
    group.appendChild(svgNode('circle', { cx: px, cy: py, r: '6', fill: PAPER }));
    group.appendChild(svgNode('circle', { cx: px, cy: py, r: '3', fill: ACCENT }));
    group.appendChild(label(rx - rr, ry - rr - 10, '残差图', MUTED, 'start', '18'));

    plot.replaceChildren(group);

    const residual = 0.22 + state.diff * 0.55;
    const dx = 12.4 + state.diff * 0.6;
    const dy = -3.1 + state.diff * 0.3;
    const status = state.diff < 0.2 ? '正常' : state.diff <= 0.5 ? '关注' : '回退梯度';

    setAll('[data-dist-residual]', residual.toFixed(2));
    setAll('[data-dist-dx]', `${dx.toFixed(1)} µm`);
    setAll('[data-dist-dy]', `${dy.toFixed(1).replace('-', '−')} µm`);
    setAll('[data-dist-status]', status);
    setAll('[data-dist-diff-label]', `${state.diff.toFixed(2)} px`);
    if (bar) bar.style.width = `${Math.min(100, Math.round((residual / 0.6) * 100))}%`;
  };

  if (diffInput) {
    diffInput.addEventListener('input', (event) => {
      state.diff = Number(event.target.value);
      render();
    });
  }

  if (lineToggle) {
    lineToggle.addEventListener('change', (event) => {
      state.showLines = event.target.checked;
      render();
    });
  }

  render();
};

/* ------------------------------------------------------------------
   03 / Decentration — reflective crosshair trajectory
   ------------------------------------------------------------------ */

const initDecentration = () => {
  const svg = document.querySelector('[data-dec-svg]');
  const plot = svg ? svg.querySelector('[data-dec-plot]') : null;
  const input = document.querySelector('[data-dec-input]');
  const angleInput = document.querySelector('[data-dec-angle-input]');
  const bar = document.querySelector('[data-dec-bar]');

  if (!svg || !plot) return;

  const CX = 360;
  const CY = 230;
  const R_MM = 50;
  const state = {
    eccentricity: input ? Number(input.value) || 0 : 12,
    angle: angleInput ? Number(angleInput.value) || 0 : 300,
  };

  const label = (x, y, text, fill, anchor = 'start', size = '16') => {
    const node = svgNode('text', {
      x,
      y,
      fill,
      'font-family': LABEL_FONT,
      'font-size': size,
      'text-anchor': anchor,
    });
    node.textContent = text;
    return node;
  };

  const addCross = (group, x, y, size, stroke, opacity, width) => {
    group.appendChild(
      svgNode('line', { x1: x - size, y1: y, x2: x + size, y2: y, stroke, 'stroke-width': width, opacity })
    );
    group.appendChild(
      svgNode('line', { x1: x, y1: y - size, x2: x, y2: y + size, stroke, 'stroke-width': width, opacity })
    );
  };

  const render = () => {
    const radius = 190 * Math.sqrt(state.eccentricity / 50);
    const theta = (state.angle - 90) * (Math.PI / 180);
    const x = CX + Math.cos(theta) * radius;
    const y = CY + Math.sin(theta) * radius;
    const group = svgNode('g');

    group.appendChild(
      svgNode('line', {
        x1: CX - 200,
        y1: CY,
        x2: CX + 200,
        y2: CY,
        stroke: 'rgba(29,49,69,.08)',
        'stroke-width': '1',
      })
    );
    group.appendChild(
      svgNode('line', {
        x1: CX,
        y1: CY - 200,
        x2: CX,
        y2: CY + 200,
        stroke: 'rgba(29,49,69,.08)',
        'stroke-width': '1',
      })
    );

    group.appendChild(
      svgNode('circle', {
        cx: CX,
        cy: CY,
        r: radius.toFixed(1),
        fill: 'none',
        stroke: ACCENT,
        'stroke-width': '1.4',
        'stroke-dasharray': '5 7',
        opacity: '.8',
      })
    );

    [120, 240].forEach((delta) => {
      const a = theta - delta * (Math.PI / 180);
      addCross(
        group,
        CX + Math.cos(a) * radius,
        CY + Math.sin(a) * radius,
        26,
        MUTED,
        '.32',
        '1.6'
      );
    });

    addCross(group, CX, CY, 10, INK, '1', '1.4');
    group.appendChild(svgNode('circle', { cx: CX, cy: CY, r: '3', fill: INK }));

    group.appendChild(
      svgNode('line', {
        x1: CX,
        y1: CY,
        x2: x.toFixed(1),
        y2: y.toFixed(1),
        stroke: ACCENT,
        'stroke-width': '1',
        'stroke-dasharray': '2 5',
        opacity: '.4',
      })
    );

    group.appendChild(svgNode('circle', { cx: x.toFixed(1), cy: y.toFixed(1), r: '9', fill: PAPER }));
    addCross(group, x, y, 32, ACCENT, '1', '2.6');
    group.appendChild(
      label(x < CX ? x - 18 : x + 18, y - 18, '十字像', ACCENT, x < CX ? 'end' : 'start', '17')
    );

    const mx = CX + Math.cos(theta) * radius * 0.5;
    const my = CY + Math.sin(theta) * radius * 0.5;
    group.appendChild(label(mx, my - 12, 'R', MUTED, 'middle', '16'));
    group.appendChild(label(CX, CY - radius - 16, '拟合圆', ACCENT, 'middle', '18'));
    group.appendChild(label(CX + 16, CY + 26, '旋转中心', MUTED, 'start', '18'));

    plot.replaceChildren(group);

    const arcsec = ((state.eccentricity / 1000) / R_MM) * 206264.806;
    setAll('[data-dec-offset]', String(state.eccentricity));
    setAll('[data-dec-value]', String(state.eccentricity));
    setAll('[data-dec-arcsec]', `${Math.round(arcsec)}″`);
    setAll('[data-dec-radius]', `${Math.round(radius)} px`);
    setAll('[data-dec-coverage]', `${state.angle}°`);
    setAll('[data-dec-angle-label]', `${state.angle}°`);
    if (bar) bar.style.width = `${Math.round((state.eccentricity / 50) * 100)}%`;
  };

  if (input) {
    input.addEventListener('input', (event) => {
      state.eccentricity = Number(event.target.value);
      render();
    });
  }

  if (angleInput) {
    angleInput.addEventListener('input', (event) => {
      state.angle = Number(event.target.value);
      render();
    });
  }

  render();
};

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */

const project = document.body.dataset.project;

if (project === 'mtf') initMtf();
if (project === 'distortion') initDistortion();
if (project === 'decentration') initDecentration();
