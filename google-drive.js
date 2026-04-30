function initGD(){
  handleOAuthReturn();
  
  // הוסף listener ל-postMessage מ-callback popup
  window.addEventListener('message', function(e){
    // אבטחה - רק מהדומיין שלנו
    if(e.origin !== 'https://tzur669-lab.github.io' && 
       e.origin !== window.location.origin) return;
    
    if(e.data && e.data.type === 'oauth_token' && e.data.token){
      _onTokenReceived(e.data.token);
      showToast('✅ חובר ל-Google Drive בהצלחה!');
    }
  });
  
  const saved=localStorage.getItem('gtoken');
  if(saved){
    aToken=saved;
    fetch('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+saved)
      .then(r=>r.json())
      .then(info=>{
        if(info.error){
          localStorage.removeItem('gtoken');localStorage.removeItem('syen');
          aToken=null;setSyncDot(false);renderSettings();
        } else {
          fetchEmail().then(()=>{
            renderSettings();
            setSyncDot(true);
            loadDr();
            _countUniqueUser();
            // סנכרן זוג מחדש ל-Firebase בכל פתיחה
            const _s=D.gs();
            if(_s.pairCode&&_s.myCode) syncPairToFirebase().catch(()=>{});
          });
        }
      }).catch(()=>{fetchEmail().then(()=>{renderSettings();setSyncDot(true);});});
  }
  document.getElementById('authBtn').onclick=()=>{vib();startGoogleAuth();};
}

function startGoogleAuth(){
  // יצירת state ייחודי למשתמש (לזיהוי במערכת הכפולה)
  var uid = localStorage.getItem('gdk') || localStorage.getItem('myUID') || ('anon-' + Date.now() + '-' + Math.random().toString(36).substring(2,8));
  if(!localStorage.getItem('gdk')) localStorage.setItem('gdk', uid);
  var state = btoa(uid).replace(/[=+/]/g, '');
  
  // ברירת המחדל: הכתובת המאובטחת ב-GitHub
  var redirectUri = 'https://tzur669-lab.github.io/moneytime-app/callback.html';
  
  // נשתמש ב-localhost *רק* אם אנחנו מפתחים במחשב, ולא בתוך האפליקציה בטלפון
  if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !window.CapApp && !window.CapBrowser) {
    redirectUri = window.location.origin + '/callback.html';
  }

  var url = 'https://accounts.google.com/o/oauth2/v2/auth'
    + '?client_id=' + CID
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&response_type=token'
    + '&scope=' + encodeURIComponent(SCOPES)
    + '&state=' + state
    + '&prompt=select_account';

  // מצב APK (Capacitor) - דפדפן חיצוני + Firebase polling
  if(window.CapApp || window.CapBrowser){
    // התחל polling על Firebase לקבלת token
    var safeState = state.replace(/[.#$\[\]\/]/g,'_');
    var pollInterval = setInterval(function(){
      fetch(FB_URL + '/oauthTokens/' + safeState + '.json')
        .then(function(r){ return r.json(); })
        .then(function(data){
          if(data && data.token){
            clearInterval(pollInterval);
            _onTokenReceived(data.token);
            // נקה את ה-token מ-Firebase אחרי שימוש (אבטחה)
            fetch(FB_URL + '/oauthTokens/' + safeState + '.json', {method: 'DELETE'}).catch(function(){});
            showToast('✅ חובר ל-Google Drive!');
          }
        })
        .catch(function(){});
    }, 2000); // polling כל 2 שניות
    
    // timeout - עצור polling אחרי 5 דקות
    setTimeout(function(){ clearInterval(pollInterval); }, 300000);
    
    // deep link listener (גיבוי)
    var _appUrlHandler = null;
    if(window.CapApp){
      _appUrlHandler = window.CapApp.addListener('appUrlOpen', function(data){
        _appUrlHandler.remove();
        try{ window.CapBrowser && window.CapBrowser.close(); }catch(e){}
        var url2 = data.url || '';
        var hashIdx = url2.indexOf('#');
        if(hashIdx !== -1){
          var params = new URLSearchParams(url2.substring(hashIdx+1));
          var token = params.get('access_token');
          if(token){ 
            clearInterval(pollInterval);
            _onTokenReceived(token); 
            return; 
          }
        }
      });
    }

    // פתח דפדפן חיצוני
    try{ window.CapBrowser.removeAllListeners(); }catch(e){}
    window.CapBrowser.open({url: url, presentationStyle: 'fullscreen'});
    window.CapBrowser.addListener('browserFinished', function(){
      if(_appUrlHandler){ try{_appUrlHandler.remove();}catch(e){} }
    });

  } else {
    // מצב PWA - פתיחת popup
    var popup = window.open(url, 'GoogleAuth', 'width=500,height=600,scrollbars=yes');
    
    // טיפול במקרה של popup חסום
    if(!popup || popup.closed || typeof popup.closed === 'undefined'){
      // fallback - redirect מלא
      window.location.href = url;
    }
  }
}
function _onTokenReceived(token){
  if(!token)return;
  console.log('✓ OAuth token received');
  aToken = token;
  localStorage.setItem('gtoken', token);
  localStorage.setItem('syen', '1');
  localStorage.removeItem('oauth_done');
  setTimeout(function(){
    fetchEmail().then(function(){
      renderSettings();
      setSyncDot(true);
      loadDr();
      showToast('✅ חובר ל-Google Drive בהצלחה!');
      _countUniqueUser();
      console.log('✓ Google Drive connected successfully');
    });
  }, 300);
}

// שמירת חיבור זוג ב-Firebase לפי Google ID
function _savePairByGoogleId(googleId){
  try{
    const s=D.gs();
    if(!s.pairCode||!s.myCode||!googleId)return;
    var safe=googleId.replace(/[.#$\[\]]/g,'_');
    fetch(FB_URL+'/userPairs/'+safe+'.json',{
      method:'PUT',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        myCode:s.myCode,
        pairCode:s.pairCode,
        partnerCode:s.partnerCode,
        myName:s.myName,
        myColor:s.myColor,
        ts:Date.now()
      })
    }).catch(function(){});
  }catch(e){}
}

// שחזור חיבור זוג לפי Google ID — ממכשיר חדש
async function _restorePairByGoogleId(googleId){
  try{
    if(!googleId)return;
    var safe=googleId.replace(/[.#$\[\]]/g,'_');
    const r=await fetch(FB_URL+'/userPairs/'+safe+'.json');
    if(!r.ok)return;
    const info=await r.json();
    if(!info||!info.pairCode||!info.myCode)return;
    // שחזר הגדרות זוג
    const s=D.gs();
    s.myCode=info.myCode;
    s.pairCode=info.pairCode;
    s.partnerCode=info.partnerCode;
    if(s.googleId)s.myUID=s.googleId.replace(/[.#$\[\]]/g,'_');
    if(info.myName&&(s.myName==='אני'||!s.myName))s.myName=info.myName;
    if(info.myColor)s.myColor=info.myColor;
    D.ss(s);
    // טען נתוני פרטנר
    await loadPartnerFromFirebase();
    renderCouple();
    renderSettings();
    showToast('✅ חיבור זוג שוחזר אוטומטית!');
  }catch(e){console.warn('_restorePairByGoogleId:',e);}
}

function _countUniqueUser(){
  console.log("Tracking disabled.");
  return;
}

function handleOAuthReturn(){
  var oauthDone = localStorage.getItem('oauth_done');
  var savedToken = localStorage.getItem('gtoken');
  if(oauthDone && savedToken && !aToken){
    localStorage.removeItem('oauth_done');
    _onTokenReceived(savedToken);
    return;
  }
  var hash = window.location.hash;
  if(hash && hash.includes('access_token')){
    var params = new URLSearchParams(hash.substring(1));
    var token = params.get('access_token');
    if(token){
      history.replaceState(null,'',location.pathname);
      _onTokenReceived(token);
    }
  }
}

function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:var(--g);color:#fff;padding:12px 20px;border-radius:12px;font-size:13px;font-weight:300;z-index:999;box-shadow:0 4px 20px rgba(0,0,0,.3);white-space:nowrap';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3000);
}
async function fetchEmail(){
  try{
    const r=await fetch('https://www.googleapis.com/drive/v3/about?fields=user',{headers:{Authorization:`Bearer ${aToken}`}});
    const i=await r.json();
    if(i.email)document.getElementById('drEmail').textContent=`מחובר: ${i.email}`;
    if(i.sub){
      // שמור Google ID קבוע
      const s=D.gs();
      s.googleId=i.sub;
      D.ss(s);
      // נסה לשחזר חיבור זוג ממכשיר אחר
      if(!s.pairCode){
        _restorePairByGoogleId(i.sub);
      } else {
        // עדכן את ה-Firebase עם ה-Google ID כדי שמכשירים אחרים יוכלו לשחזר
        _savePairByGoogleId(i.sub);
      }
    }
  }catch(e){}
}

// ---- DRIVE HELPERS ----
async function driveUpsert(fileName, body, isShared){
  const space = isShared ? 'drive' : 'appDataFolder';
  const q = encodeURIComponent(`name='${fileName}' and trashed=false`);
  const listUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&spaces=${space}&fields=files(id,name,parents)`;
  const list = await (await fetch(listUrl,{headers:{Authorization:`Bearer ${aToken}`}})).json();
  let fid = list.files?.[0]?.id;
  if(!fid){
    const meta = {
      name: fileName,
      mimeType: 'application/json'
    };
    if(!isShared) meta.parents = ['appDataFolder'];
    const cr = await (await fetch('https://www.googleapis.com/drive/v3/files',{
      method:'POST',
      headers:{
        Authorization: `Bearer ${aToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(meta)
    })).json();
    fid = cr.id;
    if(isShared && fid){
      await fetch(`https://www.googleapis.com/drive/v3/files/${fid}/permissions`,{
        method:'POST',
        headers:{
          Authorization: `Bearer ${aToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role: 'reader',
          type: 'anyone'
        })
      });
    }
  }
  await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fid}?uploadType=media`,{
    method:'PATCH',
    headers:{
      Authorization: `Bearer ${aToken}`,
      'Content-Type': 'application/json'
    },
    body: body
  });
  return fid;
}

async function driveRead(fileName, isShared){
  const space = isShared ? 'drive' : 'appDataFolder';
  const q = encodeURIComponent(`name='${fileName}' and trashed=false`);
  const list = await (await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&spaces=${space}&fields=files(id,name,parents)`,{headers:{Authorization:`Bearer ${aToken}`}})).json();
  if(!list.files?.length) return null;
  const data = await (await fetch(`https://www.googleapis.com/drive/v3/files/${list.files[0].id}?alt=media`,{headers:{Authorization:`Bearer ${aToken}`}})).json();
  return data;
}

async function saveDr(){
  const s=D.gs();
  try{
    if(s.pairCode&&s.myCode){
      await syncPairToFirebase();
    }
    if(aToken){
      // שמור הכל — כולל הגדרות זוג, בונוסים, תעריפים, ערכת צבע
      await driveUpsert('moneytime_solo.json', JSON.stringify({workData:D.g(),settings:s,timestamp:Date.now()}), false);
    }
    setSyncDot(true);
  }catch(e){setSyncDot(false);}
  if(s.pairCode&&s.partnerCode){
    try{
      const got=await loadPartnerFromFirebase();
      if(got&&document.getElementById('pg-couple').classList.contains('active'))renderCouple();
    }catch(e){}
  }
}

async function loadDr(){
  const s=D.gs();
  try{
    if(s.pairCode&&s.myCode) await syncPairToFirebase();
    if(s.pairCode&&s.partnerCode) await loadPartnerFromFirebase();
    if(aToken){
      const data=await driveRead('moneytime_solo.json', false);
      if(data){
        const cTs=data.timestamp||0, lTs=parseInt(localStorage.getItem('wdts'))||0;
        if(cTs>lTs||lTs===0){
          if(data.workData) D.s(data.workData);
          if(data.settings){
            const cur=D.gs();
            // תעריפים ומקומות עבודה
            if(data.settings.jobs&&data.settings.jobs.length>0){
              cur.jobs=data.settings.jobs.map((rj,i)=>Object.assign({},cur.jobs?.[i]||{},rj));
            }
            // הגדרות חישוב
            if(data.settings.calcOvertime!==undefined) cur.calcOvertime=data.settings.calcOvertime;
            if(data.settings.showMissing!==undefined) cur.showMissing=data.settings.showMissing;
            // ערכת צבע
            if(data.settings.colorTheme) cur.colorTheme=data.settings.colorTheme;
            // שם וצבע אישי
            if(data.settings.myName&&data.settings.myName!=='אני') cur.myName=data.settings.myName;
            if(data.settings.myColor) cur.myColor=data.settings.myColor;
            // בונוסים קבועים
            if(data.settings.fixedBonuses&&data.settings.fixedBonuses.length>0) cur.fixedBonuses=data.settings.fixedBonuses;
            // חיבור זוגי — שחזר רק אם אין חיבור קיים
            if(!cur.pairCode&&data.settings.pairCode){
              cur.pairCode=data.settings.pairCode;
              cur.partnerCode=data.settings.partnerCode;
              cur.myCode=data.settings.myCode||cur.myCode;
            }
            // שם ופרטנר
            if(data.settings.partnerName&&data.settings.partnerName!=='פרטנר') cur.partnerName=data.settings.partnerName;
            if(data.settings.partnerColor) cur.partnerColor=data.settings.partnerColor;
            D.ss(cur);
            // אם שוחזר חיבור זוגי — סנכרן מחדש
            if(cur.pairCode&&cur.myCode){
              syncPairToFirebase().catch(()=>{});
              loadPartnerFromFirebase().catch(()=>{});
            }
            // החל ערכת צבע
            if(data.settings.colorTheme) applyColorTheme(data.settings.colorTheme);
          }
        } else {
          await driveUpsert('moneytime_solo.json', JSON.stringify({workData:D.g(),settings:D.gs(),timestamp:Date.now()}), false);
        }
      }
    }
  }catch(e){}
  renderCal();updRep();renderSettings();
}

async function manualSync(){
  vib();
  const s=D.gs();
  try{
    if(s.pairCode&&s.myCode) await syncPairToFirebase();
    if(s.pairCode&&s.partnerCode){
      const got=await loadPartnerFromFirebase();
      if(got)renderCouple();
    }
    if(aToken) await driveUpsert('moneytime_solo.json', JSON.stringify({workData:D.g(),settings:s,timestamp:Date.now()}), false);
    renderCal();
    showToast('סנכרון הושלם');
  }catch(e){showToast('שגיאה בסנכרון');}
}
function disconnDrive(){if(confirm('לנתק?')){aToken=null;localStorage.removeItem('syen');localStorage.removeItem('gtoken');renderSettings();setSyncDot(false);}}
async function deleteDriveBackup(){
  if(!aToken){showToast('יש לחבר Google Drive תחילה');return;}
  if(!confirm('האם אתה בטוח שברצונך למחוק את הגיבוי מ-Google Drive? פעולה זו אינה הפיכה.')){return;}
  try{
    const q=encodeURIComponent("name='moneytime_solo.json' and trashed=false");
    const list=await(await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&spaces=appDataFolder&fields=files(id,name,parents)`,{headers:{Authorization:`Bearer ${aToken}`}})).json();
    if(!list.files?.length){showToast('לא נמצא גיבוי ב-Drive');return;}
    await fetch(`https://www.googleapis.com/drive/v3/files/${list.files[0].id}`,{method:'DELETE',headers:{Authorization:`Bearer ${aToken}`}});
    showToast('✅ הגיבוי נמחק מ-Drive');
  }catch(e){showToast('שגיאה במחיקה');}
}
function setSyncDot(on){const d=document.getElementById('sdot');if(d)d.className='sdot'+(on?'':' off');}
window.addEventListener('online',()=>{
  const s=D.gs();
  if(s.pairCode&&s.myCode) syncPairToFirebase();
  if(aToken) driveUpsert('moneytime_solo.json', JSON.stringify({workData:D.g(),settings:s,timestamp:Date.now()}), false).catch(()=>{});
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&aToken)saveDr();});
window.addEventListener('beforeunload',()=>{if(aToken)saveDr();});
window.addEventListener('pagehide',()=>{if(aToken)saveDr();});
