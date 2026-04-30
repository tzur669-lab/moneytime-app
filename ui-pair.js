// ---- PAIR MODAL ----
function openPair() {
  const s = D.gs(), cont = document.getElementById('pairCont');
  if (!s.myCode) { const ss = D.gs(); ss.myCode = genCode(); D.ss(ss); }
  const myCode = D.gs().myCode;

  if (s.pairCode) {
    cont.innerHTML = `
    <div class="pair-box"><div class="pair-lbl">הקוד שלי (קבוע)</div><div class="pair-val">${myCode}</div>
    <div class="pair-acts">
      <button class="pair-btn" onclick="navigator.clipboard?.writeText('${myCode}').then(()=>showToast('הועתק!'))">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> העתק
      </button>
    </div></div>
    <div id="qrB" style="display:flex;justify-content:center;padding:10px 0"></div>
    <div class="fg"><label class="fl">השם שלי</label><input type="text" class="fi" id="myNm" value="${s.myName}"></div>
    <div class="fg"><label class="fl">הצבע שלי</label><div style="display:flex;gap:8px;flex-wrap:wrap">${JC.map(cl => '<div class="cdot' + (cl === s.myColor ? ' sel' : '') + '" data-color="' + cl + '" style="background:' + cl + '" onclick="setMC(this.dataset.color,this)"></div>').join('')}</div></div>
    <div class="fg"><label class="fl">שם הפרטנר</label><input type="text" class="fi" id="pNm" value="${s.partnerName}"></div>
    <div class="fg"><label class="fl">צבע הפרטנר</label><div style="display:flex;gap:8px;flex-wrap:wrap">${JC.map(cl => '<div class="cdot' + (cl === s.partnerColor ? ' sel' : '') + '" data-color="' + cl + '" style="background:' + cl + '" onclick="setPC(this.dataset.color,this)"></div>').join('')}</div></div>
    <button class="btn btn-p" onclick="savePairSet()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg> שמור
    </button>
    <button class="btn btn-d" onclick="unpair()" style="margin-top:8px">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> נתק מהזוג
    </button>`;
    setTimeout(() => {
      try { new QRCode(document.getElementById('qrB'), { text: myCode, width: 130, height: 130, colorDark: '#1E3A8A', colorLight: '#fff' }); }
      catch (e) { }
    }, 100);
  } else {
    cont.innerHTML = `
    <p style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.6">העתק את <strong>הקוד</strong> שלך ושלח לפרטנר — הפרטנר יזין אותו ויתחברו.</p>
    <div class="pair-box">
      <div class="pair-lbl">הקוד שלי (קבוע)</div>
      <div class="pair-val" style="font-size:26px;letter-spacing:6px">${myCode}</div>
      <div class="pair-acts">
        <button class="pair-btn" onclick="navigator.clipboard?.writeText('${myCode}').then(()=>showToast('הועתק!'))">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> קוד
        </button>
      </div>
    </div>
    <div class="div"></div>
    <div class="fg"><label class="fl">הזן קוד של הפרטנר (אם הפרטנר שלח לך קוד)</label>
      <input type="text" class="fi" id="pCode" placeholder="קוד 6 ספרות" maxlength="6"
        style="text-align:center;font-size:20px;letter-spacing:8px;font-weight:200;text-transform:uppercase">
    </div>
    <div class="fg"><label class="fl">השם שלי</label><input type="text" class="fi" id="myNmN" placeholder="השם שלך" value="${s.myName}"></div>
    <div class="fg"><label class="fl">שם הפרטנר</label><input type="text" class="fi" id="pNmN" placeholder="שם הפרטנר" value="${s.partnerName}"></div>
    <button class="btn btn-p" onclick="connPair()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> התחבר עכשיו
    </button>`;
  }
  openM('mPair');
}

function genCode() {
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code = '';
  for (var i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function connPair() {
  const pcEl = document.getElementById('pCode');
  const pc = (pcEl ? pcEl.value : '').trim().toUpperCase();
  if (!pc || pc.length < 4) { alert('הזן קוד פרטנר תקין (לפחות 4 תווים)'); return; }
  const s = D.gs();
  if (!s.myCode) { s.myCode = genCode(); }
  const myCode = s.myCode;
  s.pairCode = calcPairCode(myCode, pc);
  s.partnerCode = pc;
  if (!s.myUID) { s.myUID = myCode; }
  var nmEl = document.getElementById('myNmN');
  var pnEl = document.getElementById('pNmN');
  if (nmEl && nmEl.value.trim()) s.myName = nmEl.value.trim();
  if (pnEl && pnEl.value.trim()) s.partnerName = pnEl.value.trim();
  D.ss(s);
  closeM('mPair');
  showToast('מחבר...');
  syncPairToFirebase().then(function () {
    return loadPartnerFromFirebase();
  }).then(function (got) {
    showToast(got ? 'חובר! נטענו נתוני פרטנר' : 'חובר! ממתין לפרטנר...');
    var gid = D.gs().googleId;
    if (gid) _savePairByGoogleId(gid);
    _navToCouple();
    renderCouple();
  }).catch(function () { showToast('חובר לזוג'); _navToCouple(); renderCouple(); });
}

function savePairSet() {
  const s = D.gs();
  s.myName = document.getElementById('myNm')?.value || 'אני';
  s.partnerName = document.getElementById('pNm')?.value || 'פרטנר';
  D.ss(s); closeM('mPair'); renderCouple(); flash(); vib();
}

function setMC(c, el) {
  el.closest('div').querySelectorAll('.cdot').forEach(d => d.classList.remove('sel'));
  el.classList.add('sel');
  const s = D.gs(); s.myColor = c; D.ss(s);
}

function setPC(c, el) {
  el.closest('div').querySelectorAll('.cdot').forEach(d => d.classList.remove('sel'));
  el.classList.add('sel');
  const s = D.gs(); s.partnerColor = c; D.ss(s);
}

function unpair() {
  if (confirm('לנתק מהזוג?')) {
    const s = D.gs(); s.pairCode = null; s.partnerCode = null; D.ss(s);
    localStorage.removeItem('pd'); closeM('mPair'); renderCouple();
  }
}

// ---- PAIR HELPERS ----
function checkPairLink() {
  try {
    const params = new URLSearchParams(window.location.search);
    let partnerCode = params.get('pair');
    if (!partnerCode) partnerCode = sessionStorage.getItem('pendingPair');
    if (!partnerCode) {
      const s = D.gs();
      if (s.myCode && !s.pairCode) {
        restorePairFromCloud().then(function (restored) {
          if (restored) { renderCouple(); renderSettings(); showToast('חיבור זוג שוחזר ✅'); }
        });
      }
      return;
    }
    history.replaceState(null, '', location.pathname);
    sessionStorage.removeItem('pendingPair');
    const s = D.gs();
    const pc = partnerCode.toUpperCase();
    if (s.pairCode && s.partnerCode === pc) { setTimeout(function () { _navToCouple(); renderCouple(); }, 300); return; }
    setTimeout(function () { _navToCouple(); }, 200);
  } catch (e) { console.error('checkPairLink', e); }
}

function _navToCouple() {
  var btns = document.querySelectorAll('.ni');
  var coupleBtn = btns[2] || null;
  if (coupleBtn) swPage('couple', coupleBtn);
}

function doConnectFromCouplePage() {
  var pc = (document.getElementById('cplPairCode') || {}).value || '';
  pc = pc.trim().toUpperCase();
  if (!pc || pc.length < 3) { alert('קוד פרטנר לא תקין'); return; }
  var s = D.gs();
  if (!s.myCode) { s.myCode = genCode(); }
  s.pairCode = calcPairCode(s.myCode, pc);
  s.partnerCode = pc;
  s.myUID = s.myCode;
  var nm = (document.getElementById('cplMyName') || {}).value || '';
  var pn = (document.getElementById('cplPartnerName') || {}).value || '';
  if (nm.trim()) s.myName = nm.trim();
  if (pn.trim()) s.partnerName = pn.trim();
  D.ss(s);
  sessionStorage.removeItem('pendingPair');
  showToast('מחבר...');
  syncPairToFirebase().then(function () {
    return loadPartnerFromFirebase();
  }).then(function (got) {
    showToast(got ? 'חובר! נטענו נתוני פרטנר' : 'חובר! ממתין לפרטנר...');
    renderCouple();
  }).catch(function () { showToast('חובר לזוג'); renderCouple(); });
}

function doCancelPairConnect() {
  sessionStorage.removeItem('pendingPair');
  renderCouple();
}
