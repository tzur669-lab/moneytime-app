// ---- AUTO UPDATE ----
const APP_VERSION = '2.1.377';
const APP_BUILD = 377; // CI מחליף בכל build
const GITHUB_APK_BASE = 'https://github.com/tzur669-lab/moneytime-app/releases/download';
const GITHUB_RELEASES = 'https://github.com/tzur669-lab/moneytime-app/releases/latest';
const VER_FB_URL = 'https://moneytime-app-f5a15-default-rtdb.firebaseio.com/appVersion.json';

let _updShown = false;
let _updApkUrl = '';
let _updAvailBuild = 0;
let _updAvailVer = '';
let _updRetryCount = 0;
const _UPD_MAX_RETRY = 5;
const _UPD_RETRY_DELAYS = [15000, 30000, 60000, 120000, 300000];

function _getInstalledBuild() {
  return APP_BUILD;
}

async function checkAppUpdate() {
  if (_updShown) return;
  try {
    const r = await fetch(VER_FB_URL + '?nc=' + Date.now(), {
      method: 'GET', cache: 'no-store', headers: { 'Accept': 'application/json' }
    });
    if (!r.ok) {
      if (r.status === 401 || r.status === 403) { console.warn('[Update] Firebase blocked (' + r.status + ').'); return; }
      _scheduleUpdRetry(); return;
    }
    const data = await r.json();
    if (!data || !data.build) return;
    _updRetryCount = 0;
    const remoteBuild = parseInt(data.build, 10) || 0;
    const installedBuild = _getInstalledBuild();
    const isApk = !!window.Capacitor;
    if (!isApk) return; // בדפדפן: ה-SW מטפל בעדכון אוטומטית
    const hasUpdate = remoteBuild > installedBuild;
    if (hasUpdate) {
      _updAvailBuild = remoteBuild;
      _updAvailVer = data.version || ('build ' + remoteBuild);
      _updApkUrl = GITHUB_APK_BASE + '/v' + remoteBuild + '/moneytime-pro.apk';
      _showUpdBanner(_updAvailVer, data.notes || '');
    }
  } catch (e) {
    console.warn('[Update] Network error:', e.message);
    _scheduleUpdRetry();
  }
}

function _scheduleUpdRetry() {
  if (_updShown || _updRetryCount >= _UPD_MAX_RETRY) return;
  const delay = _UPD_RETRY_DELAYS[_updRetryCount] || 300000;
  _updRetryCount++;
  setTimeout(checkAppUpdate, delay);
}

function _verIsNewer(remote, local) {
  const r = String(remote).split('.').map(Number);
  const l = String(local).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((r[i] || 0) > (l[i] || 0)) return true;
    if ((r[i] || 0) < (l[i] || 0)) return false;
  }
  return false;
}

function _showUpdBanner(ver, notes) {
  if (_updShown) return;
  _updShown = true;
  _setUpdSettingsState('available', ver, notes);
  const old = document.getElementById('updBanner');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'updBanner';
  el.className = 'upd-banner';
  el.innerHTML = `
    <div class="upd-ico" style="font-size:16px">🔄</div>
    <div class="upd-txt" style="flex:1;min-width:0">
      <div class="upd-ttl" style="font-size:12px">גרסה ${ver} זמינה</div>
    </div>
    <button class="upd-btn" style="font-size:10px;padding:5px 10px"
      onclick="swPage('set',document.querySelector('.ni:last-child'));document.getElementById('updBanner')?.remove()">פרטים</button>
    <button class="upd-x" onclick="document.getElementById('updBanner')?.remove()">×</button>`;
  document.body.appendChild(el);
  setTimeout(() => { const b = document.getElementById('updBanner'); if (b) b.remove(); }, 8000);
}

function _setUpdSettingsState(state, ver, notes) {
  const btn = document.getElementById('updSetBtn');
  const status = document.getElementById('updSetStatus');
  const sub = document.getElementById('updSetSub');
  const verEl = document.getElementById('updSetVer');
  const isApkCtx = !!window.Capacitor;
  const dispVer = isApkCtx && APP_BUILD > 0 ? (APP_VERSION + ' (build ' + APP_BUILD + ')') : APP_VERSION;
  if (verEl) verEl.textContent = dispVer;
  if (state === 'available') {
    if (status) status.innerHTML = 'גרסה נוכחית: <span id="updSetVer">' + dispVer + '</span> <span style="color:var(--g);font-size:11px;margin-right:6px">← ' + ver + ' זמינה</span>';
    if (sub) sub.textContent = notes || 'עדכון חדש עם שיפורים';
    if (btn) {
      btn.textContent = 'עדכן עכשיו';
      btn.style.background = 'var(--g)'; btn.style.color = '#fff'; btn.style.border = 'none'; btn.disabled = false;
      btn.onclick = function () { if (!!window.Capacitor) { _askApkUpdate(btn); } else { _doWebUpdate(btn); } };
    }
  } else if (state === 'checking') {
    if (btn) { btn.textContent = 'בודק...'; btn.disabled = true; }
    if (sub) sub.textContent = 'בודק אם יש עדכון...';
  } else if (state === 'latest') {
    if (btn) {
      btn.textContent = 'עדכני ✓'; btn.disabled = false;
      btn.style.background = ''; btn.style.color = ''; btn.style.border = '';
      btn.onclick = function () { _checkUpdateFromSettings(btn); };
    }
    if (sub) sub.textContent = 'הגרסה האחרונה מותקנת';
  }
}

async function _checkUpdateFromSettings(btn) {
  _setUpdSettingsState('checking');
  try {
    const r = await fetch(VER_FB_URL + '?nc=' + Date.now(), { method: 'GET', cache: 'no-store', headers: { 'Accept': 'application/json' } });
    if (!r.ok) { _setUpdSettingsState('latest'); return; }
    const data = await r.json();
    if (!data || !data.build) { _setUpdSettingsState('latest'); return; }
    const remoteBuild = parseInt(data.build, 10) || 0;
    const installedBuild = _getInstalledBuild();
    const isApk = !!window.Capacitor;
    const hasUpdate = isApk ? (remoteBuild > installedBuild) : _verIsNewer(data.version || '', APP_VERSION);
    if (hasUpdate) {
      _updAvailBuild = remoteBuild;
      _updAvailVer = data.version || ('build ' + remoteBuild);
      _updApkUrl = GITHUB_APK_BASE + '/v' + remoteBuild + '/moneytime-pro.apk';
      _setUpdSettingsState('available', _updAvailVer, data.notes || '');
    } else {
      _setUpdSettingsState('latest');
    }
  } catch (e) { _setUpdSettingsState('latest'); }
}

// --- עדכון ב-APK ---
function _askApkUpdate(btn) {
  if (btn) { btn.disabled = true; }
  const dlg = document.createElement('div');
  dlg.id = 'updDlg';
  dlg.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  dlg.innerHTML = '<div style="background:#1E293B;border-radius:18px;padding:28px 24px;max-width:320px;width:100%;border:1px solid #334155;text-align:center">'
    + '<div style="font-size:36px;margin-bottom:12px">🔄</div>'
    + '<div style="font-size:16px;font-weight:600;color:#F1F5F9;margin-bottom:8px">עדכון זמין</div>'
    + '<div style="font-size:13px;color:#94A3B8;margin-bottom:24px">האם לעדכן את האפליקציה עכשיו?<br>הנתונים שלך יישמרו.</div>'
    + '<div style="display:flex;gap:10px;justify-content:center">'
    + '<button onclick="_cancelApkUpdate()" style="background:#334155;border:none;color:#94A3B8;padding:12px 24px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit">לא עכשיו</button>'
    + '<button id="updYesBtn" onclick="_doApkUpdate()" style="background:#2563EB;border:none;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit">עדכן ✓</button>'
    + '</div></div>';
  document.body.appendChild(dlg);
}

function _cancelApkUpdate() {
  var dlg = document.getElementById('updDlg'); if (dlg) dlg.remove();
  var btn = document.getElementById('updSetBtn'); if (btn) { btn.disabled = false; }
}

async function _doApkUpdate() {
  document.getElementById('updDlg')?.remove();
  document.getElementById('updBanner')?.remove();
  const apkUrl = _updApkUrl || GITHUB_RELEASES;
  const browser = await _waitForCapBrowser(4000);
  if (browser) {
    try { await browser.open({ url: apkUrl }); }
    catch (e) { try { window.open(apkUrl, '_blank'); } catch (e2) { } }
  } else {
    try { window.open(apkUrl, '_blank'); } catch (e) { }
  }
  setTimeout(function () {
    const note = document.createElement('div');
    note.id = 'updNote';
    note.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1E293B;border:1px solid #334155;border-radius:14px;padding:16px 20px;z-index:9999;max-width:300px;width:90%;text-align:center;font-size:13px;color:#94A3B8;line-height:1.6';
    note.innerHTML = '<div style="font-size:18px;margin-bottom:8px">📲</div>'
      + '<strong style="color:#F1F5F9">הורדה נפתחה בדפדפן</strong><br>'
      + 'לאחר ההורדה — פתח את הקובץ מהתראות הפלאפון.<br>'
      + '<span style="font-size:11px">אם תישאל על \'מקורות לא ידועים\' — אשר.</span><br><br>'
      + '<button onclick="document.getElementById(\'updNote\').remove()" style="background:#2563EB;border:none;color:#fff;padding:8px 20px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit">הבנתי</button>';
    document.body.appendChild(note);
    setTimeout(function () { var n = document.getElementById('updNote'); if (n) n.remove(); }, 15000);
  }, 500);
}

// --- עדכון בדפדפן: נקה cache ורענן ---
function _doWebUpdate(btn) {
  if (btn) { btn.textContent = '⏳...'; btn.disabled = true; }
  var doReload = function () {
    var base = location.href.split('?')[0].split('#')[0];
    location.replace(base + '?v=' + Date.now());
  };
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      Promise.all(regs.map(function (r) { return r.unregister(); })).then(function () {
        caches.keys().then(function (keys) {
          Promise.all(keys.map(function (k) { return caches.delete(k); })).then(doReload);
        });
      });
    }).catch(doReload);
  } else {
    doReload();
  }
}
