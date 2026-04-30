// Firebase Realtime Database — pair sync
const FB_URL = 'https://moneytime-app-f5a15-default-rtdb.firebaseio.com';

async function fbWrite(path, data) {
  try {
    const r = await fetch(`${FB_URL}/${path}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return r.ok;
  } catch (e) { return false; }
}

async function fbRead(path) {
  try {
    const r = await fetch(`${FB_URL}/${path}.json`);
    if (!r.ok) return null;
    const d = await r.json();
    return d;
  } catch (e) { return null; }
}

async function syncPairToFirebase() {
  const s = D.gs();
  if (!s.pairCode || !s.myCode) return;
  const myKey = s.myCode.replace(/[.#$\[\]]/g, '_');
  const payload = {
    workData: D.g(),
    myName: s.myName,
    myColor: s.myColor,
    myCode: s.myCode,
    googleId: s.googleId || null,
    partnerCode: s.partnerCode,
    timestamp: Date.now(),
    pairInfo: {
      pairCode: s.pairCode,
      partnerCode: s.partnerCode,
      myCode: s.myCode,
      myName: s.myName,
      myColor: s.myColor
    }
  };
  await fbWrite(`pairs/${s.pairCode}/${myKey}`, payload);
}

async function loadPartnerFromFirebase() {
  const s = D.gs();
  if (!s.pairCode || !s.partnerCode) return false;
  const partnerKey = s.partnerCode.replace(/[.#$\[\]]/g, '_');
  const data = await fbRead(`pairs/${s.pairCode}/${partnerKey}`);
  if (data && data.workData) {
    D.sp(data.workData);
    if (data.myName) {
      const ss = D.gs();
      if (!ss.partnerName || ss.partnerName === 'פרטנר') ss.partnerName = data.myName;
      if (data.myColor) ss.partnerColor = data.myColor;
      D.ss(ss);
    }
    updatePartnerDaySummary();
    return true;
  }
  return false;
}

function calcPairCode(a, b) {
  const arr = [a.toUpperCase(), b.toUpperCase()].sort();
  return arr[0] + '_' + arr[1];
}

async function checkPartnerConnected() {
  try {
    const s = D.gs();
    if (!s.pairCode || !s.partnerCode) return false;
    const partnerKey = s.partnerCode.replace(/[.#$\[\]]/g, '_');
    const data = await fbRead(`pairs/${s.pairCode}/${partnerKey}`);
    return !!(data && data.myCode);
  } catch (e) { return false; }
}

async function restorePairFromCloud() {
  try {
    const s = D.gs();
    if (!s.myCode || s.pairCode) return false;
    const allPairs = await fbRead('pairs');
    if (!allPairs) return false;
    const myKeySafe = s.myCode.replace(/[.#$\[\]]/g, '_');
    for (const pairCode of Object.keys(allPairs)) {
      const pair = allPairs[pairCode];
      const myEntry = pair[myKeySafe] || pair[s.myCode];
      if (myEntry && myEntry.pairInfo) {
        const info = myEntry.pairInfo;
        s.pairCode = info.pairCode;
        s.partnerCode = info.partnerCode;
        if (info.myName && (s.myName === 'אני' || !s.myName)) s.myName = info.myName;
        if (info.myColor) s.myColor = info.myColor;
        D.ss(s);
        await loadPartnerFromFirebase();
        return true;
      }
    }
  } catch (e) { console.warn('restorePairFromCloud:', e); }
  return false;
}

async function autoDetectIncomingPair() {
  try {
    const s = D.gs();
    if (!s.myCode || s.pairCode) return false;
    const allPairs = await fbRead('pairs');
    if (!allPairs || typeof allPairs !== 'object') return false;
    const myCode = s.myCode.toUpperCase();
    for (const pairCode of Object.keys(allPairs)) {
      const pair = allPairs[pairCode];
      if (typeof pair !== 'object') continue;
      for (const key of Object.keys(pair)) {
        const entry = pair[key];
        if (!entry || typeof entry !== 'object') continue;
        if (entry.partnerCode && entry.partnerCode.toUpperCase() === myCode && entry.myCode) {
          const partnerMyCode = entry.myCode;
          const computedPair = calcPairCode(myCode, partnerMyCode);
          if (computedPair !== pairCode) continue;
          s.pairCode = pairCode;
          s.partnerCode = partnerMyCode;
          if (entry.myName && (s.partnerName === 'פרטנר' || !s.partnerName)) s.partnerName = entry.myName;
          if (entry.myColor) s.partnerColor = entry.myColor;
          D.ss(s);
          await syncPairToFirebase();
          await loadPartnerFromFirebase();
          showToast('פרטנר זוהה — חוברתם! ✅');
          renderCouple();
          if (aToken) saveDr();
          return true;
        }
      }
    }
  } catch (e) { console.warn('autoDetectIncomingPair:', e); }
  return false;
}

// ניקוי tokens ישנים מ-Firebase (אבטחה)
function _cleanupOldTokens() {
  try {
    fetch(FB_URL + '/oauthTokens.json')
      .then(function (r) { return r.json(); })
      .then(function (tokens) {
        if (!tokens || typeof tokens !== 'object') return;
        var now = Date.now();
        var deleted = 0;
        Object.keys(tokens).forEach(function (state) {
          var entry = tokens[state];
          if (entry && entry.expires && entry.expires < now) {
            fetch(FB_URL + '/oauthTokens/' + state + '.json', { method: 'DELETE' }).catch(function () { });
            deleted++;
          }
        });
        if (deleted > 0) console.log('נוקו ' + deleted + ' tokens ישנים מ-Firebase');
      })
      .catch(function () { });
  } catch (e) { }
}
