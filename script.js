/* ===========================
   CRYPTO-NET — SCRIPT.JS
   =========================== */
// ─── LOADER ────────────────────────────────────────────────────────────────
const loaderFill = document.getElementById('loaderFill');
const loaderStatus = document.getElementById('loaderStatus');
const loader = document.getElementById('loader');

const loadSteps = [
  'Initializing security protocols...',
  'Loading encryption modules...',
  'Calibrating IoT sensors...',
  'Establishing secure connection...',
  'Access granted.',
];

let step = 0;
function advanceLoader() {
  if (step >= loadSteps.length) {
    setTimeout(() => loader.classList.add('hide'), 400);
    return;
  }
  const pct = Math.round((step / (loadSteps.length - 1)) * 100);
  loaderFill.style.width = pct + '%';
  loaderStatus.textContent = loadSteps[step];
  step++;
  setTimeout(advanceLoader, 380);
}
advanceLoader();

// ─── CUSTOM CURSOR ──────────────────────────────────────────────────────────
const cursorOuter = document.getElementById('cursorOuter');
const cursorDot   = document.getElementById('cursorDot');
let mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px'; cursorDot.style.top = my + 'px';
});

(function tickCursor() {
  ox += (mx - ox) * 0.12; oy += (my - oy) * 0.12;
  cursorOuter.style.left = ox + 'px'; cursorOuter.style.top = oy + 'px';
  requestAnimationFrame(tickCursor);
})();

document.querySelectorAll('a, button, .team-card, .event-card, .proj-card, .ach-card, .bitem').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorOuter.style.transform = 'translate(-50%,-50%) scale(1.6)';
    cursorOuter.style.borderColor = 'var(--green)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOuter.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorOuter.style.borderColor = 'var(--cyan)';
  });
});

// ─── NAVBAR ─────────────────────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});

document.querySelectorAll('.nl').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// ─── NETWORK CANVAS (HERO) ──────────────────────────────────────────────────
(function initNetwork() {
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const NODES = 70;
  const MAX_DIST = 160;
  const nodes = Array.from({ length: NODES }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.4;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      n.pulse += 0.03;
      const glow = (Math.sin(n.pulse) + 1) / 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${0.5 + glow * 0.5})`;
      ctx.fill();

      // Move
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── TYPING EFFECT ───────────────────────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typeTarget');
  const phrases = [
    'Securing IoT Devices...',
    'Analyzing Network Threats...',
    'Building Ethical Hackers...',
    'Encrypting Data Streams...',
    'Reverse Engineering Firmware...',
    'Running CTF Challenges...',
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  setTimeout(tick, 1200);
})();

// ─── COUNTDOWN ───────────────────────────────────────────────────────────────
(function initCountdown() {
  // Set inauguration to tomorrow at 10 AM
  const now = new Date();
  const target = new Date(now);
  target.setDate(target.getDate() + 1);
  target.setHours(10, 0, 0, 0);

  const h = document.getElementById('cd-h');
  const m = document.getElementById('cd-m');
  const s = document.getElementById('cd-s');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      h.textContent = '00'; m.textContent = '00'; s.textContent = '00'; return;
    }
    const hrs  = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    h.textContent = pad(hrs);
    m.textContent = pad(mins);
    s.textContent = pad(secs);
  }
  tick();
  setInterval(tick, 1000);
})();

// ─── COUNTER ANIMATION ───────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  }
  requestAnimationFrame(frame);
}

// ─── THREAT CANVAS ───────────────────────────────────────────────────────────
(function initThreat() {
  const canvas = document.getElementById('threatCanvas');
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 220;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = { attack: '#ff3a5c', scan: '#ffd700', secure: '#00ff88' };
  const types  = ['attack', 'attack', 'scan', 'scan', 'secure', 'secure', 'secure'];

  // Nodes: circles on the canvas
  const nodes = [
    { x: 0.5, y: 0.5, label: 'Core', type: 'secure' },
    ...Array.from({ length: 10 }, (_, i) => ({
      x: 0.1 + Math.random() * 0.8,
      y: 0.1 + Math.random() * 0.8,
      label: 'Node ' + (i + 1),
      type: types[Math.floor(Math.random() * types.length)],
    })),
  ];

  const packets = [];

  function spawnPacket() {
    const src = Math.floor(Math.random() * nodes.length);
    let dst = Math.floor(Math.random() * nodes.length);
    while (dst === src) dst = Math.floor(Math.random() * nodes.length);
    const type = nodes[src].type;
    packets.push({
      sx: nodes[src].x, sy: nodes[src].y,
      ex: nodes[dst].x, ey: nodes[dst].y,
      t: 0, speed: 0.005 + Math.random() * 0.008,
      type, trail: [],
    });
  }

  let frame = 0;
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = 'rgba(13,20,32,0.4)';
    ctx.fillRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = (nodes[i].x - nodes[j].x) * W;
        const dy = (nodes[i].y - nodes[j].y) * H;
        if (Math.sqrt(dx * dx + dy * dy) < 200) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(26,45,69,0.8)';
          ctx.lineWidth = 0.8;
          ctx.moveTo(nodes[i].x * W, nodes[i].y * H);
          ctx.lineTo(nodes[j].x * W, nodes[j].y * H);
          ctx.stroke();
        }
      }
    }

    // Packets
    packets.forEach((p, idx) => {
      p.t += p.speed;
      const px = (p.sx + (p.ex - p.sx) * p.t) * W;
      const py = (p.sy + (p.ey - p.sy) * p.t) * H;
      p.trail.push({ x: px, y: py });
      if (p.trail.length > 10) p.trail.shift();

      // Trail
      p.trail.forEach((pt, ti) => {
        const alpha = (ti / p.trail.length) * 0.5;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = COLORS[p.type].replace(')', `,${alpha})`).replace('rgb', 'rgba');
        if (COLORS[p.type].startsWith('#')) {
          ctx.fillStyle = hexToRgba(COLORS[p.type], alpha);
        }
        ctx.fill();
      });

      // Packet dot
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[p.type];
      ctx.fill();
      ctx.shadowColor = COLORS[p.type];
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (p.t >= 1) packets.splice(idx, 1);
    });

    // Nodes
    nodes.forEach(n => {
      const nx = n.x * W, ny = n.y * H;
      ctx.beginPath();
      ctx.arc(nx, ny, n.label === 'Core' ? 10 : 6, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[n.type];
      ctx.shadowColor = COLORS[n.type];
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Ring
      ctx.beginPath();
      ctx.arc(nx, ny, n.label === 'Core' ? 16 : 10, 0, Math.PI * 2);
      ctx.strokeStyle = COLORS[n.type];
      ctx.globalAlpha = 0.25;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.globalAlpha = 1;
    });

    // Spawn packets periodically
    if (frame % 30 === 0 && packets.length < 12) spawnPacket();
    frame++;
    requestAnimationFrame(draw);
  }

  // Occasionally flip a node type to simulate attack/defense
  setInterval(() => {
    const n = nodes[Math.floor(Math.random() * nodes.length)];
    if (n.label !== 'Core') {
      n.type = types[Math.floor(Math.random() * types.length)];
    }
  }, 2000);

  draw();

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
})();

// ─── SCROLL REVEAL + COUNTERS ─────────────────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Counter
      const counters = e.target.querySelectorAll('.stat-num[data-target]');
      counters.forEach(c => animateCounter(c));
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.mv-card, .team-card, .event-card, .proj-card, .ach-card, .tl-item, .bitem, .cat-item, .hero-stats').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// ─── FORM SUBMIT ─────────────────────────────────────────────────────────────
const joinForm = document.getElementById('joinForm');
const toast = document.getElementById('toast');

joinForm.addEventListener('submit', function (e) {
  e.preventDefault();
  toast.textContent = '✓ Application received! We\'ll be in touch soon.';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3800);
  this.reset();
});

// ─── ACTIVE NAV LINK ─────────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nl');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });