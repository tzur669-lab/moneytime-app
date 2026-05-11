// ---- SETTINGS ----
function setStyle(st) {
  const s = D.gs(); s.styleTheme = st; D.ss(s);
  applyStyleTheme(st);
  vib();
}

function applyStyleTheme(st) {
  const root = document.documentElement;
  root.removeAttribute('data-style');
  if (st && st !== 'default') root.setAttribute('data-style', st);
  const body = document.body;
  if (st === 'glass') {
    body.setAttribute('data-theme', 'dark');
    const s = D.gs(); s.theme = 'dark'; D.ss(s);
  } else if (st === 'minimal' || st === 'gradient') {
    body.removeAttribute('data-theme');
    const s = D.gs(); s.theme = 'light'; D.ss(s);
  }
  document.querySelectorAll('.spick').forEach(el => el.classList.remove('sel'));
  const el = document.getElementById('ts-' + (st || 'default'));
  if (el) el.classList.add('sel');
}

function setColor(c) {
  const s = D.gs(); s.colorTheme = c; D.ss(s);
  applyColorTheme(c);
  vib();
}

function applyColorTheme(c) {
  document.documentElement.removeAttribute('data-color');
  const savedTheme = D.gs().theme || 'light';
  document.body.setAttribute('data-theme', savedTheme === 'dark' ? 'dark' : '');
  if (!savedTheme || savedTheme === 'light') document.body.removeAttribute('data-theme');
  if (c && c !== 'blue') document.documentElement.setAttribute('data-color', c);
  document.querySelectorAll('.tpick').forEach(el => el.classList.remove('sel'));
  const el = document.getElementById('tc-' + c);
  if (el) el.classList.add('sel');
  const colors = { blue: '#1E3A8A', green: '#166534', purple: '#4C1D95', black: '#0F172A', orange: '#C2410C', pink: '#9F1239', teal: '#134E4A' };
  document.getElementById('metaTC').content = colors[c] || '#1E3A8A';
}

function renderSettings() {
  const _vEl = document.getElementById('updSetVer');
  if (_vEl) _vEl.textContent = APP_VERSION;
  const s = D.gs();
  const c = s.colorTheme || 'blue';
  document.querySelectorAll('.tpick').forEach(el => el.classList.remove('sel'));
  document.getElementById('tc-' + c)?.classList.add('sel');
  document.getElementById('togOT').checked = !!s.calcOvertime;
  document.getElementById('togMiss').checked = s.showMissing !== false;
  document.getElementById('drOff').style.display = aToken ? 'none' : 'block';
  document.getElementById('drOn').style.display = aToken ? 'block' : 'none';
  applyStyleTheme(s.styleTheme || 'default');
  renderJobsCont();
  renderFixedBonuses();
}

function setSetting(k, v) {
  const s = D.gs(); s[k] = v; D.ss(s);
  if (k === 'showMissing') renderCal();
  if (k === 'calcOvertime') _updXo2State();
  vib();
}

function _updXo2State() {
  const s = D.gs();
  const el = document.getElementById('xo2');
  if (!el) return;
  const wrap = el.closest('.pdfopt');
  if (!wrap) return;
  if (!s.calcOvertime) {
    if (el.classList.contains('on')) { el.classList.remove('on'); el.textContent = ''; }
    wrap.style.opacity = '0.4'; wrap.style.pointerEvents = 'none';
  } else {
    wrap.style.opacity = ''; wrap.style.pointerEvents = '';
  }
}

function renderJobsCont() {
  const s = D.gs(), cont = document.getElementById('jobsCont');
  cont.innerHTML = (s.jobs || []).map((j, i) => `
  <div class="jcard" style="border-right:4px solid ${j.color}">
    ${(s.jobs || []).length > 1 ? '<button class="btn-del-j" onclick="delJob(' + i + ')">×</button>' : ''}
    <div class="jcard-top"><div class="jcbadge" style="background:${j.color}"></div>
      <input class="jname" value="${j.name}" onchange="updJ(${i},'name',this.value)">
    </div>
    <div class="jnums">
      <div class="fg" style="margin:0"><label class="fl">תעריף שעתי (₪)</label>
        <input type="number" class="fi" value="${j.rate}" onchange="updJ(${i},'rate',this.value)" placeholder="₪/שעה">
      </div>
      <div class="fg" style="margin:0"><label class="fl">סכום קבוע חודשי (₪)</label>
        <input type="number" class="fi" value="${j.fixed || 0}" onchange="updJ(${i},'fixed',this.value)" placeholder="₪/חודש">
      </div>
    </div>
    <div class="fl" style="margin-bottom:6px">צבע</div>
    <div class="crow">${JC.map(c => '<div class="cdot' + (c === j.color ? ' sel' : '') + '" data-color="' + c + '" style="background:' + c + '" onclick="updJC(' + i + ',this.dataset.color,this)"></div>').join('')}</div>
  </div>`).join('');
  document.getElementById('addJobBtn').style.display = (s.jobs || []).length >= 3 ? 'none' : 'inline-flex';
}

function addJob() {
  const s = D.gs();
  if ((s.jobs || []).length >= 3) return;
  s.jobs.push({ name: `עבודה ${(s.jobs || []).length + 1}`, color: JC[(s.jobs || []).length % JC.length], rate: 50, fixed: 0 });
  D.ss(s); renderJobsCont(); vib();
  if (typeof aToken !== 'undefined' && aToken) saveDr();
}

function delJob(i) {
  const s = D.gs(); s.jobs.splice(i, 1); D.ss(s); renderJobsCont();
  if (typeof aToken !== 'undefined' && aToken) saveDr();
}

function updJ(i, f, v) {
  const s = D.gs();
  s.jobs[i][f] = f === 'name' ? v : (parseFloat(v) || 0);
  D.ss(s);
  clearTimeout(window._jobSaveT);
  window._jobSaveT = setTimeout(function () { if (typeof aToken !== 'undefined' && aToken) saveDr(); }, 1200);
}

function updJC(i, col, el) {
  el.closest('.crow').querySelectorAll('.cdot').forEach(d => d.classList.remove('sel'));
  el.classList.add('sel');
  const s = D.gs();
  if (s.jobs && s.jobs[i]) {
    s.jobs[i].color = col; D.ss(s);
    if (typeof aToken !== 'undefined' && aToken) saveDr();
    const card = el.closest('.jcard');
    if (card) { const badge = card.querySelector('.jcbadge'); if (badge) badge.style.background = col; }
    if (card) card.style.borderRightColor = col;
  }
}

// ---- FIXED BONUSES ----
function renderFixedBonuses() {
  const s = D.gs(), cont = document.getElementById('fbonCont');
  if (!cont) return;
  const fbs = s.fixedBonuses || [];
  if (!fbs.length) { cont.innerHTML = '<div style="font-size:12px;color:var(--t3);text-align:center;padding:8px 0">אין בונוסים קבועים עדיין</div>'; return; }
  cont.innerHTML = fbs.map((fb, i) => `
    <div class="fbon-row">
      <input class="fbon-name" value="${(fb.name || '').replace(/"/g, '&quot;')}" placeholder="שם הבונוס"
        oninput="updFixedBonus(${i},'name',this.value)" onchange="updFixedBonus(${i},'name',this.value)">
      <input type="number" class="fbon-amt" value="${fb.amount || ''}" placeholder="₪"
        oninput="updFixedBonus(${i},'amount',this.value)" onchange="updFixedBonus(${i},'amount',this.value)">
      <button class="fbon-del" onclick="delFixedBonus(${i})">×</button>
    </div>`).join('');
}

function addFixedBonus() {
  const s = D.gs();
  if (!s.fixedBonuses) s.fixedBonuses = [];
  s.fixedBonuses.push({ name: '', amount: 0 });
  D.ss(s); renderFixedBonuses(); vib();
  if (typeof aToken !== 'undefined' && aToken) saveDr();
}

function updFixedBonus(i, f, v) {
  const s = D.gs();
  if (!s.fixedBonuses || !s.fixedBonuses[i]) return;
  s.fixedBonuses[i][f] = f === 'name' ? v : (parseFloat(v) || 0);
  D.ss(s);
  clearTimeout(window._fbonSaveT);
  window._fbonSaveT = setTimeout(function () { if (typeof aToken !== 'undefined' && aToken) saveDr(); }, 1200);
}

function delFixedBonus(i) {
  const s = D.gs();
  if (!s.fixedBonuses) return;
  s.fixedBonuses.splice(i, 1); D.ss(s); renderFixedBonuses(); vib();
  if (typeof aToken !== 'undefined' && aToken) saveDr();
}

function renderFbonChips() {
  const s = D.gs(), cont = document.getElementById('dFbonChips');
  if (!cont) return;
  const fbs = (s.fixedBonuses || []).filter(fb => fb.name && fb.amount > 0);
  if (!fbs.length) { cont.innerHTML = ''; return; }
  cont.style.marginBottom = '8px';
  cont.innerHTML = '<div style="font-size:10px;color:var(--t3);margin-bottom:5px">בונוסים קבועים:</div>'
    + fbs.map(function (fb) {
      var safe = fb.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      return '<button class="fbon-chip" data-name="' + safe + '" data-amount="' + fb.amount + '" onclick="addB(this.dataset.name,parseFloat(this.dataset.amount));vib()" style="font-size:12px;padding:6px 13px">+ ' + safe + ' <strong>&#8362;' + fb.amount + '</strong></button>';
    }).join('');
}

function toggleFbonPicker() {
  var picker = document.getElementById('dFbonPicker');
  var btn = document.getElementById('fbonPickerBtn');
  if (!picker) return;
  if (picker.style.display === 'none' || picker.style.display === '') {
    var s = D.gs();
    var fbs = (s.fixedBonuses || []).filter(function (fb) { return fb.name && fb.amount > 0; });
    if (!fbs.length) {
      picker.innerHTML = '<div style="font-size:12px;color:var(--t3);text-align:center;padding:4px 0">אין בונוסים קבועים מוגדרים</div>';
    } else {
      picker.innerHTML = '<div style="font-size:10px;color:var(--t3);margin-bottom:6px">בחר בונוס קבוע:</div>'
        + fbs.map(function (fb) {
          var safe = fb.name.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
          return '<button class="fbon-chip" data-name="' + safe + '" data-amount="' + fb.amount + '" onclick="addB(this.dataset.name,parseFloat(this.dataset.amount));toggleFbonPicker();vib()" style="font-size:12px;padding:6px 13px;display:block;width:100%;text-align:right;margin-bottom:4px">+ ' + safe + ' <strong style="float:left">&#8362;' + fb.amount + '</strong></button>';
        }).join('');
    }
    picker.style.display = 'block';
    if (btn) btn.textContent = '✕ סגור';
  } else {
    picker.style.display = 'none';
    if (btn) btn.textContent = '+ בונוס קבוע';
  }
}

// ---- USER GUIDE ----
const USER_GUIDE = {
  categories: [
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
      title: 'יומן ושעות',
      items: [
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>`, q: 'איך מוסיפים יום עבודה?', a: 'לחץ על כל יום ביומן — יפתח חלון עריכה. הזן שעות, תעריף ובונוסים. לחץ שמור.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>`, q: 'מה זה שעון נוכחות?', a: 'לחץ "התחל" בראש הדף לפתיחת שעון. בסיום לחץ "סיום" — השעות יועברו אוטומטית ליום הנוכחי.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`, q: 'איך קופצים לתאריך ספציפי?', a: 'השתמש בשדה "תאריך" ובלחצן "קפוץ" מתחת לכפתורי הניווט.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`, q: 'מה אומר הסימון הצהוב ביומן?', a: 'ימים צהובים הם ימי חול שעברו ללא רישום שעות. ניתן לכבות זאת בהגדרות.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>`, q: 'מה זה "מאתמול"?', a: 'בחלון העריכה, לחיצה על "מאתמול" מעתיקה את מספר השעות מהיום הקודם.' }
      ]
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
      title: 'חישובי שכר',
      items: [
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`, q: 'איך מחשבים שעות נוספות?', a: 'הפעל "שעות נוספות" בהגדרות. מעל 8 שעות = 125%, מעל 10 שעות = 150% — אוטומטית.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`, q: 'איך מוסיפים בונוס?', a: 'בחלון עריכת יום, לחץ "+ בונוס". הזן תיאור וסכום. ניתן להוסיף כמה בונוסים ביום.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`, q: 'מה זה בונוסים קבועים?', a: 'בהגדרות ניתן להגדיר בונוסים שחוזרים (כמו נסיעות). בחלון עריכת יום יופיע כפתור לבחירתם במהירות.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 2v4"/><path d="M16 2v4"/></svg>`, q: 'איך מגדירים סכום קבוע חודשי?', a: 'בהגדרות, בכל מקום עבודה, יש שדה "סכום קבוע חודשי". מתווסף אוטומטית לחישוב החודש הנוכחי.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`, q: 'איך מעדכנים תעריף לתקופה?', a: 'בדף הראשי לחץ "תעריף לשינוי" — ניתן לשנות תעריף לכל הימים בטווח תאריכים בבת אחת.' }
      ]
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
      title: 'דוחות וסטטיסטיקות',
      items: [
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`, q: 'איך מסתכלים על דוח חודשי?', a: 'לך לדף "דוחות", בחר "החודש" בסרגל הפילטרים. תוצג גרף שעות והכנסות.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/></svg>`, q: 'מה זה טאב "השוואה"?', a: 'השוואה בין חודשים, שבועות בתוך חודש, או חודשים שתבחר — לראות בקלות מתי הרווחת יותר.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`, q: 'מה זה ארכיון?', a: 'בטאב "ארכיון" ניתן לדפדף בכל ההיסטוריה לפי שנה וחודש, כולל פירוט שבועי.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`, q: 'איך מייצאים דוח?', a: 'בהגדרות: ייצוא PDF, Excel, או CSV. ניתן לשתף ישירות מהאפליקציה.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`, q: 'איפה נשמרים הדוחות?', a: 'בהגדרות > "דוחות שמורים" — כל דוח PDF ו-Excel נשמר אוטומטית לצפייה מאוחרת.' }
      ]
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      title: 'מצב זוגי (ביחד)',
      items: [
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`, q: 'איך מחברים פרטנר?', a: 'לך לדף "ביחד" ולחץ "חבר פרטנר". שלח לפרטנר את הקוד שלך, והוא יזין אותו מהצד שלו.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`, q: 'למה אני רואה 0 בנתוני הפרטנר?', a: 'לחץ "רענן נתונים" בדף "ביחד". הפרטנר צריך להיות מחובר ולסנכרן מהמכשיר שלו.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`, q: 'האם הפרטנר רואה את הנתונים שלי?', a: 'כן — לאחר סנכרון, שניכם רואים את ההכנסות המשולבות. הנתונים עוברים דרך Firebase מוצפן.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`, q: 'מה זה "הגדרות זוג"?', a: 'שינוי שמות, צבעים, וניתוק מהזוג. נגיש מדף "ביחד" או מדף יומן.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`, q: 'איך בוחרים תקופה ספציפית בגרף הזוגי?', a: 'ב"ביחד" בחר מהתפריט: חודש נוכחי, בחר חודש, שנה. לצד כל בחירה יש אפשרות לבחור שבוע ספציפי.' }
      ]
    },
    {
      icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23,4 23,10 17,10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
      title: 'גיבוי וסנכרון',
      items: [
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg>`, q: 'איך מגבים את הנתונים?', a: 'חבר Google Drive בהגדרות. הגיבוי יתבצע אוטומטית בכל שמירה.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`, q: 'איך משחזרים נתונים ממכשיר חדש?', a: 'חבר את אותו Google Drive — הנתונים יוטענו אוטומטית. לחלופין, שחזר קובץ JSON/CSV.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>`, q: 'מה ה-JSON export?', a: 'קובץ גיבוי מלא של כל הנתונים וההגדרות. מומלץ לשמור אחת לחודש.' },
        { icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`, q: 'האם הנתונים פרטיים?', a: 'כן. הנתונים נשמרים רק במכשיר ובחשבון Google Drive הפרטי שלך. אין גישה חיצונית.' }
      ]
    }
  ]
};

function openUserGuide(catIdx) {
  const existing = document.getElementById('userGuideOverlay');
  if (existing) existing.remove();
  const ov = document.createElement('div');
  ov.id = 'userGuideOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column;overflow:hidden';
  const tb = document.createElement('div');
  tb.style.cssText = 'background:var(--b8);color:#fff;padding:14px 16px;display:flex;align-items:center;gap:12px;flex-shrink:0';
  const backBtn = document.createElement('button');
  backBtn.style.cssText = 'background:rgba(255,255,255,.15);border:none;color:#fff;font-size:13px;font-weight:400;cursor:pointer;padding:7px 12px;border-radius:8px;line-height:1;flex-shrink:0;display:flex;align-items:center;gap:5px';
  backBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg> חזרה';
  const titleEl = document.createElement('span');
  titleEl.style.cssText = 'font-size:15px;font-weight:500;flex:1;text-align:right';
  titleEl.textContent = 'מדריך למשתמש';
  const closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:rgba(239,68,68,.8);border:none;color:#fff;padding:8px 14px;border-radius:8px;font-size:13px;cursor:pointer;flex-shrink:0';
  closeBtn.textContent = '✕';
  closeBtn.onclick = () => ov.remove();
  tb.appendChild(backBtn); tb.appendChild(titleEl); tb.appendChild(closeBtn);
  const body = document.createElement('div');
  body.style.cssText = 'flex:1;overflow-y:auto;padding:16px';

  function showCategories() {
    titleEl.textContent = 'מדריך למשתמש';
    backBtn.style.visibility = 'hidden';
    backBtn.onclick = null;
    body.innerHTML = '<div style="font-size:12px;color:var(--t3);margin-bottom:14px">בחר קטגוריה לפרטים</div>'
      + USER_GUIDE.categories.map((cat, i) => `
        <div onclick="window._showGuideCategory(${i})" style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--s);border:1px solid var(--bd);border-radius:12px;margin-bottom:10px;cursor:pointer">
          <div style="width:42px;height:42px;background:var(--b0);border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--b8)">${cat.icon}</div>
          <div style="flex:1">
            <div style="font-size:14px;font-weight:500;color:var(--t)">${cat.title}</div>
            <div style="font-size:11px;color:var(--t3);margin-top:2px">${cat.items.length} נושאים</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--t3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"/></svg>
        </div>`).join('');
  }

  window._showGuideCategory = function (i) {
    const cat = USER_GUIDE.categories[i];
    titleEl.textContent = cat.title;
    backBtn.style.visibility = 'visible';
    backBtn.onclick = showCategories;
    body.innerHTML = cat.items.map(item => `
      <div style="background:var(--s);border:1px solid var(--bd);border-radius:12px;padding:14px;margin-bottom:10px">
        <div style="font-size:13px;font-weight:500;color:var(--b8);margin-bottom:7px;display:flex;align-items:flex-start;gap:8px">
          <span style="color:var(--b6);flex-shrink:0;margin-top:1px">${item.icon}</span>
          <span>${item.q}</span>
        </div>
        <div style="font-size:12px;color:var(--t2);line-height:1.65;padding-right:22px">${item.a}</div>
      </div>`).join('');
    body.scrollTop = 0;
  };

  showCategories();
  ov.appendChild(tb); ov.appendChild(body);
  document.body.appendChild(ov);
  if (catIdx != null) window._showGuideCategory(catIdx);
}
