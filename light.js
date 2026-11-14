/* Refract light: one sun, a glass pane, and a prism fan drawn live. */
(() => {
  const stages = document.querySelectorAll('[data-light-stage]');
  if (!stages.length) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spectrum = ['#ff9e6b', '#f2c85b', '#dbe36f', '#63cfb2', '#45bfae', '#8a7fe0'];

  stages.forEach((stage) => {
    const canvas = stage.querySelector('canvas[data-light]');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    let last = 0;
    let time = 0;

    const draw = (t) => {
      const w = width;
      const h = height;
      const min = Math.min(w, h);
      const phase = t * 0.00006;

      ctx.clearRect(0, 0, w, h);

      // Sunlit plaster: warm at the top left, cooling toward the floor.
      const base = ctx.createLinearGradient(0, 0, w, h);
      base.addColorStop(0, '#fdfbf5');
      base.addColorStop(0.5, '#f4f7f2');
      base.addColorStop(0.82, '#e4eeec');
      base.addColorStop(1, '#d3e5e6');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, w, h);

      // The sun, high and to the right.
      const sun = ctx.createRadialGradient(w * 0.82, h * 0.02, 0, w * 0.82, h * 0.02, Math.max(w, h) * 1.05);
      sun.addColorStop(0, 'rgba(255,250,231,.95)');
      sun.addColorStop(0.22, 'rgba(255,244,214,.62)');
      sun.addColorStop(0.55, 'rgba(255,240,210,.2)');
      sun.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sun;
      ctx.fillRect(0, 0, w, h);

      // Cool shade pooling at the far edge of the pane.
      const shade = ctx.createLinearGradient(w * 0.3, h * 0.25, w, h);
      shade.addColorStop(0, 'rgba(120,175,190,0)');
      shade.addColorStop(0.6, 'rgba(140,190,200,.16)');
      shade.addColorStop(1, 'rgba(96,158,175,.34)');
      ctx.fillStyle = shade;
      ctx.fillRect(0, 0, w, h);

      // Glazing bars: a tinted shadow with a lit edge.
      const barsX = [0.58, 0.86];
      const barsY = [0.2];
      ctx.lineWidth = 1;
      barsX.forEach((bx, i) => {
        const x = w * bx;
        ctx.strokeStyle = 'rgba(96,150,164,.14)';
        ctx.beginPath();
        ctx.moveTo(x + 5, 0);
        ctx.lineTo(x + 5, h);
        ctx.stroke();
        ctx.strokeStyle = i === 0 ? 'rgba(255,255,255,.5)' : 'rgba(255,255,255,.42)';
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      });
      barsY.forEach((by) => {
        const y = h * by;
        ctx.strokeStyle = 'rgba(96,150,164,.14)';
        ctx.beginPath();
        ctx.moveTo(0, y + 5);
        ctx.lineTo(w, y + 5);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255,255,255,.5)';
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      });

      // Caustic bands carried across the plaster.
      for (let i = 0; i < 5; i += 1) {
        const yy = h * (0.46 + i * 0.1);
        const amp = 8 + i * 4;
        ctx.beginPath();
        ctx.moveTo(w * 0.22, yy);
        for (let x = w * 0.22; x <= w * 1.02; x += 12) {
          const y = yy + Math.sin(x * 0.025 + phase * 7 + i * 1.7) * amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${0.34 + i * 0.04})`;
        ctx.lineWidth = 3 + i * 1.6;
        ctx.shadowColor = 'rgba(255,255,255,.75)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.moveTo(w * 0.22, yy + 10);
        for (let x = w * 0.22; x <= w * 1.02; x += 12) {
          const y = yy + 10 + Math.sin(x * 0.025 + phase * 7 + i * 1.7) * amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = 'rgba(110,165,175,.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Prism
      const px = w * 0.76 + Math.sin(phase * 4) * 4;
      const py = h * 0.3;
      const s = min * 0.16;
      const top = [px, py - s * 0.9];
      const left = [px - s * 0.82, py + s * 0.55];
      const right = [px + s * 0.82, py + s * 0.55];

      // A cool shadow under the glass.
      ctx.save();
      ctx.translate(px + s * 0.16, py + s * 0.62);
      ctx.scale(1.35, 0.32);
      const drop = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 0.9);
      drop.addColorStop(0, 'rgba(96,154,168,.28)');
      drop.addColorStop(1, 'rgba(96,154,168,0)');
      ctx.fillStyle = drop;
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Incoming white beam.
      ctx.strokeStyle = 'rgba(255,255,255,.55)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.17);
      ctx.lineTo(px - s * 0.55, py - s * 0.1);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(w * 0.3, h * 0.17);
      ctx.lineTo(px - s * 0.55, py - s * 0.1);
      ctx.stroke();

      // Spectrum fan, only inside the light.
      const exit = [px + s * 0.58, py + s * 0.14];
      for (let i = 0; i < spectrum.length; i += 1) {
        const t0 = i / spectrum.length;
        const t1 = (i + 1) / spectrum.length;
        const y0 = py - s * 0.3 + t0 * h * 0.46;
        const y1 = py - s * 0.3 + t1 * h * 0.46;
        ctx.beginPath();
        ctx.moveTo(exit[0], exit[1]);
        ctx.lineTo(w + 60, y0);
        ctx.lineTo(w + 60, y1);
        ctx.closePath();
        ctx.fillStyle = spectrum[i];
        ctx.globalAlpha = 0.24;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // White cusp along the top of the fan.
      ctx.strokeStyle = 'rgba(255,255,255,.7)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(exit[0], exit[1]);
      ctx.lineTo(w + 60, py - s * 0.3);
      ctx.stroke();

      // Glass body.
      const body = ctx.createLinearGradient(left[0], top[1], right[0], right[1]);
      body.addColorStop(0, 'rgba(255,255,255,.42)');
      body.addColorStop(0.55, 'rgba(255,255,255,.12)');
      body.addColorStop(1, 'rgba(160,205,212,.16)');
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(left[0], left[1]);
      ctx.lineTo(right[0], right[1]);
      ctx.closePath();
      ctx.fillStyle = body;
      ctx.fill();
      ctx.strokeStyle = 'rgba(96,148,158,.55)';
      ctx.lineWidth = 1.3;
      ctx.stroke();

      // A lit edge and a cool inner edge give the glass thickness.
      ctx.strokeStyle = 'rgba(255,255,255,.95)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(top[0], top[1]);
      ctx.lineTo(left[0] + 2, left[1] - 2);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(96,148,158,.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(top[0] + s * 0.06, top[1] + s * 0.08);
      ctx.lineTo(right[0] - s * 0.06, right[1] - s * 0.04);
      ctx.stroke();

      // A soft highlight on the pane itself.
      const glow = ctx.createRadialGradient(w * 0.66, h * 0.46, 0, w * 0.66, h * 0.46, min * 0.42);
      glow.addColorStop(0, 'rgba(255,255,255,.16)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    };

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(time);
    };

    const loop = (now) => {
      raf = 0;
      if (!visible) return;
      if (now - last > 33) {
        time = now;
        last = now;
        draw(time);
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(loop);
    };

    if (!reduce && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          visible = entry.isIntersecting;
          if (visible) start();
        });
      }, { threshold: 0.05 });
      observer.observe(stage);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });
    if (reduce) {
      draw(0);
    } else {
      start();
    }
  });
})();
