/* Desktop pet: a small, draggable character drawn from the portrait. */
(() => {
  const mount = document.querySelector('[data-pet-root]') || document.body;

  const project = document.body.dataset.project;
  const lines = {
    mtf: ['在测 MTF，先别晃。', 'NRMSE 超了，也要把状态标出来。', '这条线对，周期 20 µm。'],
    distortion: ['O1 和 O2 都找到了。', '一阶模型先看真实问题。', '边缘差多少，心里要有数。'],
    decentration: ['转一圈，再看拟合圆。', '偏心仪还在标定。', '别只信最后一个数。'],
  }[project] || [
    '在镜片与代码之间，做测量光的软件。',
    '可以拖动我。',
    'µm 级的东西，急不来。',
    '有问题？发邮件比戳我快。',
  ];

  const greeting = window.innerWidth > 900
    ? '我是刘东琦。可以拖动我，或者点一下。'
    : '我是刘东琦。点我说话。';

  const pet = document.createElement('div');
  pet.className = 'pet';
  pet.innerHTML = `
    <div class="pet__bubble" role="status" aria-live="polite" aria-hidden="true">
      <p class="pet__text"></p>
    </div>
    <button class="pet__character" type="button" aria-label="和刘东琦打招呼，可以拖动我">
      <svg class="pet-svg" viewBox="0 0 220 300" aria-hidden="true" focusable="false">

  <defs>
    <clipPath id="pet-head-clip">
      <path d="M64 116c0-37 20-62 46-62s46 25 46 62c0 36-19 62-46 62s-46-26-46-62Z"/>
    </clipPath>
  </defs>
  <ellipse cx="110" cy="286" rx="62" ry="8" fill="#1d3145" opacity=".10"/>
  <g class="pet-bob">
  <g class="pet-legs">
    <rect x="82" y="232" width="20" height="48" rx="9" fill="#26384a"/>
    <rect x="118" y="232" width="20" height="48" rx="9" fill="#26384a"/>
    <rect x="76" y="270" width="30" height="14" rx="7" fill="#1d3145"/>
    <rect x="114" y="270" width="30" height="14" rx="7" fill="#1d3145"/>
  </g>
  <g class="pet-body">
    <path d="M64 190c0-10 9-18 20-18h52c11 0 20 8 20 18v42c0 8-6 14-14 14H78c-8 0-14-6-14-14Z" fill="#f7f4ea"/>
    <path d="M62 192c0-12 10-21 22-21h14l-6 78H78c-9 0-16-7-16-16Z" fill="#b8c8d4"/>
    <path d="M158 192c0-12-10-21-22-21h-14l6 78h14c9 0 16-7 16-16Z" fill="#b8c8d4"/>
    <path d="M104 171 96 186l14 7 14-7-8-15Z" fill="#fffdf6"/>
    <path d="M96 186c-7 3-10 9-10 16v30" fill="none" stroke="#93a8b8" stroke-width="2"/>
    <path d="M124 186c7 3 10 9 10 16v30" fill="none" stroke="#93a8b8" stroke-width="2"/>
    <path d="M62 196c-8 4-12 12-13 23l-2 22c0 6 4 10 9 10s9-4 9-9l1-17" fill="#b8c8d4" stroke="#93a8b8" stroke-width="2"/>
    <path d="M158 196c8 4 12 12 13 23l2 22c0 6-4 10-9 10s-9-4-9-9l-1-17" fill="#b8c8d4" stroke="#93a8b8" stroke-width="2"/>
    <circle cx="58" cy="248" r="8" fill="#f2c9b4"/>
    <circle cx="162" cy="248" r="8" fill="#f2c9b4"/>
    <path d="M98 182h24l-6 9h-12Z" fill="#e6e1d3"/>
    <rect x="118" y="204" width="12" height="15" rx="3" fill="#f7f4ea" stroke="#d8d2c3" stroke-width="1"/>
    <path d="M77 204h30" stroke="#d8d2c3" stroke-width="1"/>
    <path d="M75 221h28" stroke="#d8d2c3" stroke-width="1"/>
  </g>
  <g class="pet-head">
    <path d="M68 116c0-34 18-58 42-58s42 24 42 58c0 34-17 58-42 58s-42-24-42-58Z" fill="#f2c9b4"/>
    <g clip-path="url(#pet-head-clip)">
      <path d="M57 120c-4-39 18-68 53-68s57 29 53 68c-1 11-5 20-11 25 2-20-5-35-19-43-7 7-19 11-33 11-13 0-24-4-32-11-13 8-20 23-18 43-6-5-9-14-10-25Z" fill="#191a1c"/>
      <path d="M70 102c8-12 22-19 40-19s32 7 40 19c-2 11-8 18-16 21l-5-13-9 11-10-10-10 10-10-10-9 11-5-13c-8-3-14-10-16-21Z" fill="#191a1c"/>
      <path d="M76 82c8-8 19-12 34-12s26 4 34 12" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1.8" stroke-linecap="round"/>
    </g>
    <ellipse cx="62" cy="128" rx="9" ry="15" fill="#f2c9b4"/>
    <ellipse cx="158" cy="128" rx="9" ry="15" fill="#f2c9b4"/>
    <g class="pet-eyes">
      <ellipse cx="93" cy="124" rx="9" ry="10" fill="#fffdf8"/>
      <ellipse cx="127" cy="124" rx="9" ry="10" fill="#fffdf8"/>
      <g class="pet-pupil">
        <circle cx="93" cy="125" r="5" fill="#1d3145"/>
        <circle cx="127" cy="125" r="5" fill="#1d3145"/>
        <circle cx="95" cy="123" r="1.5" fill="#fff"/>
        <circle cx="129" cy="123" r="1.5" fill="#fff"/>
      </g>
    </g>
    <path d="M84 110c5-3 11-3 16-1" fill="none" stroke="#191a1c" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M120 109c5-2 11-2 16 1" fill="none" stroke="#191a1c" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M110 131c-1 6-3 9-6 10" fill="none" stroke="#d9a58f" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M102 151c5 3 11 3 16 0" fill="none" stroke="#b87363" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="84" cy="142" rx="7" ry="4" fill="#df9b86" opacity=".18"/>
    <ellipse cx="136" cy="142" rx="7" ry="4" fill="#df9b86" opacity=".18"/>
  </g>
  </g>

      </svg>
    </button>
    <span class="pet__hint" aria-hidden="true">点我说话</span>
  `;
  mount.appendChild(pet);

  const button = pet.querySelector('.pet__character');
  const bubble = pet.querySelector('.pet__bubble');
  const text = pet.querySelector('.pet__text');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let hideTimer = 0;
  let lastLine = -1;
  let hasSpoken = false;
  let drag = null;
  let suppressClick = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setBubble = (message, duration = 4200) => {
    window.clearTimeout(hideTimer);
    text.textContent = message;
    pet.classList.add('is-talking');
    bubble.setAttribute('aria-hidden', 'false');
    if (window.innerWidth > 900) {
      hideTimer = window.setTimeout(() => {
        pet.classList.remove('is-talking');
        bubble.setAttribute('aria-hidden', 'true');
      }, duration);
    }
  };

  const hideBubble = () => {
    window.clearTimeout(hideTimer);
    pet.classList.remove('is-talking');
    bubble.setAttribute('aria-hidden', 'true');
  };

  const nextLine = () => {
    if (lines.length === 1) return lines[0];
    let index = Math.floor(Math.random() * lines.length);
    if (index === lastLine) index = (index + 1) % lines.length;
    lastLine = index;
    return lines[index];
  };

  button.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    if (pet.classList.contains('is-talking')) {
      hideBubble();
      return;
    }

    if (!hasSpoken) {
      hasSpoken = true;
      setBubble(project ? lines[0] : greeting);
      return;
    }
    setBubble(nextLine());
  });

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0 || window.innerWidth <= 900) return;
    const rect = pet.getBoundingClientRect();
    drag = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: rect.left,
      top: rect.top,
      moved: false,
    };
    button.setPointerCapture(event.pointerId);
  });

  button.addEventListener('pointermove', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return;

    if (!drag.moved) {
      drag.moved = true;
      pet.classList.add('is-dragging');
      hideBubble();
    }

    const width = pet.offsetWidth;
    const height = pet.offsetHeight;
    const left = clamp(drag.left + dx, 8, window.innerWidth - width - 8);
    const top = clamp(drag.top + dy, 8, window.innerHeight - height - 8);
    pet.style.left = `${left}px`;
    pet.style.top = `${top}px`;
    pet.style.right = 'auto';
    pet.style.bottom = 'auto';
  });

  button.addEventListener('pointerup', (event) => {
    if (!drag || drag.id !== event.pointerId) return;
    const moved = drag.moved;
    drag = null;
    pet.classList.remove('is-dragging');
    suppressClick = moved;
    if (moved) {
      try {
        localStorage.setItem('ldq-pet-position', JSON.stringify({
          left: pet.offsetLeft,
          top: pet.offsetTop,
        }));
      } catch (error) {
        // Position persistence is optional.
      }
    }
  });

  button.addEventListener('pointercancel', () => {
    drag = null;
    pet.classList.remove('is-dragging');
  });

  // Keep the character's eyes on the pointer.
  window.addEventListener('pointermove', (event) => {
    const rect = pet.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.4;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const distance = Math.max(1, Math.hypot(dx, dy));
    const strength = Math.min(2.4, distance / 90);
    pet.style.setProperty('--pet-look-x', `${(dx / distance) * strength}px`);
    pet.style.setProperty('--pet-look-y', `${(dy / distance) * strength}px`);
    pet.style.setProperty('--pet-tilt', `${clamp(dx / 120, -2, 2)}deg`);
  }, { passive: true });

  const restorePosition = () => {
    if (window.innerWidth <= 900) return;
    try {
      const saved = JSON.parse(localStorage.getItem('ldq-pet-position') || 'null');
      if (!saved) return;
      const left = clamp(Number(saved.left) || 0, 8, window.innerWidth - pet.offsetWidth - 8);
      const top = clamp(Number(saved.top) || 0, 8, window.innerHeight - pet.offsetHeight - 8);
      pet.style.left = `${left}px`;
      pet.style.top = `${top}px`;
      pet.style.right = 'auto';
      pet.style.bottom = 'auto';
    } catch (error) {
      // Ignore malformed storage.
    }
  };

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
      pet.style.left = '';
      pet.style.top = '';
      pet.style.right = '';
      pet.style.bottom = '';
      return;
    }
    if (!pet.style.left) return;
    const left = clamp(pet.offsetLeft, 8, window.innerWidth - pet.offsetWidth - 8);
    const top = clamp(pet.offsetTop, 8, window.innerHeight - pet.offsetHeight - 8);
    pet.style.left = `${left}px`;
    pet.style.top = `${top}px`;
  }, { passive: true });

  restorePosition();

  if (!reduce && window.innerWidth > 900) {
    try {
      if (!sessionStorage.getItem('ldq-pet-greeted')) {
        sessionStorage.setItem('ldq-pet-greeted', '1');
        window.setTimeout(() => {
          hasSpoken = true;
          setBubble(project ? lines[0] : greeting, 5000);
        }, 1800);
      }
    } catch (error) {
      // Greeting is optional.
    }
  }
})();
