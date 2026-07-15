/* ═══════════════ BOOT SEQUENCE ═══════════════ */
(function () {
  const bootScreen = document.getElementById('boot-screen');
  const bootLog = document.getElementById('bootLog');
  const bootBar = document.getElementById('bootBar');
  const bootPct = document.getElementById('bootPct');
  const bootSkip = document.getElementById('bootSkip');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadyBooted = sessionStorage.getItem('raze_booted') === '1';

  function finishBoot() {
    document.body.classList.remove('boot-lock');
    bootScreen.classList.add('boot-hidden');
    sessionStorage.setItem('raze_booted', '1');
  }

  if (alreadyBooted || reducedMotion) {
    finishBoot();
    return;
  }

  const lines = [
    'INITIALIZING RAZE CORE...',
    'LOADING MODERATION MATRIX... [OK]',
    'SYNCING ANTINUKE PROTOCOLS... [OK]',
    'CONNECTING TO DISCORD GATEWAY... [OK]',
    'SYSTEM READY.'
  ];

  lines.forEach((text) => {
    const div = document.createElement('div');
    div.className = 'boot-line';
    div.textContent = text;
    bootLog.appendChild(div);
  });
  const lineEls = bootLog.querySelectorAll('.boot-line');

  let pct = 0;
  let lineIdx = 0;
  const totalDuration = 1900;
  const stepMs = 30;
  const increment = 100 / (totalDuration / stepMs);

  const timer = setInterval(() => {
    pct = Math.min(100, pct + increment);
    bootBar.style.width = pct + '%';
    bootPct.textContent = Math.floor(pct) + '%';

    const shouldShowLine = Math.floor((pct / 100) * lines.length);
    while (lineIdx < shouldShowLine && lineIdx < lineEls.length) {
      lineEls[lineIdx].classList.add('shown');
      lineIdx++;
    }

    if (pct >= 100) {
      clearInterval(timer);
      lineEls.forEach(el => el.classList.add('shown'));
      setTimeout(finishBoot, 450);
    }
  }, stepMs);

  bootSkip.addEventListener('click', () => {
    clearInterval(timer);
    finishBoot();
  });
})();

/* ═══════════════ Particle Canvas ═══════════════ */
(function() {
  const canvas = document.getElementById('particles-bg');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rand(a, b) { return a + Math.random() * (b - a); }

  function createParticle() {
    const colors = ['rgba(255,34,68,', 'rgba(41,121,255,', 'rgba(139,68,255,'];
    return {
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1, 2.5),
      color: colors[Math.floor(rand(0, colors.length))],
      alpha: rand(0.2, 0.7),
    };
  }

  for (let i = 0; i < 90; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'rgba(41,121,255,' + (0.12 * (1 - dist / 110)) + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════ Header hide on scroll ═══════════════ */
let lastScroll = 0;
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScroll = current;
  document.getElementById('scrollTop').classList.toggle('visible', current > 500);
});

/* ═══════════════ Mobile nav ═══════════════ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open');
});
function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
}

/* ═══════════════ Reveal on scroll (staggered) ═══════════════ */
document.querySelectorAll('.features-grid, .stats-grid, .steps-grid, .partner-cards-grid').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.setProperty('--reveal-i', i % 6);
  });
});
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

/* ═══════════════ Counter animation ═══════════════ */
const counters = document.querySelectorAll('.stat-number[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const duration = 1800;
      const step = 16;
      const increment = target / (duration / step);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ═══════════════ Touch/click ripple ═══════════════ */
document.querySelectorAll('.ripple-host, .btn, .submit-btn, .partner-card-join, .scroll-top, .nav-cta').forEach(el => {
  el.classList.add('ripple-host');
  el.addEventListener('pointerdown', function (e) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(span);
    setTimeout(() => span.remove(), 650);
  });
});

/* ═══════════════ Card tilt (pointer-fine only) ═══════════════ */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const maxTilt = parseFloat(card.dataset.tiltMax) || 6;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${(-py * maxTilt * 2).toFixed(2)}deg) rotateY(${(px * maxTilt * 2).toFixed(2)}deg)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  /* ═══════════════ Magnetic buttons ═══════════════ */
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('pointermove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) * 0.18;
      const dy = (e.clientY - rect.top - rect.height / 2) * 0.35;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = '';
    });
  });

  /* ═══════════════ Cursor glow ═══════════════ */
  const cursorGlow = document.getElementById('cursor-glow');
  window.addEventListener('pointermove', (e) => {
    cursorGlow.classList.add('active');
    cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
  document.addEventListener('pointerleave', () => cursorGlow.classList.remove('active'));
}


/* ═══════════════ Module Explorer (tab switching) ═══════════════ */
const moduleTabs = document.querySelectorAll('.module-tab');
const modulePanels = document.querySelectorAll('.module-panel');
moduleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.module;
    moduleTabs.forEach(t => t.classList.remove('active'));
    modulePanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.module-panel[data-panel="${target}"]`);
    if (panel) panel.classList.add('active');
  });
});

/* ═══════════════ FAQ Accordion ═══════════════ */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ═══════════════ Extra touch/tap ripple targets ═══════════════ */
document.querySelectorAll('.module-tab, .support-card, .faq-q').forEach(el => {
  el.classList.add('ripple-host');
  el.addEventListener('pointerdown', function (e) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (e.clientX - rect.left - size / 2) + 'px';
    span.style.top = (e.clientY - rect.top - size / 2) + 'px';
    el.appendChild(span);
    setTimeout(() => span.remove(), 650);
  });
});
