/* ===========================
   CRYPTO-NET — SCRIPT.JS
   =========================== */

// ─── GOOGLE SHEETS CONFIG ────────────────────────────────────────────────────
//
//  SETUP INSTRUCTIONS (one-time, ~5 minutes):
//
//  STEP 1 — Create the Google Sheet:
//    • Go to https://sheets.google.com → New spreadsheet
//    • Rename it "Crypto-Net Members"
//    • In Row 1 add these exact headers:
//      Timestamp | Full Name | Email | Student ID | Interest | Experience | Why Join
//
//  STEP 2 — Add the Apps Script:
//    • In the sheet: Extensions → Apps Script
//    • Delete any existing code, paste this:
//
//      function doPost(e) {
//        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
//        var data  = JSON.parse(e.postData.contents);
//        sheet.appendRow([
//          new Date().toLocaleString(),
//          data.name, data.email, data.studentId,
//          data.interest, data.experience, data.why
//        ]);
//        return ContentService
//          .createTextOutput(JSON.stringify({ result: 'success' }))
//          .setMimeType(ContentService.MimeType.JSON);
//      }
//
//  STEP 3 — Deploy:
//    • Click Deploy → New Deployment → Web App
//    • Execute as: Me
//    • Who has access: Anyone
//    • Click Deploy → Copy the URL
//
//  STEP 4 — Paste your URL below:

const SHEETS_URL = process.env.sheets_url;
// e.g. 'https://script.google.com/macros/s/AKfycbxXXXXXXXXXX/exec'

// ─── LOADER ──────────────────────────────────────────────────────────────────
const loaderFill   = document.getElementById('loaderFill');
const loaderStatus = document.getElementById('loaderStatus');
const loader       = document.getElementById('loader');

const loadSteps = [
  { msg: 'Booting kernel modules...',         pct: 0   },
  { msg: 'Loading cryptographic libraries...', pct: 25  },
  { msg: 'Calibrating IoT sensor mesh...',     pct: 50  },
  { msg: 'Establishing TLS 1.3 tunnel...',     pct: 75  },
  { msg: 'Scanning for threats...',            pct: 90  },
  { msg: 'Access granted. Welcome.',           pct: 100 },
];

let step = 0;
function advanceLoader() {
  if (step >= loadSteps.length) {
    setTimeout(() => loader.classList.add('hide'), 500);
    return;
  }
  const { msg, pct } = loadSteps[step];
  loaderFill.style.width = pct + '%';
  loaderStatus.textContent = msg;
  step++;
  setTimeout(advanceLoader, step === loadSteps.length ? 600 : 380);
}
advanceLoader();

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
const cursorOuter = document.getElementById('cursorOuter');
const cursorDot   = document.getElementById('cursorDot');
let mx = 0, my = 0, ox = 0, oy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorDot.style.left = mx + 'px';
  cursorDot.style.top  = my + 'px';
});
(function tickCursor() {
  ox += (mx - ox) * 0.12;
  oy += (my - oy) * 0.12;
  cursorOuter.style.left = ox + 'px';
  cursorOuter.style.top  = oy + 'px';
  requestAnimationFrame(tickCursor);
})();

document.querySelectorAll('a, button, .team-card, .event-card, .proj-card, .ach-card, .bitem').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorOuter.style.transform  = 'translate(-50%,-50%) scale(1.6)';
    cursorOuter.style.borderColor = 'var(--green)';
  });
  el.addEventListener('mouseleave', () => {
    cursorOuter.style.transform  = 'translate(-50%,-50%) scale(1)';
    cursorOuter.style.borderColor = 'var(--cyan)';
  });
});

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

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

// ─── HERO NETWORK CANVAS ──────────────────────────────────────────────────────
(function initNetwork() {
  const canvas = document.getElementById('networkCanvas');
  const ctx    = canvas.getContext('2d');

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r:  Math.random() * 2 + 1,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,229,255,${(1 - dist / 160) * 0.35})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      n.pulse += 0.03;
      const glow = (Math.sin(n.pulse) + 1) / 2;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r + glow * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,136,${0.5 + glow * 0.5})`;
      ctx.fill();
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// ─── TYPING EFFECT ────────────────────────────────────────────────────────────
(function initTyping() {
  const el = document.getElementById('typeTarget');
  const phrases = [
    'Securing IoT Devices...', 'Analyzing Network Threats...',
    'Building Ethical Hackers...', 'Encrypting Data Streams...',
    'Reverse Engineering Firmware...', 'Running CTF Challenges...',
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

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
(function initCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 1);
  target.setHours(10, 0, 0, 0);

  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');
  const pad  = n => String(n).padStart(2, '0');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { hEl.textContent = mEl.textContent = sEl.textContent = '00'; return; }
    hEl.textContent = pad(Math.floor(diff / 3600000));
    mEl.textContent = pad(Math.floor((diff % 3600000) / 60000));
    sEl.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tick();
  setInterval(tick, 1000);
})();

// ─── COUNTER ANIMATION ────────────────────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const start  = performance.now();
  (function frame(now) {
    const t    = Math.min((now - start) / 2000, 1);
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    el.textContent = Math.floor(ease * target);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target;
  })(start);
}

// ─── DETAILED THREAT SIMULATION ───────────────────────────────────────────────
(function initThreat() {
  const canvas = document.getElementById('threatCanvas');
  const ctx    = canvas.getContext('2d');

  // ── Inject richer header with live counters
  document.querySelector('.tw-header').innerHTML = `
    <span class="pulse-dot"></span>
    <span style="letter-spacing:.12em">LIVE NETWORK THREAT MAP</span>
    <span class="tw-badge">SIMULATION</span>
    <div class="tw-counters">
      <span class="twc red"><i class="fas fa-skull-crossbones"></i>&nbsp;Attacks:&nbsp;<b id="cntAttack">0</b></span>
      <span class="twc yellow"><i class="fas fa-eye"></i>&nbsp;Active:&nbsp;<b id="cntActive">0</b></span>
      <span class="twc green"><i class="fas fa-shield-halved"></i>&nbsp;Blocked:&nbsp;<b id="cntBlocked">0</b></span>
    </div>`;

  // ── Inject styles for counters + log
  const s = document.createElement('style');
  s.textContent = `
    .tw-header { flex-wrap:wrap; gap:8px; }
    .tw-counters { display:flex; gap:14px; margin-left:auto; align-items:center; }
    .twc { font-family:var(--font-mono); font-size:.68rem; display:flex; align-items:center; gap:4px; }
    .twc.red { color:#ff3a5c; } .twc.yellow { color:#ffd700; } .twc.green { color:#00ff88; }
    .twc b { font-weight:700; }
    .tw-log { background:rgba(8,13,20,0.95); border-top:1px solid var(--border);
      padding:10px 16px; height:90px; overflow-y:auto; font-family:var(--font-mono);
      font-size:.67rem; color:var(--muted); }
    .log-line { margin-bottom:3px; animation:logIn .3s ease; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .log-line.atk { color:#ff3a5c; } .log-line.scn { color:#ffd700; } .log-line.ok { color:#00ff88; }
    @keyframes logIn { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
  `;
  document.head.appendChild(s);

  // ── Inject event log div below canvas
  const logDiv = document.createElement('div');
  logDiv.className = 'tw-log';
  logDiv.id = 'threatLog';
  canvas.insertAdjacentElement('afterend', logDiv);

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight || 260;
  }
  resize();
  window.addEventListener('resize', resize);

  // ── Named topology nodes
  const NODE_DEFS = [
    { id:'core',    label:'CORE SERVER',  x:.50, y:.50, isCore:true,     isExternal:false },
    { id:'fw',      label:'FIREWALL',     x:.50, y:.18, isCore:false,    isExternal:false },
    { id:'iot1',    label:'IoT HUB',      x:.22, y:.38, isCore:false,    isExternal:false },
    { id:'iot2',    label:'SENSOR NET',   x:.78, y:.38, isCore:false,    isExternal:false },
    { id:'db',      label:'DATABASE',     x:.30, y:.76, isCore:false,    isExternal:false },
    { id:'api',     label:'API GATEWAY',  x:.70, y:.76, isCore:false,    isExternal:false },
    { id:'cl1',     label:'CLIENT A',     x:.12, y:.60, isCore:false,    isExternal:false },
    { id:'cl2',     label:'CLIENT B',     x:.88, y:.60, isCore:false,    isExternal:false },
    { id:'ext1',    label:'ATTACKER 1',   x:.15, y:.10, isCore:false,    isExternal:true  },
    { id:'ext2',    label:'ATTACKER 2',   x:.85, y:.10, isCore:false,    isExternal:true  },
  ];

  const nodes = NODE_DEFS.map(d => ({
    ...d, type: d.isExternal ? 'attack' : 'secure',
    pulseT: Math.random() * Math.PI * 2, alertT: 0,
  }));

  const EDGES = [
    ['fw','core'],['fw','iot1'],['fw','iot2'],['fw','ext1'],['fw','ext2'],
    ['core','db'],['core','api'],['core','iot1'],['core','iot2'],
    ['iot1','cl1'],['iot2','cl2'],['api','db'],
  ];

  const COLORS = { attack:'#ff3a5c', scan:'#ffd700', secure:'#00ff88' };
  const packets = [];

  const ATTACK_TYPES = [
    'SYN Flood','MITM Attempt','Port Scan','Brute Force SSH',
    'MQTT Exploit','ARP Spoofing','DNS Poisoning','Zero-Day Probe',
    'Firmware Injection','SQL Injection','XSS Payload','DDoS Wave',
    'CoAP Amplification','ICMP Flood','SSL Strip',
  ];
  const BLOCK_MSGS = [
    'Firewall rule matched','IDS signature triggered',
    'Rate limit applied','Packet dropped','IP blacklisted',
    'Geo-block enforced','DPI inspection blocked',
  ];

  let totalAttacks = 0, blocked = 0, active = 0;
  const logLines = [];

  function getNode(id) { return nodes.find(n => n.id === id); }

  function addLog(cls, msg) {
    const log = document.getElementById('threatLog');
    if (!log) return;
    const t = new Date().toLocaleTimeString('en-US', { hour12: false });
    const icons = { atk: '⚠', scn: '⟳', ok: '✓' };
    const line  = document.createElement('div');
    line.className = `log-line ${cls}`;
    line.textContent = `[${t}] ${icons[cls] || ''} ${msg}`;
    log.prepend(line);
    logLines.push(line);
    if (logLines.length > 40) { logLines.shift().remove(); }
  }

  function spawnPacket(srcId, dstId, type) {
    const src = getNode(srcId), dst = getNode(dstId);
    if (!src || !dst) return;
    packets.push({
      sx: src.x, sy: src.y, ex: dst.x, ey: dst.y,
      t: 0, speed: 0.006 + Math.random() * 0.007,
      type, trail: [],
    });
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // ── Attack trigger
  function triggerAttack() {
    const extId  = Math.random() < 0.5 ? 'ext1' : 'ext2';
    const targets = ['fw','iot1','iot2','core','db','api'];
    const tgtId  = targets[Math.floor(Math.random() * targets.length)];
    const tgt    = getNode(tgtId);
    const atkName = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
    const isBlocked = Math.random() > 0.32;

    spawnPacket(extId, tgtId, 'attack');
    totalAttacks++;
    active++;
    if (tgt) tgt.alertT = 70;

    document.getElementById('cntAttack').textContent = totalAttacks;
    document.getElementById('cntActive').textContent = active;
    addLog('atk', `${atkName} detected → ${tgt ? tgt.label : tgtId}`);

    setTimeout(() => {
      active = Math.max(0, active - 1);
      document.getElementById('cntActive').textContent = active;

      if (isBlocked) {
        blocked++;
        document.getElementById('cntBlocked').textContent = blocked;
        const bmsg = BLOCK_MSGS[Math.floor(Math.random() * BLOCK_MSGS.length)];
        addLog('ok', `Blocked [${bmsg}] on ${tgt ? tgt.label : tgtId}`);
      } else {
        if (tgt && !tgt.isCore) tgt.type = 'attack';
        addLog('scn', `Breach on ${tgt ? tgt.label : tgtId} — isolating`);
        setTimeout(() => {
          if (tgt) { tgt.type = 'secure'; }
          spawnPacket('core', tgtId, 'secure'); // recovery packet
          addLog('ok', `${tgt ? tgt.label : tgtId} patched & restored`);
        }, 4000 + Math.random() * 3000);
      }
    }, 1800 + Math.random() * 600);
  }

  // ── Scan sweep trigger
  function triggerScan() {
    const extId = Math.random() < 0.5 ? 'ext1' : 'ext2';
    const hops  = ['fw', 'iot1', 'api', 'db'];
    hops.forEach((h, i) => {
      setTimeout(() => spawnPacket(i === 0 ? extId : hops[i - 1], h, 'scan'), i * 420);
    });
    addLog('scn', `Sweep scan from ${getNode(extId).label} — ${hops.length} hops`);
  }

  // ── Normal traffic
  function triggerNormal() {
    const pairs = [
      ['cl1','iot1'],['cl2','iot2'],['api','db'],
      ['fw','core'],['core','api'],['iot1','core'],['iot2','core'],
    ];
    const [s, d] = pairs[Math.floor(Math.random() * pairs.length)];
    spawnPacket(s, d, 'secure');
  }

  setInterval(triggerAttack, 2000 + Math.random() * 1500);
  setInterval(triggerScan,   7000 + Math.random() * 4000);
  setInterval(triggerNormal, 750);

  // ── Draw loop
  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = 'rgba(8,13,20,0.3)';
    ctx.fillRect(0, 0, W, H);

    // Edges
    EDGES.forEach(([a, b]) => {
      const na = getNode(a), nb = getNode(b);
      if (!na || !nb) return;
      const hot = na.type === 'attack' || nb.type === 'attack';
      ctx.beginPath();
      ctx.moveTo(na.x * W, na.y * H);
      ctx.lineTo(nb.x * W, nb.y * H);
      ctx.strokeStyle = hot ? 'rgba(255,58,92,0.22)' : 'rgba(26,45,69,0.85)';
      ctx.lineWidth   = hot ? 1.2 : 0.8;
      ctx.stroke();
    });

    // Packets
    for (let i = packets.length - 1; i >= 0; i--) {
      const p = packets[i];
      p.t += p.speed;
      const px = (p.sx + (p.ex - p.sx) * p.t) * W;
      const py = (p.sy + (p.ey - p.sy) * p.t) * H;
      p.trail.push({ x: px, y: py });
      if (p.trail.length > 14) p.trail.shift();

      p.trail.forEach((pt, ti) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = hexToRgba(COLORS[p.type], (ti / p.trail.length) * 0.55);
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(px, py, p.type === 'attack' ? 5 : 3.5, 0, Math.PI * 2);
      ctx.fillStyle  = COLORS[p.type];
      ctx.shadowColor = COLORS[p.type];
      ctx.shadowBlur  = p.type === 'attack' ? 16 : 8;
      ctx.fill();
      ctx.shadowBlur  = 0;

      if (p.t >= 1) packets.splice(i, 1);
    }

    // Nodes
    nodes.forEach(n => {
      n.pulseT += 0.04;
      const nx    = n.x * W, ny = n.y * H;
      const r     = n.isCore ? 12 : n.isExternal ? 8 : 7;
      const color = COLORS[n.type];
      const pulse = (Math.sin(n.pulseT) + 1) / 2;

      // Alert ripple
      if (n.alertT > 0) {
        n.alertT--;
        const rr = r + 10 + (1 - n.alertT / 70) * 22;
        ctx.beginPath();
        ctx.arc(nx, ny, rr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255,58,92,${(n.alertT / 70) * 0.45})`;
        ctx.lineWidth   = 2;
        ctx.stroke();
      }

      // Outer pulse ring
      ctx.beginPath();
      ctx.arc(nx, ny, r + 5 + pulse * 4, 0, Math.PI * 2);
      ctx.strokeStyle = hexToRgba(color, 0.12 + pulse * 0.1);
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Node fill
      const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
      grad.addColorStop(0, hexToRgba(color, 0.95));
      grad.addColorStop(1, hexToRgba(color, 0.35));
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fillStyle   = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur  = n.isCore ? 22 : 10;
      ctx.fill();
      ctx.shadowBlur  = 0;

      // Label
      ctx.fillStyle  = 'rgba(232,244,255,0.7)';
      ctx.font       = `${n.isCore ? 'bold ' : ''}${n.isCore ? 9 : 7.5}px "Share Tech Mono", monospace`;
      ctx.textAlign  = 'center';
      ctx.fillText(n.label, nx, ny + r + 11);
    });

    requestAnimationFrame(draw);
  }
  draw();

  // Seed log
  addLog('ok', 'Network monitoring initialized — 10 nodes online');
  addLog('ok', 'Firewall rules loaded (247 active rules)');
  addLog('scn', 'External probe on port 22 — monitoring');
})();

// ─── SCROLL REVEAL + COUNTERS ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('.stat-num[data-target]').forEach(animateCounter);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.mv-card,.team-card,.event-card,.proj-card,.ach-card,.tl-item,.bitem,.cat-item,.hero-stats'
).forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

// ─── JOIN FORM → GOOGLE SHEETS ────────────────────────────────────────────────
const joinForm = document.getElementById('joinForm');
const toast    = document.getElementById('toast');

function showToast(msg, isError = false) {
  toast.textContent        = msg;
  toast.style.borderColor  = isError ? 'var(--red)' : 'var(--green)';
  toast.style.color        = isError ? 'var(--red)' : 'var(--green)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

joinForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const btn    = this.querySelector('.submit-btn');
  const inputs = [...this.querySelectorAll('input, select, textarea')];
  const [nameEl, emailEl, idEl, interestEl, expEl, whyEl] = inputs;

  const payload = {
    name:       nameEl.value.trim(),
    email:      emailEl.value.trim(),
    studentId:  idEl.value.trim(),
    interest:   interestEl.value,
    experience: expEl.value,
    why:        whyEl ? whyEl.value.trim() : '',
  };

  // Guard: URL not yet configured
  if (!SHEETS_URL || SHEETS_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
    showToast('⚠ Sheet URL not configured. See SETUP INSTRUCTIONS in script.js.', true);
    return;
  }

  // Loading state
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>&nbsp;Submitting...';
  btn.disabled  = true;
  inputs.forEach(i => i.disabled = true);

  try {
    // Google Apps Script requires no-cors (gives opaque response — no throw = success)
    await fetch(SHEETS_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    showToast('✓ Application submitted! We\'ll reach out soon.');
    this.reset();
  } catch (err) {
    showToast('✗ Submission failed. Please email us directly.', true);
    console.error('Form submission error:', err);
  } finally {
    btn.innerHTML = '<span>Execute Join Request</span><i class="fas fa-paper-plane"></i>';
    btn.disabled  = false;
    inputs.forEach(i => i.disabled = false);
  }
});

// ─── ACTIVE NAV LINK ──────────────────────────────────────────────────────────
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nl');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
  navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
}, { passive: true });