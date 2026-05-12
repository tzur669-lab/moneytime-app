// ---- CLOCK ----
function initClock() {
  if (localStorage.getItem('cit')) {
    if (tInt) clearInterval(tInt);
    tInt = setInterval(tickC, 1000);
    tickC();
    const b = document.getElementById('clkBtn');
    b.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> סיום`;
    b.className = 'btn-clk on';
    document.getElementById('clkTime').classList.add('on');
    const icon = document.getElementById('clkIcon');
    if (icon) icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(255,255,255,0.9)"/></svg>';
  }
}

function tickC() {
  const s = parseInt(localStorage.getItem('cit'));
  if (!s) return;
  const d = Math.floor((Date.now() - s) / 1000);
  document.getElementById('clkTime').textContent =
    `${String(Math.floor(d / 3600)).padStart(2, '0')}:${String(Math.floor(d % 3600 / 60)).padStart(2, '0')}:${String(d % 60).padStart(2, '0')}`;
  const circ = 201, maxSec = 8 * 3600;
  const pct = Math.min(d / maxSec, 1);
  const ring = document.getElementById('clkRing');
  if (ring) ring.style.strokeDashoffset = String(Math.round(circ - (circ * pct)));
}

function handleClock() {
  vib();
  if (localStorage.getItem('cit')) {
    clearInterval(tInt);
    tInt = null;
    const diff = (Date.now() - parseInt(localStorage.getItem('cit'))) / 3600000;
    localStorage.removeItem('cit');
    const b = document.getElementById('clkBtn');
    b.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21"/></svg> התחל`;
    b.className = 'btn-clk';
    document.getElementById('clkTime').textContent = '00:00:00';
    document.getElementById('clkTime').classList.remove('on');
    const ring = document.getElementById('clkRing');
    if (ring) ring.style.strokeDashoffset = '201';
    const icon = document.getElementById('clkIcon');
    if (icon) icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>';
    const _todayKey = fk(new Date());
    openDay(_todayKey);
    setTimeout(() => { const _ex = D.g()[_todayKey]; if (!_ex || !(_ex.hours > 0)) document.getElementById('dH').value = diff.toFixed(2); }, 100);
  } else {
    localStorage.setItem('cit', Date.now());
    if (tInt) clearInterval(tInt);
    tInt = setInterval(tickC, 1000);
    const b = document.getElementById('clkBtn');
    b.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> סיום`;
    b.className = 'btn-clk on';
    document.getElementById('clkTime').classList.add('on');
    const icon = document.getElementById('clkIcon');
    if (icon) icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="rgba(255,255,255,0.9)"/></svg>';
    tickC();
  }
}
