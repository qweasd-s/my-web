/* Desktop pet + offline voice Q&A, drawn from the portrait. */
(() => {
  const mount = document.querySelector('[data-pet-root]') || document.body;
  if (!mount) return;

  const project = document.body.dataset.project;
  const assetBase = project ? '../assets/' : 'assets/';
  const avatarSrc = `${assetBase}portrait-warm.jpg`;
  const artSrc = `${assetBase}pet-xiaoliu.svg`;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const faq = [
    {
      clip: 'intro',
      keys: ['你是谁', '介绍', '名字', '刘东琦', '小刘'],
      a: '我是刘东琦，AI 软件开发工程师，在光学镜片行业做测量软件。',
    },
    {
      clip: 'work',
      keys: ['做什么', '项目', '工作', '工具'],
      a: '我把 MTF、畸变和偏心测量做成工程师真的会用的软件，主要用 MATLAB、Python 和 Qt。',
    },
    {
      clip: 'mtf',
      keys: ['mtf', '调制传递', '线对'],
      a: 'MTF 工具批量读明场、暗场和检测图，自动找四方向线对，输出 MTF、质量状态和 Excel / MAT 报表。',
    },
    {
      clip: 'quality',
      keys: ['质量', 'nrmse', 'michelson', '校核'],
      a: 'MTF 结果会带质量状态。NRMSE 超限也保留数值但标出来，另做 Michelson 对比度校核。',
    },
    {
      clip: 'distortion',
      keys: ['畸变', 'o1', 'o2', '十字'],
      a: '畸变工具在十字靶图上定位 O1 / O2，用 ESF 和梯度双路边缘交叉校验，最后输出一阶残差图和质检报告。',
    },
    {
      clip: 'model',
      keys: ['一阶', '高阶', '模型'],
      a: '畸变先用一阶模型。高阶模型能把残差压小，但也可能把拍摄或装配的问题一起拟合掉。',
    },
    {
      clip: 'decentration',
      keys: ['偏心', '偏心仪', '圆拟合'],
      a: '偏心仪软件还是 MVP：相机追球心十字像，镜片转一圈后鲁棒拟合圆，再换算线偏心和角偏心。',
    },
    {
      clip: 'accuracy',
      keys: ['精度', 'um', 'µm', '微米', '公差'],
      a: '精度是 µm 级。具体公差要以标定和软件输出为准，网站上不写没有公开验证过的数值。',
    },
    {
      clip: 'progress',
      keys: ['现在', '最近', '在做什么', '进度'],
      a: '现在在补偏心仪 MVP 的标定和重复性。标定、温漂和标准件验证没走完，不会把它当成最终判定。',
    },
    {
      clip: 'stack',
      keys: ['技术', '栈', '会什么', 'matlab', 'python', 'qt', 'opencv'],
      a: '常用 MATLAB 做批量计算，Python + OpenCV + PySide6 做桌面测量软件，前端是原生 HTML、CSS 和 JS。',
    },
    {
      clip: 'contact',
      keys: ['联系', '邮箱', '邮件', '合作', '招聘'],
      a: '可以直接发邮件到 2823641678@qq.com。',
    },
    {
      clip: 'voice',
      keys: ['语音', '声音', '说话'],
      a: '这是为网站提前配好的中文合成语音，不是我的真人录音。你可以重听，也可以随时关掉声音。',
    },
    {
      clip: 'hello',
      keys: ['你好', 'hi', 'hello', '嗨'],
      a: '你好呀，很高兴见到你。想聊聊我做的项目，还是看看怎么联系我？',
    },
  ];

  const fallback = '这个问题我还没准备好回答。你可以先问问我的项目，或者发邮件到 2823641678@qq.com 和我聊聊。';
  const greeting = '你好呀，我是小刘。很高兴你来逛逛。想了解我的项目，或者想和我联系，都可以问我。';
  const voiceNote = '问题在本地匹配，不上传。本站使用预制合成语音，不是真人录音。';
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
          <span>小刘 · 语音分身</span>
        </div>
        <button class="pet-panel__voice" type="button" data-pet-voice aria-pressed="true">声音 开</button>
        <button class="pet-panel__close" type="button" data-pet-close aria-label="关闭问答">×</button>
      </header>
      <div class="pet-panel__answer" data-pet-answer aria-live="polite">
        <p class="pet-panel__text">${greeting}</p>
      </div>
      <button class="pet-panel__replay" type="button" data-pet-replay>重听回答</button>
      <audio preload="none"></audio>
      <div class="pet-panel__chips" data-pet-chips></div>
      <form class="pet-panel__form" data-pet-form>
        <label class="sr-only" for="pet-question">问一个简单问题</label>
        <input id="pet-question" name="q" type="text" autocomplete="off" placeholder="问一个简单问题…" data-pet-input>
        <button type="submit">发送</button>
      </form>
      <p class="pet-panel__note" data-pet-note>${voiceNote}</p>
    </section>
    <div class="pet__bubble" role="status" aria-live="polite" aria-hidden="true">
      <p class="pet__text"></p>
    </div>
    <button class="pet__character" type="button" aria-label="和刘东琦对话，可以拖动我">
      <span class="pet-character">
        <img src="${artSrc}" alt="" width="120" height="160">
        <span class="pet-character__bars" aria-hidden="true"><i></i><i></i><i></i></span>
      </span>
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
  const audio = pet.querySelector('audio');
  const replayBtn = pet.querySelector('[data-pet-replay]');
  const closeBtn = pet.querySelector('[data-pet-close]');
  const note = pet.querySelector('[data-pet-note]');
  const button = pet.querySelector('.pet__character');
  const bubble = pet.querySelector('.pet__bubble');
  const bubbleText = pet.querySelector('.pet__text');

  let voiceOn = true;
  try {
    voiceOn = localStorage.getItem('ldq-pet-voice') !== '0';
  } catch (error) {
    // Use the default.
  }

  let currentClip = 'welcome';
  let playbackId = 0;

  let greeted = false;
  let hideTimer = 0;
  let drag = null;
  let suppressClick = false;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const normalize = (value) => value.toLowerCase().replace(/[\s，。？！、,.!?：:；;]/g, '');

  const stopSpeech = () => {
    playbackId += 1;
    audio.pause();
    pet.classList.remove('is-speaking');
  };

  const speak = (clip) => {
    if (!voiceOn) return;
    stopSpeech();
    const id = playbackId;
    const src = `${assetBase}voice/${clip}.mp3`;
    if (audio.getAttribute('src') !== src || audio.error) {
      audio.src = src;
    } else {
      audio.currentTime = 0;
    }
    audio.play().then(() => {
      if (id !== playbackId) return;
      note.textContent = voiceNote;
      pet.classList.add('is-speaking');
    }).catch(() => {
      if (id !== playbackId) return;
      pet.classList.remove('is-speaking');
      note.textContent = '暂时播不出语音。你可以继续看文字，或点「重听回答」再试。';
    });
  };

  audio.addEventListener('ended', stopSpeech);
  audio.addEventListener('error', () => {
    pet.classList.remove('is-speaking');
    if (voiceOn) note.textContent = '暂时播不出语音。你可以继续看文字，或点「重听回答」再试。';
  });

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
    currentClip = best ? best.clip : 'fallback';
    showAnswer(raw, reply);
    speak(currentClip);
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
    replayBtn.disabled = !voiceOn;
  };

  paintVoice();
  replayBtn.addEventListener('click', () => speak(currentClip));

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
      speak(currentClip);
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
      speak('welcome');
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
    pet.style.setProperty('--pet-tilt', `${clamp(dx / 160, -2.2, 2.2)}deg`);
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
