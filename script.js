const profile = {
  name: '刘东琦',
  title: 'AI 软件开发工程师',
  email: '2823641678@qq.com',
  note: 'AI 软件开发工程师 · 光学测量软件。在镜片与代码之间，做测量光的软件。',
};

const saveButton = document.querySelector('[data-save-card]');
let saveTimer;

if (saveButton) {
  saveButton.addEventListener('click', () => {
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

      const label = saveButton.querySelector('.action-label');
      if (label) {
        const original = label.textContent;
        label.textContent = '已保存';
        saveButton.classList.add('is-done');

        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => {
          label.textContent = original;
          saveButton.classList.remove('is-done');
        }, 2200);
      }
    } catch (error) {
      const label = saveButton.querySelector('.action-label');
      if (label) label.textContent = '请手动保存';
    }
  });
}

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

    const original = '复制';
    copyLabel.textContent = copied ? '已复制' : '复制失败';
    copyButton.classList.toggle('is-copied', copied);
    copyButton.setAttribute('aria-label', copied ? '邮箱已复制' : '复制邮箱');

    window.clearTimeout(copyTimer);
    copyTimer = window.setTimeout(() => {
      copyLabel.textContent = original;
      copyButton.classList.remove('is-copied');
      copyButton.setAttribute('aria-label', '复制邮箱');
    }, 2200);
  });
}
