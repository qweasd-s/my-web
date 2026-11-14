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
   02 / Distortion — captured grid to model fit
   ------------------------------------------------------------------ */

const initDistortion = () => {
  const svg = document.querySelector('[data-dist-svg]');
  const plot = svg ? svg.querySelector('[data-dist-plot]') : null;
  const input = document.querySelector('[data-dist-input]');
  const pointsToggle = document.querySelector('[data-dist-points]');
  const bar = document.querySelector('[data-dist-bar]');

  if (!svg || !plot || !input) return;

  const W = 720;
  const H = 460;
  const CX = W / 2;
  const CY = H / 2;
  const HALF_W = 245;
  const HALF_H = 150;
  const COLS = 9;
  const ROWS = 7;
  const state = {
    k: Number(input.value),
    showPoints: pointsToggle ? pointsToggle.checked : true,
  };

  const mapPoint = (nx, ny) => {
    const radius2 = nx * nx + ny * ny;
    const factor = 1 + state.k * radius2;
    return [CX + nx * HALF_W * factor, CY + ny * HALF_H * factor];
  };

  const buildPolyline = (points, stroke, dash = '') => {
    const polyline = svgNode('polyline', {
      fill: 'none',
      stroke,
      'stroke-width': '1.15',
      'stroke-linejoin': 'round',
      points: points.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '),
    });
    if (dash) polyline.setAttribute('stroke-dasharray', dash);
    return polyline;
  };

  const render = () => {
    const ideal = svgNode('g', { opacity: '0.7' });
    const actual = svgNode('g');
    const points = svgNode('g', {
      opacity: state.showPoints ? '1' : '0',
      'data-dist-points-group': '',
    });
    const highlight = svgNode('g');

    for (let i = 0; i < COLS; i += 1) {
      const nx = (i / (COLS - 1)) * 2 - 1;
      const x = CX + nx * HALF_W;
      ideal.appendChild(
        svgNode('line', {
          x1: x,
          y1: CY - HALF_H,
          x2: x,
          y2: CY + HALF_H,
          stroke: RULE,
          'stroke-width': '1',
          'stroke-dasharray': '3 6',
        })
      );
    }

    for (let j = 0; j < ROWS; j += 1) {
      const ny = (j / (ROWS - 1)) * 2 - 1;
      const y = CY + ny * HALF_H;
      ideal.appendChild(
        svgNode('line', {
          x1: CX - HALF_W,
          y1: y,
          x2: CX + HALF_W,
          y2: y,
          stroke: RULE,
          'stroke-width': '1',
          'stroke-dasharray': '3 6',
        })
      );
    }

    for (let i = 0; i < COLS; i += 1) {
      const column = [];
      for (let j = 0; j < ROWS; j += 1) {
        const nx = (i / (COLS - 1)) * 2 - 1;
        const ny = (j / (ROWS - 1)) * 2 - 1;
        column.push(mapPoint(nx, ny));
      }
      actual.appendChild(buildPolyline(column, INK));
    }

    for (let j = 0; j < ROWS; j += 1) {
      const row = [];
      for (let i = 0; i < COLS; i += 1) {
        const nx = (i / (COLS - 1)) * 2 - 1;
        const ny = (j / (ROWS - 1)) * 2 - 1;
        row.push(mapPoint(nx, ny));
      }
      actual.appendChild(buildPolyline(row, INK));
    }

    for (let i = 0; i < COLS; i += 1) {
      for (let j = 0; j < ROWS; j += 1) {
        const nx = (i / (COLS - 1)) * 2 - 1;
        const ny = (j / (ROWS - 1)) * 2 - 1;
        const [x, y] = mapPoint(nx, ny);
        points.appendChild(
          svgNode('circle', {
            cx: x.toFixed(1),
            cy: y.toFixed(1),
            r: '1.8',
            fill: ACCENT,
          })
        );
      }
    }

    const [cornerX, cornerY] = mapPoint(1, 1);
    highlight.appendChild(
      svgNode('line', {
        x1: CX + HALF_W,
        y1: CY + HALF_H,
        x2: cornerX,
        y2: cornerY,
        stroke: ACCENT,
        'stroke-width': '1',
        'stroke-dasharray': '2 4',
      })
    );
    highlight.appendChild(
      svgNode('circle', {
        cx: cornerX.toFixed(1),
        cy: cornerY.toFixed(1),
        r: '6.5',
        fill: PAPER,
      })
    );
    highlight.appendChild(
      svgNode('circle', {
        cx: cornerX.toFixed(1),
        cy: cornerY.toFixed(1),
        r: '4',
        fill: 'none',
        stroke: ACCENT,
        'stroke-width': '1.2',
      })
    );
    highlight.appendChild(
      svgNode('circle', {
        cx: cornerX.toFixed(1),
        cy: cornerY.toFixed(1),
        r: '2',
        fill: ACCENT,
      })
    );

    const centre = svgNode('g', { opacity: '0.8' });
    centre.appendChild(
      svgNode('line', {
        x1: CX - 10,
        y1: CY,
        x2: CX + 10,
        y2: CY,
        stroke: RULE,
        'stroke-width': '1',
      })
    );
    centre.appendChild(
      svgNode('line', {
        x1: CX,
        y1: CY - 10,
        x2: CX,
        y2: CY + 10,
        stroke: RULE,
        'stroke-width': '1',
      })
    );

    plot.replaceChildren(ideal, actual, points, highlight, centre);

    const kText = state.k.toFixed(2).replace('-', '−');
    const delta = Math.round(Math.abs(state.k) * 100);

    setAll('[data-dist-k]', kText);
    setAll('[data-dist-delta]', String(delta));
    if (bar) bar.style.width = `${Math.min(100, Math.round((Math.abs(state.k) / 0.3) * 100))}%`;
  };

  input.addEventListener('input', (event) => {
    state.k = Number(event.target.value);
    render();
  });

  if (pointsToggle) {
    pointsToggle.addEventListener('change', (event) => {
      state.showPoints = event.target.checked;
      render();
    });
  }

  render();
};

/* ------------------------------------------------------------------
   03 / Decentration — dual-path offset
   ------------------------------------------------------------------ */

const initDecentration = () => {
  const svg = document.querySelector('[data-dec-svg]');
  const plot = svg ? svg.querySelector('[data-dec-plot]') : null;
  const input = document.querySelector('[data-dec-input]');
  const bar = document.querySelector('[data-dec-bar]');

  if (!svg || !plot || !input) return;

  const CX = 360;
  const SENSOR_Y = 310;
  const state = { offset: Number(input.value) || 0 };

  const render = () => {
    const lensX = CX + state.offset * 1.7;
    const group = svgNode('g');

    group.appendChild(
      svgNode('line', {
        x1: CX,
        y1: 50,
        x2: CX,
        y2: 370,
        stroke: 'rgba(29,49,69,.32)',
        'stroke-width': '1',
        'stroke-dasharray': '5 5',
      })
    );

    group.appendChild(
      svgNode('line', {
        x1: lensX,
        y1: 50,
        x2: lensX,
        y2: 370,
        stroke: ACCENT,
        'stroke-width': '1.6',
      })
    );

    group.appendChild(
      svgNode('path', {
        d: `M${lensX} 80 Q${lensX - 82} 170 ${lensX} 260 Q${lensX + 82} 170 ${lensX} 80 Z`,
        fill: 'rgba(30,107,146,.09)',
        stroke: INK,
        'stroke-width': '1.6',
      })
    );

    // The optical axis reads through the glass.
    group.appendChild(
      svgNode('line', {
        x1: lensX,
        y1: 92,
        x2: lensX,
        y2: 252,
        stroke: ACCENT,
        'stroke-width': '1.1',
        'stroke-dasharray': '3 6',
        opacity: '.55',
      })
    );

    group.appendChild(
      svgNode('line', {
        x1: 80,
        y1: SENSOR_Y,
        x2: 640,
        y2: SENSOR_Y,
        stroke: INK,
        'stroke-width': '1.4',
      })
    );

    for (let x = 80; x <= 640; x += 80) {
      group.appendChild(
        svgNode('line', {
          x1: x,
          y1: SENSOR_Y,
          x2: x,
          y2: SENSOR_Y + 6,
          stroke: INK,
          'stroke-width': '1',
        })
      );
    }

    group.appendChild(
      svgNode('path', {
        d: `M100 80 L${lensX - 70} 160 L${lensX} ${SENSOR_Y}`,
        fill: 'none',
        stroke: 'rgba(29,49,69,.55)',
        'stroke-width': '1.2',
      })
    );
    group.appendChild(
      svgNode('path', {
        d: `M620 80 L${lensX + 70} 160 L${lensX} ${SENSOR_Y}`,
        fill: 'none',
        stroke: 'rgba(29,49,69,.55)',
        'stroke-width': '1.2',
      })
    );

    group.appendChild(
      svgNode('circle', {
        cx: lensX,
        cy: SENSOR_Y,
        r: '6',
        fill: PAPER,
      })
    );
    group.appendChild(
      svgNode('circle', {
        cx: lensX,
        cy: SENSOR_Y,
        r: '3.4',
        fill: ACCENT,
      })
    );

    const dimY = 342;
    group.appendChild(
      svgNode('line', {
        x1: CX,
        y1: dimY,
        x2: lensX,
        y2: dimY,
        stroke: MUTED,
        'stroke-width': '1',
      })
    );
    [CX, lensX].forEach((x) => {
      group.appendChild(
        svgNode('line', {
          x1: x,
          y1: dimY - 4,
          x2: x,
          y2: dimY + 4,
          stroke: MUTED,
          'stroke-width': '1',
        })
      );
    });

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

    group.appendChild(label(CX - 10, 42, '机械轴', MUTED, 'end', '18'));
    group.appendChild(label(lensX + 10, 42, '光轴', ACCENT, 'start', '18'));
    group.appendChild(label(CX, dimY + 18, 'Δ', MUTED, 'middle', '16'));
    group.appendChild(label(636, SENSOR_Y + 20, '传感器', MUTED, 'end', '15'));
    group.appendChild(label(104, 72, '通道 A', ACCENT, 'start', '15'));
    group.appendChild(label(616, 72, '通道 B', ACCENT, 'end', '15'));

    plot.replaceChildren(group);

    setAll('[data-dec-offset]', String(state.offset));
    setAll('[data-dec-value]', String(state.offset));
    if (bar) bar.style.width = `${Math.round((state.offset / 50) * 100)}%`;
  };

  input.addEventListener('input', (event) => {
    state.offset = Number(event.target.value);
    render();
  });

  render();
};

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */

const project = document.body.dataset.project;

if (project === 'mtf') initMtf();
if (project === 'distortion') initDistortion();
if (project === 'decentration') initDecentration();
