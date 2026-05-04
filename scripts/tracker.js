// ── INIT ──────────────────────────────────────────────────────────
const params   = new URLSearchParams(window.location.search);
const userName = params.get('name') || 'Practitioner';
document.getElementById('user-display-name').textContent = userName;

let practices = [], comps = [], beltData = { belt: 0, stripes: 0 };

function signOut() {
  window.location.href = 'password-screen.html';
}

// ── DATA LAYER ────────────────────────────────────────────────────
function loadAllData() {
  try { beltData  = JSON.parse(localStorage.getItem('bjj-belt') || '{"belt":0,"stripes":0}'); } catch(_) {}
  try { practices = JSON.parse(localStorage.getItem('bjj-practices') || '[]'); }  catch(_) { practices = []; }
  try { comps     = JSON.parse(localStorage.getItem('bjj-comps') || '[]'); }      catch(_) { comps = []; }
  renderAll();
}

function savePractices() { localStorage.setItem('bjj-practices', JSON.stringify(practices)); }
function saveComps()     { localStorage.setItem('bjj-comps',     JSON.stringify(comps)); }
function saveBeltLS()    { localStorage.setItem('bjj-belt',      JSON.stringify(beltData)); }
function genId()         { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
function now()           { return new Date().toISOString(); }

// ── TABS ──────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'stats') renderStats();
  });
});

// ── MODALS ────────────────────────────────────────────────────────
window.openModal = function(type) {
  const today = new Date().toISOString().split('T')[0];
  if (type === 'practice') {
    document.getElementById('p-date').value  = today;
    document.getElementById('p-type').value  = 'gi';
    document.getElementById('p-mins').value  = '';
    document.getElementById('p-school').value = '';
    document.getElementById('p-techs').value = '';
    document.getElementById('p-notes').value = '';
    const btn = document.getElementById('practice-save-btn');
    btn.textContent = 'Save Session';
    btn.onclick = () => saveEntry('practice');
  } else {
    document.getElementById('c-date').value   = today;
    document.getElementById('c-name').value   = '';
    document.getElementById('c-division').value = '';
    document.getElementById('c-result').value = 'gold';
    document.getElementById('c-wins').value   = '';
    document.getElementById('c-losses').value = '';
    document.getElementById('c-notes').value  = '';
    const btn = document.getElementById('comp-save-btn');
    btn.textContent = 'Save Competition';
    btn.onclick = () => saveEntry('comp');
  }
  document.getElementById('modal-' + type).classList.add('open');
};

window.closeModal = function(type) {
  document.getElementById('modal-' + type).classList.remove('open');
};

document.querySelectorAll('.modal-overlay').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
});

// ── SAVE ──────────────────────────────────────────────────────────
window.saveEntry = function(type) {
  if (type === 'practice') {
    const date = document.getElementById('p-date').value;
    if (!date) return;
    practices.unshift({
      id: genId(), date,
      type:   document.getElementById('p-type').value,
      mins:   parseInt(document.getElementById('p-mins').value) || 60,
      school: document.getElementById('p-school').value.trim(),
      techs:  document.getElementById('p-techs').value.split(',').map(t => t.trim()).filter(Boolean),
      notes:  document.getElementById('p-notes').value.trim(),
      createdAt: now()
    });
    savePractices();
  } else {
    const date = document.getElementById('c-date').value;
    const name = document.getElementById('c-name').value.trim();
    if (!date || !name) return;
    comps.unshift({
      id: genId(), date, name,
      division: document.getElementById('c-division').value.trim(),
      result:   document.getElementById('c-result').value,
      wins:     parseInt(document.getElementById('c-wins').value)   || 0,
      losses:   parseInt(document.getElementById('c-losses').value) || 0,
      notes:    document.getElementById('c-notes').value.trim(),
      createdAt: now()
    });
    saveComps();
  }
  closeModal(type);
  renderAll();
};

// ── EDIT ──────────────────────────────────────────────────────────
window.editEntry = function(type, id) {
  if (type === 'practice') {
    const e = practices.find(p => p.id === id);
    if (!e) return;
    document.getElementById('p-date').value   = e.date;
    document.getElementById('p-type').value   = e.type;
    document.getElementById('p-mins').value   = e.mins || '';
    document.getElementById('p-school').value = e.school || '';
    document.getElementById('p-techs').value  = (e.techs || []).join(', ');
    document.getElementById('p-notes').value  = e.notes || '';
    const btn = document.getElementById('practice-save-btn');
    btn.textContent = 'Update Session';
    btn.onclick = () => updateEntry('practice', id);
    document.getElementById('modal-practice').classList.add('open');
  } else {
    const e = comps.find(c => c.id === id);
    if (!e) return;
    document.getElementById('c-date').value     = e.date;
    document.getElementById('c-name').value     = e.name;
    document.getElementById('c-division').value = e.division || '';
    document.getElementById('c-result').value   = e.result;
    document.getElementById('c-wins').value     = e.wins;
    document.getElementById('c-losses').value   = e.losses;
    document.getElementById('c-notes').value    = e.notes || '';
    const btn = document.getElementById('comp-save-btn');
    btn.textContent = 'Update Competition';
    btn.onclick = () => updateEntry('comp', id);
    document.getElementById('modal-comp').classList.add('open');
  }
};

// ── UPDATE ────────────────────────────────────────────────────────
window.updateEntry = function(type, id) {
  if (type === 'practice') {
    const date = document.getElementById('p-date').value;
    if (!date) return;
    const idx = practices.findIndex(e => e.id === id);
    if (idx === -1) return;
    practices[idx] = {
      ...practices[idx], date,
      type:   document.getElementById('p-type').value,
      mins:   parseInt(document.getElementById('p-mins').value) || 60,
      school: document.getElementById('p-school').value.trim(),
      techs:  document.getElementById('p-techs').value.split(',').map(t => t.trim()).filter(Boolean),
      notes:  document.getElementById('p-notes').value.trim(),
    };
    savePractices();
  } else {
    const date = document.getElementById('c-date').value;
    const name = document.getElementById('c-name').value.trim();
    if (!date || !name) return;
    const idx = comps.findIndex(e => e.id === id);
    if (idx === -1) return;
    comps[idx] = {
      ...comps[idx], date, name,
      division: document.getElementById('c-division').value.trim(),
      result:   document.getElementById('c-result').value,
      wins:     parseInt(document.getElementById('c-wins').value)   || 0,
      losses:   parseInt(document.getElementById('c-losses').value) || 0,
      notes:    document.getElementById('c-notes').value.trim(),
    };
    saveComps();
  }
  closeModal(type);
  renderAll();
};

// ── DELETE ────────────────────────────────────────────────────────
window.deleteEntry = function(type, id) {
  if (!confirm('Delete this entry?')) return;
  if (type === 'practice') { practices = practices.filter(e => e.id !== id); savePractices(); }
  else                     { comps     = comps.filter(e => e.id !== id);     saveComps(); }
  renderAll();
};

// ── BELT ──────────────────────────────────────────────────────────
document.getElementById('belt-select').addEventListener('change',  saveBelt);
document.getElementById('stripe-select').addEventListener('change', saveBelt);

function saveBelt() {
  beltData = {
    belt:    parseInt(document.getElementById('belt-select').value),
    stripes: parseInt(document.getElementById('stripe-select').value)
  };
  saveBeltLS();
  renderBelt();
}

const BELT_NAMES = ['White', 'Blue', 'Purple', 'Brown', 'Black'];

function renderBelt() {
  document.querySelectorAll('.belt-seg').forEach((seg, i) => {
    seg.classList.toggle('earned',   i <= beltData.belt);
    seg.classList.toggle('unearned', i >  beltData.belt);
  });
  document.getElementById('belt-current-label').innerHTML =
    `${BELT_NAMES[beltData.belt]} Belt${beltData.stripes > 0
      ? ' · ' + beltData.stripes + ' Stripe' + (beltData.stripes > 1 ? 's' : '')
      : ''}`;
  document.getElementById('belt-select').value  = beltData.belt;
  document.getElementById('stripe-select').value = beltData.stripes;
}

// ── HELPERS ───────────────────────────────────────────────────────
function fmtDate(str) {
  const d = new Date(str + 'T12:00:00');
  return {
    day:   d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
    year:  d.getFullYear()
  };
}

function calcStreak() {
  if (!practices.length) return 0;
  const dates = [...new Set(practices.map(e => e.date))].sort().reverse();
  const today = new Date().toISOString().split('T')[0];
  let streak = 0, check = today;
  for (const d of dates) {
    if (d === check) {
      streak++;
      const p = new Date(check + 'T12:00:00');
      p.setDate(p.getDate() - 1);
      check = p.toISOString().split('T')[0];
    } else if (d < check) break;
  }
  return streak;
}

// ── RENDER: PRACTICES ─────────────────────────────────────────────
function renderPractices() {
  const list = document.getElementById('practice-list');
  if (!practices.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-glyph">OSS</div>
      <div class="empty-msg">No sessions logged yet. Step onto the mat.</div>
    </div>`;
    return;
  }
  list.innerHTML = '';
  practices.forEach(e => {
    const d    = fmtDate(e.date);
    const meta = [e.mins ? e.mins + ' min' : null, e.school || null].filter(Boolean);
    const card = document.createElement('div');
    card.className  = 'entry-card';
    card.dataset.type = e.type;
    card.innerHTML = `
      <div class="entry-date-block">
        <div class="day">${d.day}</div>
        <div class="month">${d.month}</div>
        <div class="year">${d.year}</div>
      </div>
      <div class="entry-body">
        <div class="entry-row1">
          <span class="entry-type-tag ${e.type}">${e.type.replace('-',' ')}</span>
          <span class="entry-title">${userName.toLowerCase()}</span>
        </div>
        <div class="entry-meta">${meta.join(' · ')}</div>
        ${e.notes  ? `<div class="entry-notes">${e.notes}</div>` : ''}
        ${e.techs?.length ? `<div class="tech-tags">${e.techs.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>` : ''}
      </div>
      <div class="entry-actions">
        <button class="icon-btn" onclick="editEntry('practice','${e.id}')" title="Edit">&#x270E;</button>
        <button class="icon-btn del" onclick="deleteEntry('practice','${e.id}')" title="Delete">&#x2715;</button>
      </div>`;
    list.appendChild(card);
  });
}

// ── RENDER: COMPS ─────────────────────────────────────────────────
function renderComps() {
  const list = document.getElementById('comp-list');
  let tw = 0, tl = 0;
  comps.forEach(e => { tw += e.wins; tl += e.losses; });
  document.getElementById('comp-record').innerHTML =
    `<span class="win">${tw}</span><span class="sep"> – </span><span class="loss">${tl}</span>`;

  if (!comps.length) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-glyph">🥋</div>
      <div class="empty-msg">No competitions logged yet.</div>
    </div>`;
    return;
  }

  list.innerHTML = '';
  const rl = { gold: '🥇 GOLD', silver: '🥈 SILVER', bronze: '🥉 BRONZE', loss: 'NO PLACE' };
  comps.forEach(e => {
    const d    = fmtDate(e.date);
    const card = document.createElement('div');
    card.className    = 'entry-card';
    card.dataset.type = 'comp';
    card.innerHTML = `
      <div class="entry-date-block">
        <div class="day">${d.day}</div>
        <div class="month">${d.month}</div>
        <div class="year">${d.year}</div>
      </div>
      <div class="entry-body">
        <div class="entry-row1">
          <span class="entry-type-tag comp">comp</span>
          <span class="entry-title">${e.name}</span>
        </div>
        <div class="entry-meta">${e.division ? e.division + ' · ' : ''}${e.wins}W ${e.losses}L</div>
        <div style="margin-bottom:0.4rem;"><span class="result-badge ${e.result}">${rl[e.result] || e.result}</span></div>
        ${e.notes ? `<div class="entry-notes">${e.notes}</div>` : ''}
      </div>
      <div class="entry-actions">
        <button class="icon-btn" onclick="editEntry('comp','${e.id}')" title="Edit">&#x270E;</button>
        <button class="icon-btn del" onclick="deleteEntry('comp','${e.id}')" title="Delete">&#x2715;</button>
      </div>`;
    list.appendChild(card);
  });
}

// ── RENDER: STATS ─────────────────────────────────────────────────
function renderStats() {
  const total = practices.length;
  const mins  = practices.reduce((a, e) => a + (e.mins || 0), 0);
  const now   = new Date();
  const month = practices.filter(e => {
    const d = new Date(e.date + 'T12:00:00');
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  let tw = 0;
  comps.forEach(e => tw += e.wins);

  document.getElementById('s-total').textContent  = total;
  document.getElementById('s-hours').textContent  = Math.round(mins / 60);
  document.getElementById('s-avg').textContent    = total ? Math.round(mins / total) : 0;
  document.getElementById('s-wins').textContent   = tw;
  document.getElementById('s-month').textContent  = month;
  document.getElementById('s-comps').textContent  = comps.length;
  document.getElementById('s-streak').textContent = calcStreak();

  const types = { gi: 0, nogi: 0, drilling: 0, 'open-mat': 0 };
  practices.forEach(e => { if (types[e.type] !== undefined) types[e.type]++; });
  const tc = { gi: 'var(--belt-blue)', nogi: 'var(--belt-purple)', drilling: 'var(--belt-green)', 'open-mat': 'var(--belt-orange)' };
  document.getElementById('type-breakdown').innerHTML = Object.entries(types)
    .map(([k, v]) => `<div class="type-chip"><div class="type-dot" style="background:${tc[k]}"></div>${k.replace('-',' ')}: ${v}</div>`)
    .join('');

  // Heatmap
  const counts = {};
  practices.forEach(e => counts[e.date] = (counts[e.date] || 0) + 1);
  const hm  = document.getElementById('heatmap');
  hm.innerHTML = '';
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const d   = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const c   = Math.min(counts[key] || 0, 3);
    const cell = document.createElement('div');
    cell.className = 'hm-day';
    if (c) cell.dataset.count = c;
    cell.title = key + (c ? ` (${c})` : '');
    hm.appendChild(cell);
  }
}

// ── RENDER: HEADER STATS ──────────────────────────────────────────
function updateHeaderStats() {
  const mins = practices.reduce((a, e) => a + (e.mins || 0), 0);
  document.getElementById('stat-sessions').textContent = practices.length;
  document.getElementById('stat-hours').textContent    = Math.round(mins / 60);
  document.getElementById('stat-comps').textContent    = comps.length;
}

// ── RENDER ALL ────────────────────────────────────────────────────
function renderAll() {
  renderPractices();
  renderComps();
  renderBelt();
  updateHeaderStats();
}

// ── START ─────────────────────────────────────────────────────────
loadAllData();
