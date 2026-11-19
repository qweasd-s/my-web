/* Desktop pet + offline voice Q&A, drawn from the portrait. */
(() => {
  const mount = document.querySelector('[data-pet-root]') || document.body;
  if (!mount) return;

  const project = document.body.dataset.project;
  const avatarSrc = project ? '../assets/portrait.jpg' : 'assets/portrait.jpg';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const faq = [
    {
      keys: ['你是谁', '介绍', '名字', '刘东琦', '小刘'],
      a: '我是刘东琦，AI 软件开发工程师，在光学镜片行业做测量软件。',
    },
    {
      keys: ['做什么', '项目', '工作', '工具'],
      a: '我把 MTF、畸变和偏心测量做成工程师真的会用的软件，主要用 MATLAB、Python 和 Qt。',
    },
    {
      keys: ['mtf', '调制传递', '线对'],
      a: 'MTF 工具批量读明场、暗场和检测图，自动找四方向线对，输出 MTF、质量状态和 Excel / MAT 报表。',
    },
    {
      keys: ['质量', 'nrmse', 'michelson', '校核'],
      a: 'MTF 结果会带质量状态。NRMSE 超限也保留数值但标出来，另做 Michelson 对比度校核。',
    },
    {
      keys: ['畸变', 'o1', 'o2', '十字'],
      a: '畸变工具在十字靶图上定位 O1 / O2，用 ESF 和梯度双路边缘交叉校验，最后输出一阶残差图和质检报告。',
    },
    {
      keys: ['一阶', '高阶', '模型'],
      a: '畸变先用一阶模型。高阶模型能把残差压小，但也可能把拍摄或装配的问题一起拟合掉。',
    },
    {
      keys: ['偏心', '偏心仪', '圆拟合'],
      a: '偏心仪软件还是 MVP：相机追球心十字像，镜片转一圈后鲁棒拟合圆，再换算线偏心和角偏心。',
    },
    {
      keys: ['精度', 'um', 'µm', '微米', '公差'],
      a: '精度是 µm 级。具体公差要以标定和软件输出为准，网站上不写没有公开验证过的数值。',
    },
    {
      keys: ['现在', '最近', '在做什么', '进度'],
      a: '现在在补偏心仪 MVP 的标定和重复性。标定、温漂和标准件验证没走完，不会把它当成最终判定。',
    },
    {
      keys: ['技术', '栈', '会什么', 'matlab', 'python', 'qt', 'opencv'],
      a: '常用 MATLAB 做批量计算，Python + OpenCV + PySide6 做桌面测量软件，前端是原生 HTML、CSS 和 JS。',
    },
    {
      keys: ['联系', '邮箱', '邮件', '合作', '招聘'],
      a: '可以直接发邮件到 2823641678@qq.com。',
    },
    {
      keys: ['语音', '声音', '说话'],
      a: '声音是浏览器合成的中文语音。不想听的话，点右上角的“声音”按钮关掉。',
    },
    {
      keys: ['你好', 'hi', 'hello', '嗨'],
      a: '你好。可以问我项目、精度、现在在做什么，或者怎么联系我。',
    },
  ];

  const fallback = '这个问题我还没写进离线回答里。可以发邮件到 2823641678@qq.com，或者问我项目、精度、联系方式。';
  const greeting = '你好，我是刘东琦。可以问我项目、精度，或者怎么联系我。';
  const chips = {
    mtf: ['MTF 怎么测', '质量状态', '现在', '联系'],
    distortion: ['畸变怎么算', '一阶模型', '现在', '联系'],
    decentration: ['偏心怎么测', '精度', '现在', '联系'],
  }[project] || ['你是谁', '做什么', '现在', '联系'];

  const pet = document.createElement('div');
  pet.className = 'pet';
  pet.innerHTML = `
    <section class="pet-panel" data-pet-panel tabindex="-1" aria-label="问小刘" aria-hidden="true">
      <header class="pet-panel__head">
        <img class="pet-panel__avatar" src="${avatarSrc}" alt="" width="38" height="38">
        <div class="pet-panel__id">
          <b>刘东琦</b>
          <span>离线语音分身</span>
        </div>
        <button class="pet-panel__voice" type="button" data-pet-voice aria-pressed="true">声音 开</button>
        <button class="pet-panel__close" type="button" data-pet-close aria-label="关闭问答">×</button>
      </header>
      <div class="pet-panel__answer" data-pet-answer aria-live="polite">
        <p class="pet-panel__text">${greeting}</p>
      </div>
      <div class="pet-panel__chips" data-pet-chips></div>
      <form class="pet-panel__form" data-pet-form>
        <label class="sr-only" for="pet-question">问一个简单问题</label>
        <input id="pet-question" name="q" type="text" autocomplete="off" placeholder="问一个简单问题…" data-pet-input>
        <button type="submit">发送</button>
      </form>
      <p class="pet-panel__note" data-pet-note>按肖像画的离线分身；离线匹配，不上传问题，语音由浏览器合成。不是在线 AI。</p>
    </section>
    <div class="pet__bubble" role="status" aria-live="polite" aria-hidden="true">
      <p class="pet__text"></p>
    </div>
    <button class="pet__character" type="button" aria-label="和刘东琦对话，可以拖动我">
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
      <path d="M70 102c8-12 22-19 40-19s32 7 40 19c-2 11-8 18-16 21l-5-13-9 11-10-10-10 10-10-10-9 11-5-13c-8-3-14-10-16-21Z" fill="#191a1c" transform="translate(0,-9)"/>
      <path d="M76 82c8-8 19-12 34-12s26 4 34 12" fill="none" stroke="rgba(255,255,255,.13)" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M74 93c7-9 17-14 30-16" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M146 93c-7-9-17-14-30-16" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1.4" stroke-linecap="round"/>
    </g>
    <ellipse cx="62" cy="128" rx="9" ry="15" fill="#f2c9b4"/>
    <ellipse cx="158" cy="128" rx="9" ry="15" fill="#f2c9b4"/>
    <g class="pet-eyes">
      <ellipse cx="93" cy="124" rx="7.8" ry="8.6" fill="#fffdf8"/>
      <ellipse cx="127" cy="124" rx="7.8" ry="8.6" fill="#fffdf8"/>
      <g class="pet-pupil">
        <circle cx="93" cy="125" r="4.2" fill="#1d3145"/>
        <circle cx="127" cy="125" r="4.2" fill="#1d3145"/>
        <circle cx="94.8" cy="123" r="1.3" fill="#fff"/>
        <circle cx="128.8" cy="123" r="1.3" fill="#fff"/>
      </g>
    </g>
    <path d="M84 114c5-3 11-3 16-1" fill="none" stroke="#191a1c" stroke-width="2" stroke-linecap="round"/>
    <path d="M120 113c5-2 11-2 16 1" fill="none" stroke="#191a1c" stroke-width="2" stroke-linecap="round"/>
    <path d="M110 131c-1 6-3 9-6 10" fill="none" stroke="#d9a58f" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M102 151c5 3 11 3 16 0" fill="none" stroke="#b87363" stroke-width="2" stroke-linecap="round"/>
  </g>
  </g>

      </svg>
    </button>
    <span class="pet__hint" aria-hidden="true">点我说话</span>
  `;
  mount.appendChild(pet);

  const panel = pet.querySelector('[data-pet-panel]');
  const answer = pet.querySelector('[data-pet-answer]');
  const chipsWrap = pet.querySelector('[data-pet-chips]');
  const form = pet.querySelector('[data-pet-form]');
  const input = pet.querySelector('[data-pet-input]');
  const voiceBtn = pet.querySelector('[data-pet-voice]');
  const closeBtn = pet.querySelector('[data-pet-close]');
  const note = pet.querySelector('[data-pet-note]');
  const button = pet.querySelector('.pet__character');
  const bubble = pet.querySelector('.pet__bubble');
  const bubbleText = pet.querySelector('.pet__text');
  const canSpeak = 'speechSynthesis' in window;

  let voiceOn = true;
  try {
    voiceOn = localStorage.getItem('ldq-pet-voice') !== '0';
  } catch (error) {
    // Use the default.
  }

  let greeted = false;
  let hideTimer = 0;
  let drag = null;
  let suppressClick = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const normalize = (value) => value.toLowerCase().replace(/[\s，。？！、,.!?：:；;]/g, '');

  const speak = (message) => {
    if (!voiceOn || !canSpeak || !message) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.98;
    utterance.pitch = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const chinese = voices.find((voice) => /^zh/i.test(voice.lang));
    if (chinese) utterance.voice = chinese;
    utterance.onstart = () => pet.classList.add('is-speaking');
    utterance.onend = () => pet.classList.remove('is-speaking');
    utterance.onerror = () => pet.classList.remove('is-speaking');
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (canSpeak) window.speechSynthesis.cancel();
    pet.classList.remove('is-speaking');
  };

  const showAnswer = (question, reply) => {
    answer.replaceChildren();
    if (question) {
      const asked = document.createElement('p');
      asked.className = 'pet-panel__question';
      asked.textContent = `你问：${question}`;
      answer.appendChild(asked);
    }
    const replyNode = document.createElement('p');
    replyNode.className = 'pet-panel__text';
    replyNode.textContent = reply;
    answer.appendChild(replyNode);
  };

  const ask = (query) => {
    const raw = String(query || '').trim();
    if (!raw) return;
    const normalized = normalize(raw);
    let best = null;
    let bestScore = 0;
    faq.forEach((item) => {
      const score = item.keys.reduce(
        (total, key) => total + (normalized.includes(normalize(key)) ? 1 : 0),
        0
      );
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });
    const reply = best ? best.a : fallback;
    showAnswer(raw, reply);
    speak(reply);
    input.value = '';
  };

  chips.forEach((label) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.textContent = label;
    chip.addEventListener('click', () => ask(label));
    chipsWrap.appendChild(chip);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });

  const paintVoice = () => {
    voiceBtn.textContent = voiceOn ? '声音 开' : '声音 关';
    voiceBtn.setAttribute('aria-pressed', String(voiceOn));
  };

  if (!canSpeak) {
    voiceBtn.hidden = true;
    note.textContent = '当前浏览器不支持语音；可以先看文字回答。';
  } else {
    paintVoice();
  }

  voiceBtn.addEventListener('click', () => {
    voiceOn = !voiceOn;
    try {
      localStorage.setItem('ldq-pet-voice', voiceOn ? '1' : '0');
    } catch (error) {
      // Preference persistence is optional.
    }
    paintVoice();
    if (!voiceOn) {
      stopSpeech();
    } else {
      speak('声音已打开。');
    }
  });

  const hideBubble = () => {
    window.clearTimeout(hideTimer);
    pet.classList.remove('is-talking');
    bubble.setAttribute('aria-hidden', 'true');
  };

  const setBubble = (message, duration = 4200) => {
    window.clearTimeout(hideTimer);
    bubbleText.textContent = message;
    pet.classList.add('is-talking');
    bubble.setAttribute('aria-hidden', 'false');
    if (window.innerWidth > 900) {
      hideTimer = window.setTimeout(hideBubble, duration);
    }
  };

  const openPanel = () => {
    pet.classList.add('is-chatting');
    panel.setAttribute('aria-hidden', 'false');
    hideBubble();
    panel.focus({ preventScroll: true });
    if (!greeted) {
      greeted = true;
      speak(greeting);
    }
  };

  const closePanel = () => {
    pet.classList.remove('is-chatting');
    panel.setAttribute('aria-hidden', 'true');
    stopSpeech();
  };

  const togglePanel = () => {
    if (pet.classList.contains('is-chatting')) {
      closePanel();
    } else {
      openPanel();
    }
  };

  button.addEventListener('click', () => {
    if (suppressClick) {
      suppressClick = false;
      return;
    }
    togglePanel();
  });

  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && pet.classList.contains('is-chatting')) {
      closePanel();
      button.focus();
    }
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

  window.addEventListener('pointermove', (event) => {
    const rect = button.getBoundingClientRect();
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
    window.setTimeout(() => {
      if (!pet.classList.contains('is-chatting')) {
        setBubble('点我，问我点什么。', 4200);
      }
    }, 1800);
  }
})();
