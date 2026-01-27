(function () {
  document.addEventListener('DOMContentLoaded', () => {
    setupCapsLockHint();
    setupEasterEgg();

    if (document.body.classList.contains('dashboard')) {
      initDashboard();
      initMatrixRain();
    }
  });

  function setupCapsLockHint() {
    const password = document.getElementById('password');
    const hint = document.getElementById('caps-hint');
    if (!password || !hint) return;

    const toggleHint = (event) => {
      const capsOn = event.getModifierState && event.getModifierState('CapsLock');
      hint.style.opacity = capsOn ? '1' : '0';
    };

    password.addEventListener('keydown', toggleHint);
    password.addEventListener('keyup', toggleHint);
    password.addEventListener('blur', () => (hint.style.opacity = '0'));
  }

  function setupEasterEgg() {
    const grid = document.querySelector('.bg-grid');
    if (!grid) return;

    let toggled = false;
    grid.addEventListener('dblclick', () => {
      toggled = !toggled;
      grid.style.filter = toggled ? 'hue-rotate(35deg) saturate(1.4)' : 'none';
    });
  }

  function initDashboard() {
    const params = new URLSearchParams(window.location.search);
    const user = (params.get('user') || 'mystery guest').trim() || 'mystery guest';
    const pass = params.get('pass') || '***';

    setText('user-label', user);
    setText('echo-user', user);
    setText('echo-pass', pass);
    setText('inline-pass', pass);

    const countEl = document.getElementById('creds-count');
    if (countEl) {
      const base = parseInt(countEl.textContent || '7', 10) || 7;
      countEl.textContent = String(base + 1);
    }

    const panicBtn = document.getElementById('panic-btn');
    if (panicBtn) {
      panicBtn.addEventListener('click', () => {
        panicBtn.textContent = 'Too late, embrace the chaos';
        panicBtn.classList.add('wiggle');
        setTimeout(() => panicBtn.classList.remove('wiggle'), 1500);
      });
    }
  }

  function initMatrixRain() {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const fontSize = 16;
    const characters = '0123456789ABCDEF▢◻◼';
    const palette = ['#6dd6ff', '#ff9ecd', '#7c8cff', '#c1ffd7'];
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];

    const setSize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(13, 18, 32, 0.4)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px ${'Space Mono'}, monospace`;

      drops.forEach((y, i) => {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        const x = i * fontSize;
        ctx.fillStyle = palette[Math.floor(Math.random() * palette.length)];
        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 1;
      });
    };

    setSize();
    window.addEventListener('resize', setSize);
    setInterval(draw, 60);
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }
})();
