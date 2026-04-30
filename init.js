// ---- KEYBOARD ----
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.modal.active').forEach(m=>m.classList.remove('active'));
  if(e.key==='Enter'&&document.getElementById('mDay').classList.contains('active'))saveDay();
});

// ---- PWA ----
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();dProm=e;document.getElementById('instBanner').classList.add('show');});
document.getElementById('instBtn').addEventListener('click',async()=>{if(dProm){dProm.prompt();const{outcome}=await dProm.userChoice;if(outcome==='accepted')document.getElementById('instBanner').classList.remove('show');dProm=null;}});
window.addEventListener('appinstalled',()=>document.getElementById('instBanner').classList.remove('show'));
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

// ---- INIT ----
document.addEventListener('DOMContentLoaded',()=>{
  const s=D.gs();
  if(s.theme==='dark')toggleTheme(true);
  if(!s.myUID){
    s.myUID=Math.random().toString(36).substring(2,10);
    var defColors=['#10B981','#F59E0B','#8B5CF6','#EF4444','#0EA5E9','#EC4899'];
    if(s.myColor==='#1E3A8A'||!s.myColor){
      s.myColor=defColors[Math.floor(Math.random()*defColors.length)];
    }
    D.ss(s);
  }
  const savedColor=D.gs().colorTheme||'blue';
  applyColorTheme(savedColor);
  // שחזר תצוגת יומן שמורה
  _calView=localStorage.getItem('calView')||'month';
  ['month','week','day'].forEach(function(k){
    var el=document.getElementById('cvp-'+k);
    if(el)el.classList.toggle('active',k===_calView);
  });
  initClock();renderCal();setSyncDot(false);initGD();checkPairLink();
  // נקה tokens ישנים מ-Firebase (אחת לכמה שעות)
  _cleanupOldTokens();
  // בדוק אם מישהו חיבר אותנו — 4 שניות אחרי טעינה
  setTimeout(function(){
    const _s=D.gs();
    if(_s.myCode&&!_s.pairCode) autoDetectIncomingPair();
  },4000);
  // הצג מייל יצירת קשר
  (function(){
    var u='tzur669',d='gmail.com';
    var el=document.getElementById('contactMailTxt');
    if(el)el.textContent=u+'@'+d;
    var lnk=document.getElementById('contactMailLink');
    if(lnk)lnk.href='mailto:'+u+'@'+d;
  })();
  // בדיקת עדכון — בדפדפן: 3 שניות. APK: 6 שניות + backup ב-15 שניות
  setTimeout(checkAppUpdate, window.Capacitor ? 6000 : 3000);
  if(window.Capacitor) setTimeout(function(){ if(!_updShown&&_updRetryCount===0) checkAppUpdate(); }, 15000);
  document.addEventListener('resume',function(){setTimeout(checkAppUpdate,2000);});
  document.addEventListener('resume',function(){
    const _s=D.gs();
    if(_s.myCode&&!_s.pairCode) setTimeout(autoDetectIncomingPair,1500);
  });
});
