const profile = {
  name: '刘东琦',
  title: 'AI 软件开发工程师',
  email: '2823641678@qq.com',
  note: 'AI 软件开发工程师 · 光学测量软件。在镜片与代码之间，做测量光的软件。',
};

/* vCard ------------------------------------------------------------------ */

document.querySelectorAll('[data-save-card]').forEach((button) => {
  let resetTimer;

  button.addEventListener('click', () => {
    try {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profile.name}`,
        `N:${profile.name};;;;`,
        `TITLE:${profile.title}`,
        `EMAIL;TYPE=INTERNET:${profile.email}`,
        `NOTE:${profile.note}`,
        'END:VCARD',
      ];

      const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profile.name}.vcf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);

      const label = button.querySelector('.action-label');
      if (label) {
        const original = label.textContent;
        label.textContent = '已保存';
        button.classList.add('is-done');

        window.clearTimeout(resetTimer);
        resetTimer = window.setTimeout(() => {
          label.textContent = original;
          button.classList.remove('is-done');
        }, 2200);
      }
    } catch (error) {
      const label = button.querySelector('.action-label');
      if (label) label.textContent = '请手动保存';
    }
  });
});

/* Copy email ------------------------------------------------------------- */

const copyButton = document.querySelector('#copy-email');

const copyText = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to the legacy path.
    }
  }

  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.top = '-1000px';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();

  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch (error) {
    copied = false;
  }
  field.remove();
  return copied;
};

if (copyButton) {
  const copyLabel = copyButton.querySelector('.copy-btn__label');
  let copyTimer;

  copyButton.addEventListener('click', async () => {
    const copied = await copyText(copyButton.dataset.email || profile.email);
    if (!copyLabel) return;

    copyLabel.textContent = copied ? '已复制' : '复制失败';
    copyButton.classList.toggle('is-copied', copied);
    copyButton.setAttribute('aria-label', copied ? '邮箱已复制' : '复制邮箱');

    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      copyLabel.textContent = '复制邮箱';
      copyButton.classList.remove('is-copied');
      copyButton.setAttribute('aria-label', '复制邮箱');
    }, 2200);
  });
}

/* Home measurement card -------------------------------------------------- */

const homePattern = document.querySelector('#home-lp');
const homeInput = document.querySelector('[data-home-period-input]');

if (homePattern && homeInput) {
  const homeRects = homePattern.querySelectorAll('rect');
  const homeValues = document.querySelectorAll('[data-home-mtf]');
  const homeFreqs = document.querySelectorAll('[data-home-freq]');
  const homePeriods = document.querySelectorAll('[data-home-period]');

  const renderHome = () => {
    const period = Number(homeInput.value) || 20;
    const frequency = 1000 / period;
    const periodPx = 4 + (period - 10) * 0.32;
    const mtf = 0.94 * Math.exp(-0.5 * Math.pow(frequency / 85, 2));

    homePattern.setAttribute('width', periodPx.toFixed(2));
    if (homeRects[0]) homeRects[0].setAttribute('width', periodPx.toFixed(2));
    if (homeRects[1]) homeRects[1].setAttribute('width', (periodPx / 2).toFixed(2));

    homeValues.forEach((node) => { node.textContent = mtf.toFixed(2); });
    homeFreqs.forEach((node) => {
      node.textContent = Number.isInteger(frequency) ? String(frequency) : frequency.toFixed(1);
    });
    homePeriods.forEach((node) => { node.textContent = String(period); });
  };

  homeInput.addEventListener('input', renderHome);
  renderHome();
}
