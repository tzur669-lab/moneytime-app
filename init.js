// ---- KEYBOARD ----
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  if (e.key === 'Enter' && document.getElementById('mDay').classList.contains('active')) saveDay();
});

// ---- PWA ----
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  dProm = e;
  document.getElementById('instBanner').classList.add('show');
});
document.getElementById('instBtn').addEventListener('click', async () => {
  if (dProm) {
    dProm.prompt();
    const { outcome } = await dProm.userChoice;
    if (outcome === 'accepted') document.getElementById('instBanner').classList.remove('show');
    dProm = null;
  }
});
window.addEventListener('appinstalled', () => document.getElementById('instBanner').classList.remove('show'));
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => { }));

// ---- HELPERS גלובלי ----
function vib() { try { navigator.vibrate?.(10); } catch (e) { } }
function flash() {
  const el = document.getElementById('sf');
  el.className = 'sf show';
  setTimeout(() => { el.className = 'sf bye'; setTimeout(() => el.className = 'sf', 300); }, 900);
}
function openM(id) { document.getElementById(id).classList.add('active'); if (id === 'mXLSX') setTimeout(_updXo2State, 30); }
function closeM(id) { document.getElementById(id).classList.remove('active'); }

// ---- MODALS ----
document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeM(m.id); });
});

// ---- THEME ----
function toggleTheme(silent = false) {
  const dk = document.body.getAttribute('data-theme') === 'dark';
  const th = dk ? 'light' : 'dark';
  document.body.setAttribute('data-theme', th);
  document.getElementById('themeBtn').innerHTML = th === 'dark'
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  document.getElementById('metaTC').content = th === 'dark' ? '#080E1E' : '#1E3A8A';
  if (!silent) { const s = D.gs(); s.theme = th; D.ss(s); }
  vib();
}

// ---- PAGES ----
function swPage(p, btn) {
  vib();
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.ni').forEach(x => x.classList.remove('active'));
  document.getElementById('pg-' + p).classList.add('active');
  btn.classList.add('active');
  if (p === 'rep') updRep();
  if (p === 'couple') renderCouple();
  if (p === 'set') renderSettings();
}

// ---- CALENDAR VIEW ----
var _calView = localStorage.getItem('calView') || 'month';

function switchCalView(v) {
  _calView = v;
  localStorage.setItem('calView', v);
  ['month', 'week', 'day'].forEach(function (k) {
    var el = document.getElementById('cvp-' + k);
    if (el) el.classList.toggle('active', k === v);
  });
  renderCal();
}

// ---- MULTI MODAL ----
function openMulti(type) {
  mType = type;
  const s = D.gs();
  const body = document.getElementById('mMBody');
  const jobOpts = (s.jobs || []).map((j, i) => `<option value="${i}">${j.name}</option>`).join('');
  const jobSel = `<div class="fg" style="margin-bottom:10px"><label class="fl">מקום עבודה</label><select class="fi" id="mJob">${jobOpts}</select></div>`;
  if (type === 'hours') {
    document.getElementById('mMTtl').innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:6px"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg> שעות בתקופה';
    body.innerHTML = jobSel + `<div class="fg"><label class="fl">מספר שעות</label><input type="number" class="fi" id="mV" step="0.25" placeholder="8"></div>`;
  } else if (type === 'profit') {
    document.getElementById('mMTtl').innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:6px"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> רווח בתקופה';
    body.innerHTML = `<div class="fg"><label class="fl">סכום (₪)</label><input type="number" class="fi" id="mV"></div><div class="fg"><label class="fl">תיאור</label><input type="text" class="fi" id="mVD" placeholder="בונוס, נסיעות..."></div>`;
  } else if (type === 'rate') {
    document.getElementById('mMTtl').innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-left:6px"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg> תעריף לשינוי';
    body.innerHTML = jobSel + `<div class="fg"><label class="fl">תעריף שעתי חדש (₪)</label><input type="number" class="fi" id="mV" placeholder="0"></div>`;
  }
  openM('mMulti');
}

function execMulti() {
  const val = document.getElementById('mV')?.value;
  if (val === '' || val === null || val === undefined) return;
  const dates = getDts(document.getElementById('mRng').value, 'mCS', 'mCE');
  if (!dates.length) return;
  const data = D.g(), s = D.gs();
  const selJob = parseInt(document.getElementById('mJob')?.value || '0');
  const jobRate = s.jobs?.[selJob]?.rate || 50;
  dates.forEach(d => {
    const k = fk(d);
    if (mType === 'hours') {
      if (!data[k]) data[k] = { hours: 0, rate: jobRate, bonuses: [], note: '', jobIdx: selJob };
      data[k].hours = parseFloat(val) || 0;
      data[k].jobIdx = selJob;
      data[k].rate = jobRate;
    } else if (mType === 'rate') {
      if (!data[k]) data[k] = { hours: 0, rate: parseFloat(val) || 0, bonuses: [], note: '', jobIdx: selJob };
      data[k].rate = parseFloat(val) || 0;
      data[k].jobIdx = selJob;
    } else if (mType === 'profit') {
      if (!data[k]) data[k] = { hours: 0, rate: jobRate, bonuses: [], note: '', jobIdx: 0 };
      if (!data[k].bonuses) data[k].bonuses = [];
      data[k].bonuses.push({ desc: document.getElementById('mVD')?.value || 'תוספת', amount: parseFloat(val) || 0 });
    }
  });
  D.s(data);
  closeM('mMulti');
  renderCal();
  updRep();
  saveDr();
  flash();
  vib();
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  const s = D.gs();
  if (s.theme === 'dark') toggleTheme(true);
  if (!s.myUID) {
    s.myUID = Math.random().toString(36).substring(2, 10);
    var defColors = ['#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#0EA5E9', '#EC4899'];
    if (s.myColor === '#1E3A8A' || !s.myColor) {
      s.myColor = defColors[Math.floor(Math.random() * defColors.length)];
    }
    D.ss(s);
  }
  const savedColor = D.gs().colorTheme || 'blue';
  applyColorTheme(savedColor);
  applyStyleTheme(D.gs().styleTheme || 'default');

  // שחזר תצוגת יומן שמורה
  _calView = localStorage.getItem('calView') || 'month';
  ['month', 'week', 'day'].forEach(function (k) {
    var el = document.getElementById('cvp-' + k);
    if (el) el.classList.toggle('active', k === _calView);
  });

  initClock();
  renderCal();
  setSyncDot(false);
  initGD();
  checkPairLink();

  // נקה tokens ישנים מ-Firebase
  _cleanupOldTokens();

  // בדוק אם מישהו חיבר אותנו — 4 שניות אחרי טעינה
  setTimeout(function () {
    const _s = D.gs();
    if (_s.myCode && !_s.pairCode) autoDetectIncomingPair();
  }, 4000);

  // הצג מייל יצירת קשר
  (function () {
    var u = 'tzur669', d = 'gmail.com';
    var el = document.getElementById('contactMailTxt');
    if (el) el.textContent = u + '@' + d;
    var lnk = document.getElementById('contactMailLink');
    if (lnk) lnk.href = 'mailto:' + u + '@' + d;
  })();

  // בדיקת עדכון
  setTimeout(checkAppUpdate, window.Capacitor ? 6000 : 3000);
  if (window.Capacitor) setTimeout(function () { if (!_updShown && _updRetryCount === 0) checkAppUpdate(); }, 15000);

  document.addEventListener('resume', function () { setTimeout(checkAppUpdate, 2000); });
  document.addEventListener('resume', function () {
    const _s = D.gs();
    if (_s.myCode && !_s.pairCode) setTimeout(autoDetectIncomingPair, 1500);
  });
});
