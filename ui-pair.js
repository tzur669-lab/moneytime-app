// ---- PAIR MODAL ----
function openPair(){
  const s=D.gs(),cont=document.getElementById('pairCont');
  if(!s.myCode){const ss=D.gs();ss.myCode=genCode();D.ss(ss);}
  const myCode=D.gs().myCode;


  if(s.pairCode){
    cont.innerHTML=`
    <div class="pair-box"><div class="pair-lbl">הקוד שלי (קבוע)</div><div class="pair-val">${myCode}</div>
    <div class="pair-acts">
      <button class="pair-btn" onclick="navigator.clipboard?.writeText('${myCode}').then(()=>showToast('הועתק!'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> העתק</button>
    </div></div>
    <div id="qrB" style="display:flex;justify-content:center;padding:10px 0"></div>
    <div class="fg"><label class="fl">השם שלי</label><input type="text" class="fi" id="myNm" value="${s.myName}"></div>
    <div class="fg"><label class="fl">הצבע שלי</label><div style="display:flex;gap:8px;flex-wrap:wrap">${JC.map(cl=>'<div class="cdot'+(cl===s.myColor?' sel':'')+'" data-color="'+cl+'" style="background:'+cl+'" onclick="setMC(this.dataset.color,this)"></div>').join('')}</div></div>
    <div class="fg"><label class="fl">שם הפרטנר</label><input type="text" class="fi" id="pNm" value="${s.partnerName}"></div>
    <div class="fg"><label class="fl">צבע הפרטנר</label><div style="display:flex;gap:8px;flex-wrap:wrap">${JC.map(cl=>'<div class="cdot'+(cl===s.partnerColor?' sel':'')+'" data-color="'+cl+'" style="background:'+cl+'" onclick="setPC(this.dataset.color,this)"></div>').join('')}</div></div>
    <button class="btn btn-p" onclick="savePairSet()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/></svg> שמור</button>
    <button class="btn btn-d" onclick="unpair()" style="margin-top:8px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg> נתק מהזוג</button>`;
    setTimeout(()=>{try{new QRCode(document.getElementById('qrB'),{text:myCode,width:130,height:130,colorDark:'#1E3A8A',colorLight:'#fff'});}catch(e){}},100);
  } else {
    cont.innerHTML=`
    <p style="font-size:13px;color:var(--t2);margin-bottom:14px;line-height:1.6">העתק את <strong>הקוד</strong> שלך ושלח לפרטנר — הפרטנר יזין אותו ויתחברו.</p>
    <div class="pair-box">
      <div class="pair-lbl">הקוד שלי (קבוע)</div>
      <div class="pair-val" style="font-size:26px;letter-spacing:6px">${myCode}</div>
      <div class="pair-acts">
        <button class="pair-btn" onclick="navigator.clipboard?.writeText('${myCode}').then(()=>showToast('הועתק!'))"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> קוד</button>
      </div>
    </div>
    <div class="div"></div>
    <div class="fg"><label class="fl">הזן קוד של הפרטנר (אם הפרטנר שלח לך קוד)</label><input type="text" class="fi" id="pCode" placeholder="קוד 6 ספרות" maxlength="6" style="text-align:center;font-size:20px;letter-spacing:8px;font-weight:200;text-transform:uppercase"></div>
    <div class="fg"><label class="fl">השם שלי</label><input type="text" class="fi" id="myNmN" placeholder="השם שלך" value="${s.myName}"></div>
    <div class="fg"><label class="fl">שם הפרטנר</label><input type="text" class="fi" id="pNmN" placeholder="שם הפרטנר" value="${s.partnerName}"></div>
    <button class="btn btn-p" onclick="connPair()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> התחבר עכשיו</button>`;
  }
  openM('mPair');
}
function genCode(){
  var chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  var code='';
  for(var i=0;i<6;i++)code+=chars[Math.floor(Math.random()*chars.length)];
  return code;
}
function connPair(){
  const pcEl=document.getElementById('pCode');
  const pc=(pcEl?pcEl.value:'').trim().toUpperCase();
  if(!pc||pc.length<4){alert('הזן קוד פרטנר תקין (לפחות 4 תווים)');return;}
  const s=D.gs();
  if(!s.myCode){s.myCode=genCode();}
  const myCode=s.myCode;
  // pairCode תמיד מחושב לפי myCode בלבד — לא googleId
  // כך זה עקבי בכל מכשיר ובכל דפדפן
  s.pairCode=calcPairCode(myCode,pc);
  s.partnerCode=pc;
  if(!s.myUID){s.myUID=myCode;}
  var nmEl=document.getElementById('myNmN');
  var pnEl=document.getElementById('pNmN');
  if(nmEl&&nmEl.value.trim())s.myName=nmEl.value.trim();
  if(pnEl&&pnEl.value.trim())s.partnerName=pnEl.value.trim();
  D.ss(s);
  closeM('mPair');
  showToast('מחבר...');
  syncPairToFirebase().then(function(){
    return loadPartnerFromFirebase();
  }).then(function(got){
    showToast(got?'חובר! נטענו נתוני פרטנר':'חובר! ממתין לפרטנר...');
    // שמור חיבור זוג לפי Google ID כדי לשחזר במכשירים אחרים
    var gid=D.gs().googleId;
    if(gid)_savePairByGoogleId(gid);
    _navToCouple();
    renderCouple();
  }).catch(function(){
    showToast('חובר לזוג');
    _navToCouple();
    renderCouple();
  });
}
function savePairSet(){const s=D.gs();s.myName=document.getElementById('myNm')?.value||'אני';s.partnerName=document.getElementById('pNm')?.value||'פרטנר';D.ss(s);closeM('mPair');renderCouple();flash();vib();}
function setMC(c,el){el.closest('div').querySelectorAll('.cdot').forEach(d=>d.classList.remove('sel'));el.classList.add('sel');const s=D.gs();s.myColor=c;D.ss(s);}
function setPC(c,el){el.closest('div').querySelectorAll('.cdot').forEach(d=>d.classList.remove('sel'));el.classList.add('sel');const s=D.gs();s.partnerColor=c;D.ss(s);}
function unpair(){if(confirm('לנתק מהזוג?')){const s=D.gs();s.pairCode=null;s.partnerCode=null;D.ss(s);localStorage.removeItem('pd');closeM('mPair');renderCouple();}}


// ---- AUTO UPDATE ----
const APP_VERSION='2.1.315';
const APP_BUILD=315; // CI מחליף בכל build
const LIVE_URL='https://tzur669-lab.github.io/moneytime-app/';
const VER_FB_URL='https://moneytime-app-f5a15-default-rtdb.firebaseio.com/appVersion.json';const GITHUB_APK_BASE='https://github.com/tzur669-lab/moneytime-app/releases/download';
const GITHUB_RELEASES='https://github.com/tzur669-lab/moneytime-app/releases/latest';
let _updShown=false;
let _updApkUrl='';
let _updAvailBuild=0;
let _updAvailVer='';
let _updRetryCount=0;
const _UPD_MAX_RETRY=5;
const _UPD_RETRY_DELAYS=[15000,30000,60000,120000,300000];

function _getInstalledBuild(){
  // תמיד משווים מול APP_BUILD הנוכחי — לא תלויים ב-localStorage
  return APP_BUILD;
}
function _markInstalled(buildNum){try{localStorage.setItem('installedBuild',String(buildNum));}catch(e){}}

async function checkAppUpdate(){
  if(_updShown)return;
  try{
    const r=await fetch(VER_FB_URL+'?nc='+Date.now(),{method:'GET',cache:'no-store',headers:{'Accept':'application/json'}});
    if(!r.ok){
      if(r.status===401||r.status===403){console.warn('[Update] Firebase blocked ('+r.status+').');return;}
      _scheduleUpdRetry();return;
    }
    const data=await r.json();
    if(!data||!data.build)return;
    _updRetryCount=0;
    const remoteBuild=parseInt(data.build,10)||0;
    const installedBuild=_getInstalledBuild();
    const isApk=!!window.Capacitor;
    // בדפדפן: הSW מטפל בעדכון אוטומטית — לא מציגים באנר
    if(!isApk)return;
    const hasUpdate=remoteBuild>installedBuild;
    if(hasUpdate){
      _updAvailBuild=remoteBuild;
      _updAvailVer=data.version||('build '+remoteBuild);
      _updApkUrl=GITHUB_APK_BASE+'/v'+remoteBuild+'/moneytime-pro.apk';
      _showUpdBanner(_updAvailVer,data.notes||'');
    }
  }catch(e){
    console.warn('[Update] Network error:',e.message);
    _scheduleUpdRetry();
  }
}

function _scheduleUpdRetry(){
  if(_updShown||_updRetryCount>=_UPD_MAX_RETRY)return;
  const delay=_UPD_RETRY_DELAYS[_updRetryCount]||300000;
  _updRetryCount++;
  setTimeout(checkAppUpdate,delay);
}

function _verIsNewer(remote,local){
  const r=String(remote).split('.').map(Number);
  const l=String(local).split('.').map(Number);
  for(let i=0;i<3;i++){
    if((r[i]||0)>(l[i]||0))return true;
    if((r[i]||0)<(l[i]||0))return false;
  }
  return false;
}

function _showUpdBanner(ver,notes){
  if(_updShown)return;
  _updShown=true;
  // עדכן את אזור ההגדרות
  _setUpdSettingsState('available', ver, notes);
  // הצג באנר קטן פעם אחת בלבד
  const old=document.getElementById('updBanner');
  if(old)old.remove();
  const el=document.createElement('div');
  el.id='updBanner';
  el.className='upd-banner';
  el.innerHTML=`
    <div class="upd-ico" style="font-size:16px">🔄</div>
    <div class="upd-txt" style="flex:1;min-width:0">
      <div class="upd-ttl" style="font-size:12px">גרסה ${ver} זמינה</div>
    </div>
    <button class="upd-btn" style="font-size:10px;padding:5px 10px" onclick="swPage('set',document.querySelector('.ni:last-child'));document.getElementById('updBanner')?.remove()">פרטים</button>
    <button class="upd-x" onclick="document.getElementById('updBanner')?.remove()">×</button>`;
  document.body.appendChild(el);
  // הסר אוטומטית אחרי 8 שניות
  setTimeout(()=>{ const b=document.getElementById('updBanner'); if(b)b.remove(); }, 8000);
}

function _setUpdSettingsState(state,ver,notes){
  const btn=document.getElementById('updSetBtn');
  const status=document.getElementById('updSetStatus');
  const sub=document.getElementById('updSetSub');
  const verEl=document.getElementById('updSetVer');
  const isApkCtx=!!window.Capacitor;
  const dispVer=isApkCtx&&APP_BUILD>0?(APP_VERSION+' (build '+APP_BUILD+')'):APP_VERSION;
  if(verEl)verEl.textContent=dispVer;
  if(state==='available'){
    if(status)status.innerHTML='גרסה נוכחית: <span id="updSetVer">'+dispVer+'</span> <span style="color:var(--g);font-size:11px;margin-right:6px">← '+ver+' זמינה</span>';
    if(sub)sub.textContent=notes||'עדכון חדש עם שיפורים';
    if(btn){
      btn.textContent='עדכן עכשיו';btn.style.background='var(--g)';btn.style.color='#fff';btn.style.border='none';btn.disabled=false;
      btn.onclick=function(){if(!!window.Capacitor){_askApkUpdate(btn);}else{_doWebUpdate(btn);}};
    }
  } else if(state==='checking'){
    if(btn){btn.textContent='בודק...';btn.disabled=true;}
    if(sub)sub.textContent='בודק אם יש עדכון...';
  } else if(state==='latest'){
    if(btn){btn.textContent='עדכני ✓';btn.disabled=false;btn.style.background='';btn.style.color='';btn.style.border='';btn.onclick=function(){_checkUpdateFromSettings(btn);};}
    if(sub)sub.textContent='הגרסה האחרונה מותקנת';
  }
}

async function _checkUpdateFromSettings(btn){
  _setUpdSettingsState('checking');
  try{
    const r=await fetch(VER_FB_URL+'?nc='+Date.now(),{method:'GET',cache:'no-store',headers:{'Accept':'application/json'}});
    if(!r.ok){_setUpdSettingsState('latest');return;}
    const data=await r.json();
    if(!data||!data.build){_setUpdSettingsState('latest');return;}
    const remoteBuild=parseInt(data.build,10)||0;
    const installedBuild=_getInstalledBuild();
    const isApk=!!window.Capacitor;
    // בדפדפן: השוואת גרסאות רגילה (APP_BUILD=0 בדפדפן)
    const hasUpdate=isApk?(remoteBuild>installedBuild):_verIsNewer(data.version||'',APP_VERSION);
    if(hasUpdate){
      _updAvailBuild=remoteBuild;
      _updAvailVer=data.version||('build '+remoteBuild);
      _updApkUrl=GITHUB_APK_BASE+'/v'+remoteBuild+'/moneytime-pro.apk';
      _setUpdSettingsState('available',_updAvailVer,data.notes||'');
    } else {
      _setUpdSettingsState('latest');
    }
  }catch(e){
    _setUpdSettingsState('latest');
  }
}

// --- עדכון ב-APK ---
function _askApkUpdate(btn){
  if(btn){btn.disabled=true;}
  const dlg=document.createElement('div');
  dlg.id='updDlg';
  dlg.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px';
  dlg.innerHTML='<div style="background:#1E293B;border-radius:18px;padding:28px 24px;max-width:320px;width:100%;border:1px solid #334155;text-align:center"><div style="font-size:36px;margin-bottom:12px">🔄</div><div style="font-size:16px;font-weight:600;color:#F1F5F9;margin-bottom:8px">עדכון זמין</div><div style="font-size:13px;color:#94A3B8;margin-bottom:24px">האם לעדכן את האפליקציה עכשיו?<br>הנתונים שלך יישמרו.</div><div style="display:flex;gap:10px;justify-content:center"><button onclick="_cancelApkUpdate()" style="background:#334155;border:none;color:#94A3B8;padding:12px 24px;border-radius:10px;font-size:14px;cursor:pointer;font-family:inherit">לא עכשיו</button><button id="updYesBtn" onclick="_doApkUpdate()" style="background:#2563EB;border:none;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit">עדכן ✓</button></div></div>';
  document.body.appendChild(dlg);
}

function _cancelApkUpdate(){
  var dlg=document.getElementById('updDlg');if(dlg)dlg.remove();
  var btn=document.getElementById('updSetBtn');if(btn){btn.disabled=false;}
}

async function _doApkUpdate(){
  document.getElementById('updDlg')?.remove();
  document.getElementById('updBanner')?.remove();
  // הוסרה קריאת _markInstalled — האפליקציה תמיד תשווה APP_BUILD מול Firebase
  const apkUrl=_updApkUrl||GITHUB_RELEASES;
  const browser=await _waitForCapBrowser(4000);
  if(browser){
    try{await browser.open({url:apkUrl});}
    catch(e){try{window.open(apkUrl,'_blank');}catch(e2){}}
  } else {
    try{window.open(apkUrl,'_blank');}catch(e){}
  }
  setTimeout(function(){
    const note=document.createElement('div');
    note.id='updNote';
    note.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#1E293B;border:1px solid #334155;border-radius:14px;padding:16px 20px;z-index:9999;max-width:300px;width:90%;text-align:center;font-size:13px;color:#94A3B8;line-height:1.6';
    note.innerHTML='<div style="font-size:18px;margin-bottom:8px">📲</div><strong style="color:#F1F5F9">הורדה נפתחה בדפדפן</strong><br>לאחר ההורדה — פתח את הקובץ מהתראות הפלאפון.<br><span style="font-size:11px">אם תישאל על \'מקורות לא ידועים\' — אשר.</span><br><br><button onclick="document.getElementById(\'updNote\').remove()" style="background:#2563EB;border:none;color:#fff;padding:8px 20px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit">הבנתי</button>';
    document.body.appendChild(note);
    setTimeout(function(){var n=document.getElementById('updNote');if(n)n.remove();},15000);
  },500);
}
// --- עדכון בדפדפן רגיל: נקה cache ורענן ---
function _doWebUpdate(btn){
  if(btn){btn.textContent='⏳...';btn.disabled=true;}
  var doReload=function(){
    // ניווט עם ?v=timestamp מאלץ את הדפדפן לטעון מהשרת ולא מה-cache
    var base=location.href.split('?')[0].split('#')[0];
    location.replace(base+'?v='+Date.now());
  };
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(function(regs){
      Promise.all(regs.map(function(r){return r.unregister();})).then(function(){
        caches.keys().then(function(keys){
          Promise.all(keys.map(function(k){return caches.delete(k);})).then(doReload);
        });
      });
    }).catch(doReload);
  } else {
    doReload();
  }
}

// ---- CLOCK ----
function initClock(){
  if(localStorage.getItem('cit')){
    tInt=setInterval(tickC,1000);tickC();
    const b=document.getElementById('clkBtn');
    b.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> סיום`;b.className='btn-clk on';
    document.getElementById('clkTime').classList.add('on');
    const icon=document.getElementById('clkIcon');if(icon)icon.textContent='⏺';
  }
}
function tickC(){
  const s=parseInt(localStorage.getItem('cit'));if(!s)return;
  const d=Math.floor((Date.now()-s)/1000);
  document.getElementById('clkTime').textContent=`${String(Math.floor(d/3600)).padStart(2,'0')}:${String(Math.floor(d%3600/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
  const circ=201,maxSec=8*3600;
  const pct=Math.min(d/maxSec,1);
  const ring=document.getElementById('clkRing');
  if(ring)ring.style.strokeDashoffset=String(Math.round(circ-(circ*pct)));
}
function handleClock(){
  vib();
  if(localStorage.getItem('cit')){
    clearInterval(tInt);const diff=(Date.now()-parseInt(localStorage.getItem('cit')))/3600000;
    localStorage.removeItem('cit');
    const b=document.getElementById('clkBtn');b.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21"/></svg> התחל`;b.className='btn-clk';
    document.getElementById('clkTime').textContent='00:00:00';
    document.getElementById('clkTime').classList.remove('on');
    const ring=document.getElementById('clkRing');if(ring)ring.style.strokeDashoffset='201';
    const icon=document.getElementById('clkIcon');if(icon)icon.textContent='⏱';
    openDay(fk(new Date()));setTimeout(()=>{document.getElementById('dH').value=diff.toFixed(2);},100);
  } else {
    localStorage.setItem('cit',Date.now());tInt=setInterval(tickC,1000);
    const b=document.getElementById('clkBtn');b.innerHTML=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> סיום`;b.className='btn-clk on';
    document.getElementById('clkTime').classList.add('on');
    const icon=document.getElementById('clkIcon');if(icon)icon.textContent='⏺';
    tickC();
  }
}

// ---- GOOGLE DRIVE ----
function checkPairLink(){
  try{
    const params=new URLSearchParams(window.location.search);
    let partnerCode=params.get('pair');
    if(!partnerCode)partnerCode=sessionStorage.getItem('pendingPair');
    if(!partnerCode){
      // אין קישור זוג — נסה לשחזר חיבור קיים מה-cloud
      const s=D.gs();
      if(s.myCode&&!s.pairCode){
        restorePairFromCloud().then(function(restored){
          if(restored){renderCouple();renderSettings();showToast('חיבור זוג שוחזר ✅');}
        });
      }
      return;
    }
    history.replaceState(null,'',location.pathname);
    sessionStorage.removeItem('pendingPair');
    const s=D.gs();
    const pc=partnerCode.toUpperCase();
    if(s.pairCode&&s.partnerCode===pc){
      setTimeout(function(){_navToCouple();renderCouple();},300);
      return;
    }
    setTimeout(function(){_navToCouple();},200);
  }catch(e){console.error('checkPairLink',e);}
}

function _navToCouple(){
  var btns=document.querySelectorAll('.ni');
  var coupleBtn=btns[2]||null;
  if(coupleBtn)swPage('couple',coupleBtn);
}


// ---- PDF ----
function tpdf(id){const el=document.getElementById(id);el.classList.toggle('on');el.textContent=el.classList.contains('on')?'✓':'';}
function txlsx(id){const el=document.getElementById(id);el.classList.toggle('on');el.textContent=el.classList.contains('on')?'✓':'';}
function genPDF(){
  if(!window.jspdf && !window.jsPDF){
    var sc=document.createElement('script');
    sc.src='https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    sc.onload=function(){_buildPDF();};
    sc.onerror=function(){_buildPDF();};
    document.head.appendChild(sc);
    showToast('טוען...');
    return;
  }
  _buildPDF();
}

function _buildPDF(){
  try{
    var pr=document.getElementById('pdfPer').value;
    var dates;
    if(pr==='all'){
      var allK=Object.keys(D.g()).sort();
      if(!allK.length){showToast('אין נתונים');return;}
      dates=[];
      var s0=new Date(allK[0]),e0=new Date(allK[allK.length-1]);
      for(var d0=new Date(s0);d0<=e0;d0.setDate(d0.getDate()+1))dates.push(new Date(d0));
    }else{
      dates=getDts(pr,'pdfS','pdfE');
    }
    var data=D.g(), s=D.gs(), pd=D.gp();
    var name=document.getElementById('pdfNm').value||s.myName||'דוח';
    var iH=document.getElementById('po1').classList.contains('on');
    var iR=document.getElementById('po2').classList.contains('on');
    var iN=document.getElementById('po4').classList.contains('on');
    var iP=document.getElementById('po5').classList.contains('on')&&s.pairCode;
    var today=new Date().toLocaleDateString('he-IL');
    var th=0,tp=0,ptp=0;

    var rows='';
    dates.forEach(function(d){
      var k=fk(d);
      if(!(data[k]&&data[k].hours>0))return;
      var pp=cp(data[k].hours,data[k].rate,data[k].bonuses);
      th+=data[k].hours; tp+=pp.total;
      var row='<tr>';
      row+='<td>'+k+'</td>';
      if(iH)row+='<td>'+data[k].hours.toFixed(1)+'</td>';
      if(iR)row+='<td>'+data[k].rate+'</td>';
      row+='<td><strong>'+Math.round(pp.total).toLocaleString('he-IL')+'</strong></td>';
      if(iN)row+='<td>'+(data[k].note||'')+'</td>';
      if(iP){
        var pp3=pd[k];
        if(pp3&&pp3.hours>0){var pr3=cp(pp3.hours,pp3.rate||50,pp3.bonuses);ptp+=pr3.total;row+='<td>'+Math.round(pr3.total).toLocaleString('he-IL')+'</td>';}
        else row+='<td>-</td>';
      }
      row+='</tr>';
      rows+=row;
    });

    var headers='<th>תאריך</th>';
    if(iH)headers+='<th>שעות</th>';
    if(iR)headers+='<th>תעריף</th>';
    headers+='<th>סה"כ ₪</th>';
    if(iN)headers+='<th>הערה</th>';
    if(iP)headers+='<th>פרטנר ₪</th>';

    var summary='סה"כ: '+th.toFixed(1)+' שעות | '+name+': ₪'+Math.round(tp).toLocaleString('he-IL');
    if(iP)summary+=' | פרטנר: ₪'+Math.round(ptp).toLocaleString('he-IL')+' | יחד: ₪'+Math.round(tp+ptp).toLocaleString('he-IL');

    var html='<!DOCTYPE html><html dir="rtl" lang="he"><head><meta charset="UTF-8">'
      +'<meta name="viewport" content="width=device-width,initial-scale=1">'
      +'<title>דוח שעות - '+name+'</title>'
      +'<style>'
      +'*{margin:0;padding:0;box-sizing:border-box}'
      +'body{font-family:Arial,sans-serif;padding:20px;color:#0F172A;direction:rtl}'
      +'.header{background:#1E3A8A;color:#fff;padding:20px;border-radius:12px;margin-bottom:20px;text-align:center}'
      +'.header h1{font-size:22px;margin-bottom:4px}'
      +'.header p{font-size:13px;opacity:.8}'
      +'table{width:100%;border-collapse:collapse;margin-bottom:20px}'
      +'th{background:#DBEAFE;color:#1E3A8A;padding:10px 8px;text-align:right;font-size:13px}'
      +'td{padding:9px 8px;border-bottom:1px solid #E2E8F0;font-size:13px}'
      +'tr:nth-child(even){background:#F8FAFF}'
      +'.summary{background:#1E3A8A;color:#fff;padding:14px 20px;border-radius:10px;text-align:center;font-size:14px;font-weight:bold}'
      +'@media print{.no-print{display:none}}'
      +'</style></head><body>'
      +'<div class="header"><h1>דוח שעות עבודה</h1><p>'+name+' | '+today+'</p></div>'
      +'<table><thead><tr>'+headers+'</tr></thead><tbody>'+rows+'</tbody></table>'
      +'<div class="summary">'+summary+'</div>'
      +'<p style="text-align:center;font-size:10px;color:#94A3B8;padding:8px">tzur669@gmail.com</p></body></html>';

    closeM('mPDF');
    vib();
    _showReportInApp(html, 'pdf');
  }catch(e){
    console.error('PDF error:',e);
    alert('שגיאה: '+e.message);
  }
}

function _showReportInApp(html, type){
  _saveToReportHistory(html, type||'pdf');
  var existing=document.getElementById('reportOverlay');
  if(existing)existing.remove();

  var overlay=document.createElement('div');
  overlay.id='reportOverlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:9999;background:#fff;display:flex;flex-direction:column;overflow:hidden';

  var topbar=document.createElement('div');
  topbar.style.cssText='background:#1E3A8A;color:#fff;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;gap:8px';

  var title=document.createElement('span');
  title.style.cssText='font-size:14px;font-weight:400;flex:1';
  title.textContent='דוח שעות';

  var btnShare=document.createElement('button');
  btnShare.style.cssText='background:rgba(255,255,255,.22);border:none;color:#fff;padding:9px 16px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnShare.innerHTML='📤 שתף';

  var btnClose=document.createElement('button');
  btnClose.style.cssText='background:rgba(239,68,68,.8);border:none;color:#fff;padding:9px 14px;border-radius:8px;font-size:13px;font-weight:400;cursor:pointer;white-space:nowrap';
  btnClose.innerHTML='✕ סגור';

  topbar.appendChild(title);
  topbar.appendChild(btnShare);
  topbar.appendChild(btnClose);

  var frame=document.createElement('iframe');
  frame.id='rFrame';
  frame.style.cssText='flex:1;border:none;width:100%;background:#fff';

  overlay.appendChild(topbar);
  overlay.appendChild(frame);
  document.body.appendChild(overlay);

  btnClose.addEventListener('click', function(){
    var el=document.getElementById('reportOverlay');
    if(el)el.remove();
  });

  // שמור HTML לשיתוף
  _pdfHtml=html;

  btnShare.addEventListener('click', function(){
    var blob=new Blob([_pdfHtml],{type:'text/html;charset=utf-8'});
    var fileName='hours_report_'+new Date().toISOString().slice(0,10)+'.html';
    _shareFile(blob, fileName);
  });

  try{
    frame.contentDocument.open();
    frame.contentDocument.write(html);
    frame.contentDocument.close();
  }catch(e){
    frame.srcdoc=html;
  }
}
var _pdfHtml='';

// ---- SHARE FUNCTIONS (תמיד שיתוף, אף פעם לא הורדה) ----

// המרת Blob ל-base64
function _blobToBase64(blob){
  return new Promise(function(resolve, reject){
    var reader = new FileReader();
    reader.onloadend = function(){ resolve(reader.result.split(',')[1]); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// פונקציה ראשית — תמיד שיתוף
async function _shareFile(blob, fileName){
  // נסה Capacitor Share (APK)
  if(window.CapFS && window.CapShare){
    try{
      var b64 = await _blobToBase64(blob);
      await window.CapFS.writeFile({
        path: fileName,
        data: b64,
        directory: 'CACHE',
        recursive: true
      });
      var uriRes = await window.CapFS.getUri({
        path: fileName,
        directory: 'CACHE'
      });
      await window.CapShare.share({
        title: fileName,
        url: uriRes.uri,
        dialogTitle: 'שתף דוח'
      });
      return;
    }catch(e){
      console.log('Capacitor share failed:', e);
    }
  }

  // נסה Web Share API עם קובץ (Chrome Android, Safari iOS)
  try{
    var file = new File([blob], fileName, {type: blob.type || 'application/octet-stream'});
    if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({
        files: [file],
        title: fileName
      });
      return;
    }
  }catch(e){
    if(e.name === 'AbortError') return; // המשתמש ביטל — זה תקין
    console.log('Web Share with file failed:', e);
  }

  // נסה Web Share API ללא קובץ (טקסט בלבד)
  try{
    if(navigator.share){
      await navigator.share({
        title: 'דוח שעות עבודה',
        text: 'הדוח מוכן לשיתוף'
      });
      return;
    }
  }catch(e){
    if(e.name === 'AbortError') return;
  }

  // fallback אחרון — clipboard
  try{
    // נסה להעתיק את תוכן ה-HTML כטקסט
    if(navigator.clipboard){
      await navigator.clipboard.writeText('הדוח מוכן. פתח את האפליקציה לצפייה.');
      showToast('הדוח מוכן לצפייה בתוך האפליקציה');
      return;
    }
  }catch(e){}

  showToast('שיתוף אינו נתמך בדפדפן זה');
}

// עדכון: expJSON, expCSV, expXLSX משתמשים ב-_shareFile
// ---- PAIR HELPERS ----

function doConnectFromCouplePage(){
  var pc=(document.getElementById('cplPairCode')||{}).value||'';
  pc=pc.trim().toUpperCase();
  if(!pc||pc.length<3){alert('קוד פרטנר לא תקין');return;}
  var s=D.gs();
  if(!s.myCode){s.myCode=genCode();}
  s.pairCode=calcPairCode(s.myCode,pc);
  s.partnerCode=pc;
  s.myUID=s.myCode;
  var nm=(document.getElementById('cplMyName')||{}).value||'';
  var pn=(document.getElementById('cplPartnerName')||{}).value||'';
  if(nm.trim())s.myName=nm.trim();
  if(pn.trim())s.partnerName=pn.trim();
  D.ss(s);
  sessionStorage.removeItem('pendingPair');
  showToast('מחבר...');
  syncPairToFirebase().then(function(){
    return loadPartnerFromFirebase();
  }).then(function(got){
    showToast(got?'חובר! נטענו נתוני פרטנר':'חובר! ממתין לפרטנר...');
    renderCouple();
  }).catch(function(){showToast('חובר לזוג');renderCouple();});
}

function doCancelPairConnect(){
  sessionStorage.removeItem('pendingPair');
  renderCouple();
}
