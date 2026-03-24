// ─────────────────────────────────────────────
// HungerBridge — Shared JavaScript (script.js)
// ─────────────────────────────────────────────

const FOOD_KEY  = 'hb_food_v3';
const NOTIF_KEY = 'hb_notifs_v2';

const SAMPLE_FOODS = [
  { id: 1,  title: 'Biryani & Curries',     quantity: '80 servings', location: 'Wedding Hall, Sangli',  category: 'Cooked Meals', status: 'available', expiry: Date.now() + 1.8*3600000, posted: Date.now() - 20*60000,  donor: 'Sai Celebrations',   priority: 'high',   lat: 16.87, lng: 74.57 },
  { id: 2,  title: 'Bread & Baked Goods',   quantity: '120 pieces',  location: 'Modern Bakery, Miraj',  category: 'Bakery',       status: 'available', expiry: Date.now() + 3.5*3600000, posted: Date.now() - 45*60000,  donor: 'Modern Bakery',      priority: 'medium', lat: 16.83, lng: 74.65 },
  { id: 3,  title: 'Fresh Vegetables Mix',  quantity: '30 kg',       location: 'Sangli Market',         category: 'Produce',      status: 'claimed',   expiry: Date.now() + 5*3600000,   posted: Date.now() - 90*60000,  donor: 'Patil Farms',        priority: 'low',    lat: 16.86, lng: 74.56 },
  { id: 4,  title: 'Corporate Lunch Surplus', quantity: '40 boxes',  location: 'IT Park, Sangli',       category: 'Packaged',     status: 'available', expiry: Date.now() + 2.2*3600000, posted: Date.now() - 15*60000,  donor: 'TechCorp Canteen',   priority: 'high',   lat: 16.88, lng: 74.58 },
  { id: 5,  title: 'Festival Sweets',       quantity: '15 kg',       location: 'Vishrambaug, Sangli',   category: 'Sweets',       status: 'delivered', expiry: Date.now() - 1*3600000,   posted: Date.now() - 5*3600000, donor: 'Desai Sweets',       priority: 'low',    lat: 16.85, lng: 74.57 },
  { id: 6,  title: 'Rice & Dal Prep',       quantity: '60 servings', location: 'Kupwad, Sangli',        category: 'Cooked Meals', status: 'claimed',   expiry: Date.now() + 0.8*3600000, posted: Date.now() - 60*60000,  donor: 'Community Kitchen',  priority: 'high',   lat: 16.82, lng: 74.55 },
];

const NGOS = [
  { name: 'Asha Sewa Trust',    location: 'Sangli', lat: 16.86, lng: 74.56 },
  { name: 'HelpNow Foundation', location: 'Miraj',  lat: 16.83, lng: 74.66 },
  { name: 'Shree Sai Shelter',  location: 'Kupwad', lat: 16.81, lng: 74.54 },
];

// ─── Storage helpers ───────────────────────────────────────────────
function getFoods() {
  const d = localStorage.getItem(FOOD_KEY);
  return d ? JSON.parse(d) : JSON.parse(JSON.stringify(SAMPLE_FOODS));
}
function saveFoods(f) { localStorage.setItem(FOOD_KEY, JSON.stringify(f)); }

function getNotifs() {
  const d = localStorage.getItem(NOTIF_KEY);
  return d ? JSON.parse(d) : [];
}
function saveNotifs(n) { localStorage.setItem(NOTIF_KEY, JSON.stringify(n)); }

// ─── Notifications ─────────────────────────────────────────────────
let newNotifCount = 0;

function addNotif(type, title, body) {
  const n = getNotifs();
  n.unshift({ id: Date.now(), type, title, body, time: Date.now() });
  saveNotifs(n.slice(0, 30));
  newNotifCount++;
  renderNotifDot();
}

function renderNotifDot() {
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = newNotifCount > 0 ? 'block' : 'none';
  const cnt = document.getElementById('notif-count');
  if (cnt) cnt.textContent = newNotifCount + ' new';
}

function toggleNotif() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    newNotifCount = 0;
    renderNotifDot();
    renderNotifList();
  }
}

function renderNotifList() {
  const notifs = getNotifs();
  const list = document.getElementById('notif-list');
  if (!list) return;
  if (!notifs.length) {
    list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text3);font-size:0.82rem;">No notifications yet</div>';
    return;
  }
  const icons = { green: '✓', blue: '📦', amber: '⏰', red: '🚨' };
  list.innerHTML = notifs.slice(0, 10).map(n =>
    `<div class="notif-item">
      <div class="notif-icon ${n.type}">${icons[n.type] || '•'}</div>
      <div class="notif-text">
        <div class="notif-title">${n.title}</div>
        <div class="notif-time">${timeAgo(n.time)}</div>
      </div>
    </div>`
  ).join('');
}

// ─── Utilities ─────────────────────────────────────────────────────
function timeAgo(ts) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1)  return 'Just now';
  if (m < 60) return m + 'm ago';
  return Math.floor(m / 60) + 'h ago';
}

function getExpiryInfo(expiry) {
  const remaining  = expiry - Date.now();
  const hours      = remaining / 3600000;
  const totalHours = 2;
  const pct        = Math.min(100, Math.max(0, (remaining / (totalHours * 3600000)) * 100));
  let cls = 'fresh', label = '';
  if      (hours <= 0)  { label = 'Expired';                           cls = 'urgent'; }
  else if (hours < 0.5) { label = Math.floor(hours * 60) + 'min left'; cls = 'urgent'; }
  else if (hours < 1)   { label = Math.round(hours * 60) + 'min left'; cls = 'soon';   }
  else                  { label = hours.toFixed(1) + 'h left';          cls = 'fresh';  }
  return { pct, cls, label, hours, expired: hours <= 0 };
}

// ─── Toast ─────────────────────────────────────────────────────────
function toast(msg, type = 'success', icon = '✓') {
  const tc = document.getElementById('toast-container');
  if (!tc) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<div class="toast-icon">${icon}</div><div class="toast-msg">${msg}</div>`;
  tc.appendChild(t);
  setTimeout(() => { t.classList.add('fade-out'); setTimeout(() => t.remove(), 300); }, 3500);
}

// ─── Food Card Renderer ────────────────────────────────────────────
function renderFoodCard(f, role) {
  const exp      = getExpiryInfo(f.expiry);
  const isUrgent = exp.hours < 0.5 && exp.hours > 0;
  const status   = exp.expired ? 'expired' : f.status;
  let badgeClass = status;
  if (isUrgent && status === 'available') badgeClass = 'urgent';

  const categoryEmojis = { 'Cooked Meals': '🍛', 'Bakery': '🍞', 'Produce': '🥦', 'Packaged': '📦', 'Sweets': '🍮', '': '🥘' };
  const emoji = categoryEmojis[f.category] || '🥘';

  let actionHTML = '';
  if      (role === 'ngo'       && status === 'available') actionHTML = `<button class="btn-action btn-claim"   onclick="claimFood(${f.id})">Claim Food</button>`;
  else if (role === 'volunteer' && status === 'claimed')   actionHTML = `<button class="btn-action btn-deliver" onclick="deliverFood(${f.id})">Mark Delivered</button>`;
  else if (status === 'delivered')                         actionHTML = `<button class="btn-action btn-done" disabled>Delivered ✓</button>`;
  else if (status === 'expired')                           actionHTML = `<button class="btn-action btn-done" disabled style="color:var(--red)">Expired</button>`;
  else if (role === 'ngo'       && status === 'claimed')   actionHTML = `<button class="btn-action btn-done" disabled>Claimed by NGO</button>`;
  else if (role === 'volunteer' && status === 'available') actionHTML = `<button class="btn-action btn-done" disabled>Awaiting claim</button>`;

  const aiMatch = (role === 'ngo' && f.priority === 'high' && status === 'available')
    ? `<div class="ai-match-badge">
         <svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M5 8.5l2 2 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
         AI Priority Match
       </div>` : '';

  const priorityDot = f.priority === 'high'   ? '<div class="priority-tag priority-high"></div>'
                    : f.priority === 'medium' ? '<div class="priority-tag priority-medium"></div>'
                    : '';

  return `
  <div class="food-card ${isUrgent ? 'urgent' : status}" id="card-${f.id}">
    ${priorityDot}
    <div class="card-header">
      <div class="card-title">${emoji} ${f.title}</div>
      <span class="status-badge ${badgeClass}">${isUrgent ? '⚡ Urgent' : badgeClass}</span>
    </div>
    ${aiMatch}
    <div class="card-meta">
      <div class="meta-row"><span class="meta-icon">⚖️</span>${f.quantity}</div>
      <div class="meta-row"><span class="meta-icon">📍</span>${f.location}</div>
      <div class="meta-row"><span class="meta-icon">👤</span>${f.donor}</div>
    </div>
    <div class="expiry-bar">
      <div class="expiry-label">
        <span>Expiry</span>
        <span style="color:${exp.cls==='urgent'?'var(--red)':exp.cls==='soon'?'var(--amber)':'var(--green)'}">${exp.label}</span>
      </div>
      <div class="expiry-track"><div class="expiry-fill ${exp.cls}" style="width:${exp.pct}%"></div></div>
    </div>
    ${actionHTML ? `<div class="card-actions">${actionHTML}</div>` : ''}
  </div>`;
}

// ─── Map Renderer ──────────────────────────────────────────────────
function renderMap() {
  const foods = getFoods();
  const pins = foods
    .filter(f => f.status === 'available' || f.status === 'claimed')
    .map(f => {
      const x = ((f.lng - 74.5) / 0.25) * 100;
      const y = 100 - ((f.lat - 16.78) / 0.15) * 100;
      return `<div class="pin ${f.status}" style="left:${Math.min(95,Math.max(5,x))}%;top:${Math.min(90,Math.max(10,y))}%">
        <div class="pin-label">${f.title.split(' ').slice(0,2).join(' ')}</div>
        <div class="pin-body">
          <div class="pin-circle">${f.status==='available'?'🟢':'🔵'}</div>
          <div class="pin-tail"></div>
        </div>
      </div>`;
    }).join('');

  const ngoPins = NGOS.map(n => {
    const x = ((n.lng - 74.5) / 0.25) * 100;
    const y = 100 - ((n.lat - 16.78) / 0.15) * 100;
    return `<div class="pin ngo-loc" style="left:${Math.min(95,Math.max(5,x))}%;top:${Math.min(90,Math.max(10,y))}%">
      <div class="pin-label">${n.name}</div>
      <div class="pin-body">
        <div class="pin-circle">🏛</div>
        <div class="pin-tail"></div>
      </div>
    </div>`;
  }).join('');

  return `
  <div class="map-panel">
    <div style="padding:0.75rem 1rem;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
      <span style="font-family:var(--head);font-size:0.82rem;font-weight:700;color:var(--text2)">Live Map — Sangli District</span>
      <span style="margin-left:auto;font-size:0.72rem;color:var(--text3)">${foods.filter(f=>f.status==='available').length} active pins</span>
    </div>
    <div class="map-canvas">
      <svg class="map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0 L0 0 0 10" fill="none" stroke="rgba(255,255,255,0.03)" stroke-width="0.5"/>
        </pattern></defs>
        <rect width="100" height="100" fill="url(#grid)"/>
        <path d="M10,70 Q30,65 45,60 Q60,55 70,50 Q80,45 90,48" stroke="rgba(46,204,113,0.15)" stroke-width="1.5" fill="none"/>
        <path d="M5,40 Q20,42 40,38 Q55,35 75,40 Q85,43 95,38"  stroke="rgba(46,204,113,0.08)" stroke-width="1" fill="none"/>
      </svg>
      <div class="map-overlay"></div>
      ${pins}${ngoPins}
    </div>
    <div class="map-legend">
      <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--green)"></div>Available food</div>
      <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--blue)"></div>Claimed</div>
      <div class="map-legend-item"><div class="map-legend-dot" style="background:var(--amber)"></div>NGO locations</div>
    </div>
  </div>`;
}

// ─── Claim / Deliver Actions ───────────────────────────────────────
function claimFood(id) {
  const foods = getFoods();
  const f = foods.find(x => x.id == id);
  if (!f) return;
  f.status = 'claimed';
  saveFoods(foods);
  addNotif('blue', 'Food Claimed', `You claimed "${f.title}" — volunteers have been notified.`);
  toast(`"${f.title}" claimed! A volunteer will pick up shortly.`, 'info', '🏛️');
  renderPage();
}

function deliverFood(id) {
  const foods = getFoods();
  const f = foods.find(x => x.id == id);
  if (!f) return;
  f.status = 'delivered';
  saveFoods(foods);
  addNotif('green', 'Delivery Complete!', `"${f.title}" from ${f.location} successfully delivered.`);
  toast(`"${f.title}" marked as delivered! Thank you 🙏`, 'success', '✓');
  renderPage();
}

// ─── Expiry Watcher ────────────────────────────────────────────────
function startExpiryWatcher() {
  setInterval(() => {
    const foods = getFoods();
    foods.forEach(f => {
      const exp = getExpiryInfo(f.expiry);
      const card = document.getElementById('card-' + f.id);
      if (card) {
        const bar    = card.querySelector('.expiry-fill');
        const timeEl = card.querySelectorAll('.expiry-label span')[1];
        if (bar)    bar.style.width    = exp.pct + '%';
        if (timeEl) timeEl.textContent = exp.label;
        if (exp.expired) {
          if (bar)   { bar.className = 'expiry-fill urgent'; bar.style.width = '0%'; }
          const badge = card.querySelector('.status-badge');
          if (badge) { badge.className = 'status-badge urgent'; badge.textContent = 'Expired'; }
        }
      }
      // Alert for near-expiry listings
      if (f.status === 'available' && exp.hours < 0.25 && exp.hours > 0) {
        addNotif('red', 'Expiry Alert!', `"${f.title}" expires in under 15 minutes — claim now!`);
      }
    });
  }, 15000);
}

// ─── Notification Simulator ────────────────────────────────────────
function startNotifSimulator() {
  const events = [
    { type: 'green', title: 'New Food Posted!',   body: 'Biryani available near MG Road' },
    { type: 'blue',  title: 'Food Claimed',        body: 'Asha Sewa Trust claimed bread loaves' },
    { type: 'amber', title: 'Expiring Soon',       body: 'Festival sweets expire in 45 min' },
    { type: 'green', title: 'Delivery Complete',   body: 'Volunteer delivered 40 boxes to shelter' },
  ];
  setInterval(() => {
    const e = events[Math.floor(Math.random() * events.length)];
    addNotif(e.type, e.title, e.body);
  }, 35000);
}

// ─── Particles ─────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    size:  Math.random() * 1.5 + 0.5,
    vx:    (Math.random() - 0.5) * 0.3,
    vy:    (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.4 + 0.1
  }));
  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(46,204,113,${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
}

// ─── Shared header HTML generator ─────────────────────────────────
function renderHeader(roleLabel, roleClass) {
  return `
  <div class="app-header">
    <a class="app-logo" href="index.html">
      <span class="dot"></span>HungerBridge
    </a>
    <div class="role-badge">
      <span class="role-pill ${roleClass}">${roleLabel}</span>
    </div>
    <div class="header-actions">
      <button class="notif-btn" id="notif-btn" onclick="toggleNotif()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <div class="notif-dot" id="notif-dot" style="display:none"></div>
      </button>
      <a class="btn-back" href="index.html">← Switch Role</a>
    </div>
  </div>
  <div class="notif-panel" id="notif-panel">
    <div class="notif-header">
      <span>Notifications</span>
      <span style="font-size:0.72rem;color:var(--text3)" id="notif-count">0 new</span>
    </div>
    <div id="notif-list"></div>
  </div>`;
}

// Close notif panel on outside click
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notif-panel');
  const btn   = document.getElementById('notif-btn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});

// Boot particles & notif simulator on every page
initParticles();
startNotifSimulator();
startExpiryWatcher();
