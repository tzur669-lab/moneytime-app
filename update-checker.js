(function() {
  'use strict';
  
  const CURRENT_VERSION = "2.1.0";
  const VERSION_URL = "https://tzur669-lab.github.io/moneytime-app/version.json";
  const CHECK_INTERVAL = 1000 * 60 * 60 * 6;
  const BANNER_DISMISS_KEY = 'update_banner_dismissed';
  const BUILD_KEY = 'app_build';
  const VERSION_KEY = 'app_version';
  const UPDATE_IN_PROGRESS_KEY = 'update_in_progress';
  
  let updateAvailable = false;
  let updateData = null;
  let updateBanner = null;
  
  function log(msg, type = 'log') {
    if (type === 'error') {
      console.error('[UpdateChecker] ' + msg);
    } else {
      console.log('[UpdateChecker] ' + msg);
    }
  }
  
  function compareVersions(current, latest) {
    if (!latest) return false;
    
    const currParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);
    
    for (let i = 0; i < Math.max(currParts.length, latestParts.length); i++) {
      const curr = currParts[i] || 0;
      const lat = latestParts[i] || 0;
      if (lat > curr) return true;
      if (lat < curr) return false;
    }
    return false;
  }
  
  function shouldForceUpdate(minVersion) {
    if (!minVersion) return false;
    return compareVersions(CURRENT_VERSION, minVersion);
  }
  
  function showToast(msg, isError = false) {
    if (typeof window.showToast === 'function') {
      window.showToast(msg);
      return;
    }
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%);
      background: ${isError ? '#EF4444' : '#10B981'};
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      z-index: 9999;
      box-shadow: 0 4px 20px rgba(0,0,0,.3);
      white-space: nowrap;
      max-width: 90%;
      overflow: hidden;
      text-overflow: ellipsis;
      direction: rtl;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
  
  async function checkForUpdates(manual = false) {
    try {
      if (!navigator.onLine) {
        if (manual) showToast('❌ אין חיבור לאינטרנט');
        log('No internet connection', 'error');
        return;
      }
      
      log('Checking for updates...');
      
      const response = await fetch(VERSION_URL + '?t=' + Date.now(), { 
        cache: 'no-store',
        headers: { 
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch version info (status: ' + response.status + ')');
      }
      
      const versionInfo = await response.json();
      updateData = versionInfo;
      
      if (!versionInfo.version) {
        throw new Error('Invalid version file - missing version field');
      }
      
      const currentBuild = parseInt(localStorage.getItem(BUILD_KEY) || '0');
      
      const hasNewerVersion = compareVersions(CURRENT_VERSION, versionInfo.version);
      const hasNewerBuild = versionInfo.build && versionInfo.build > currentBuild;
      const hasUpdate = hasNewerVersion || hasNewerBuild;
      const forceUpdate = shouldForceUpdate(versionInfo.minVersion);
      
      if (hasUpdate || forceUpdate) {
        log('Update available: ' + versionInfo.version + (versionInfo.build ? ' (build ' + versionInfo.build + ')' : ''));
        updateAvailable = true;
        showUpdateBanner(versionInfo, forceUpdate);
      } else {
        log('No update available');
        if (manual) showToast('✅ הגרסה מעודכנת');
      }
      
      localStorage.setItem('last_seen_version', versionInfo.version);
      if (versionInfo.build) {
        localStorage.setItem('last_seen_build', versionInfo.build);
      }
      
    } catch (error) {
      log('Update check failed: ' + error.message, 'error');
      if (manual) showToast('❌ שגיאה בבדיקת עדכונים', true);
    }
  }
  
  function showUpdateBanner(versionInfo, force = false) {
    if (document.getElementById('update-banner')) return;
    
    if (!force) {
      const lastDismiss = localStorage.getItem(BANNER_DISMISS_KEY);
      if (lastDismiss) {
        const dismissDate = new Date(parseInt(lastDismiss));
        const today = new Date();
        if (dismissDate.toDateString() === today.toDateString()) {
          return;
        }
      }
    }
    
    updateBanner = document.createElement('div');
    updateBanner.id = 'update-banner';
    
    const isCalendarPage = document.getElementById('pg-cal')?.classList.contains('active');
    const topPosition = isCalendarPage ? '150px' : '80px';
    
    updateBanner.style.cssText = `
      position: fixed;
      top: ${topPosition};
      left: 16px;
      right: 16px;
      background: linear-gradient(135deg, #1E3A8A, #2563EB);
      border-radius: 18px;
      padding: 16px;
      color: white;
      z-index: 9999;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
      animation: updateSlideDown 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      max-width: 500px;
      margin: 0 auto;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
      direction: rtl;
      font-family: 'Inter', sans-serif;
    `;
    
    const notes = versionInfo.notes || 'שיפורים ותיקונים';
    const notesHTML = notes.split('\n').map(line => line.trim()).filter(line => line).join('<br>');
    
    const featuresHTML = versionInfo.features && versionInfo.features.length 
      ? `<div style="font-size:11px; margin-top:6px; opacity:0.9">${versionInfo.features.map(f => '✓ ' + f).join('<br>')}</div>`
      : '';
    
    updateBanner.innerHTML = `
      <div style="display:flex; align-items:flex-start; gap:12px; flex:1; min-width:200px">
        <span style="font-size:28px; line-height:1">📦</span>
        <div style="flex:1">
          <div style="font-weight:600; margin-bottom:4px; font-size:15px; display:flex; align-items:center; gap:8px; flex-wrap:wrap">
            <span>עדכון זמין: גרסה ${versionInfo.version}</span>
            ${versionInfo.build ? `<span style="background:rgba(255,255,255,0.2); padding:2px 8px; border-radius:20px; font-size:10px; font-weight:400">build ${versionInfo.build}</span>` : ''}
            ${force ? '<span style="background:#EF4444; padding:2px 8px; border-radius:20px; font-size:10px">חובה</span>' : ''}
          </div>
          <div style="font-size:12px; opacity:0.95; line-height:1.5">${notesHTML}</div>
          ${featuresHTML}
          <div style="font-size:10px; opacity:0.7; margin-top:6px">${versionInfo.releaseDate || ''}</div>
        </div>
      </div>
      <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center">
        <button id="update-now-btn" style="
          background:white; 
          color:#1E3A8A; 
          border:none; 
          padding:10px 20px; 
          border-radius:10px; 
          font-family:'Inter',sans-serif; 
          font-size:13px; 
          font-weight:500; 
          cursor:pointer; 
          min-width:100px;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:6px;
          transition:transform 0.2s;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
        ">
          ⬇️ עדכן עכשיו
        </button>
        <button id="update-later-btn" style="
          background:transparent; 
          color:white; 
          border:1px solid rgba(255,255,255,0.4); 
          padding:10px 12px; 
          border-radius:10px; 
          font-family:'Inter',sans-serif; 
          font-size:13px; 
          cursor:pointer;
          display:flex;
          align-items:center;
          justify-content:center;
          transition:background 0.2s;
        " title="הזכר לי מחר">
          ✕
        </button>
      </div>
    `;
    
    document.body.appendChild(updateBanner);
    
    if (!document.getElementById('update-animation')) {
      const style = document.createElement('style');
      style.id = 'update-animation';
      style.textContent = `
        @keyframes updateSlideDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        #update-now-btn:hover {
          transform: scale(1.02);
        }
        #update-later-btn:hover {
          background: rgba(255,255,255,0.1);
        }
      `;
      document.head.appendChild(style);
    }
    
    document.getElementById('update-now-btn').addEventListener('click', function(e) {
      e.preventDefault();
      performUpdate(versionInfo);
    });
    
    document.getElementById('update-later-btn').addEventListener('click', function(e) {
      e.preventDefault();
      updateBanner.remove();
      localStorage.setItem(BANNER_DISMISS_KEY, Date.now().toString());
      showToast('נזכיר לך מחר 👋');
    });
  }
  
  async function performUpdate(versionInfo) {
    if (!updateBanner) return;
    
    updateBanner.innerHTML = `
      <div style="display:flex; align-items:center; gap:16px; flex:1; padding:4px 0">
        <span class="spinner-small"></span>
        <div style="flex:1">
          <div style="font-weight:500; margin-bottom:4px; font-size:14px">מעדכן לגרסה ${versionInfo.version}...</div>
          <div style="font-size:11px; opacity:0.9">שומר נתונים ומתקין עדכון</div>
          <div style="width:100%; height:4px; background:rgba(255,255,255,0.2); border-radius:2px; margin-top:10px; overflow:hidden">
            <div id="update-progress" style="width:0%; height:100%; background:white; border-radius:2px; transition:width 0.3s"></div>
          </div>
        </div>
      </div>
    `;
    
    const updateProgress = document.getElementById('update-progress');
    
    try {
      if (updateProgress) updateProgress.style.width = '20%';
      await saveAllDataBeforeUpdate();
      
      if (updateProgress) updateProgress.style.width = '40%';
      await clearOldCaches();
      
      if (updateProgress) updateProgress.style.width = '60%';
      await updateServiceWorker();
      
      if (updateProgress) updateProgress.style.width = '80%';
      localStorage.setItem(BUILD_KEY, versionInfo.build || '0');
      localStorage.setItem(VERSION_KEY, versionInfo.version);
      localStorage.setItem(UPDATE_IN_PROGRESS_KEY, 'true');
      
      if (updateProgress) updateProgress.style.width = '100%';
      await new Promise(resolve => setTimeout(resolve, 500));
      
      showToast('✅ העדכון הושלם! טוען מחדש...');
      
      setTimeout(() => {
        window.location.href = window.location.pathname + '?updated=' + Date.now() + window.location.hash;
      }, 1500);
      
    } catch (error) {
      log('Update failed: ' + error.message, 'error');
      showToast('❌ שגיאה בעדכון. נסה שוב מאוחר יותר.', true);
      
      if (updateBanner) updateBanner.remove();
      showUpdateBanner(versionInfo, true);
    }
  }
  
  async function saveAllDataBeforeUpdate() {
    log('Saving data before update...');
    
    const s = window.D?.gs?.();
    
    if (s && s.googleId && window.aToken && window.saveDr) {
      try {
        await window.saveDr();
        log('Saved to Drive');
      } catch (e) {
        log('Failed to save to Drive: ' + e.message, 'error');
      }
    }
    
    if (s && s.pairCode && s.myCode && window.syncPairToFirebase) {
      try {
        await window.syncPairToFirebase();
        log('Saved to Firebase');
      } catch (e) {
        log('Failed to save to Firebase: ' + e.message, 'error');
      }
    }
    
    localStorage.setItem('pre_update_backup_' + Date.now(), JSON.stringify({
      workData: window.D?.g?.(),
      settings: s,
      timestamp: Date.now()
    }));
    
    return true;
  }
  
  async function clearOldCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const currentCache = 'moneytime-v1';
      
      await Promise.all(
        cacheNames.map(name => {
          if (name !== currentCache) {
            log('Deleting old cache: ' + name);
            return caches.delete(name);
          }
        })
      );
    }
  }
  
  async function updateServiceWorker() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        log('Updating Service Worker...');
        await registration.update();
        
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      }
    }
  }
  
  function addManualUpdateOption() {
    const checkExist = setInterval(function() {
      const settingsCards = document.querySelectorAll('#pg-set .card');
      const lastCard = settingsCards[settingsCards.length - 1];
      
      if (lastCard && !document.getElementById('manual-update-btn')) {
        clearInterval(checkExist);
        
        const updateBtn = document.createElement('button');
        updateBtn.id = 'manual-update-btn';
        updateBtn.className = 'btn btn-o';
        updateBtn.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23,4 23,10 17,10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          בדוק עדכונים
        `;
        updateBtn.style.marginTop = '8px';
        updateBtn.onclick = function() {
          checkForUpdates(true);
        };
        
        lastCard.appendChild(updateBtn);
        log('Manual update button added');
      }
    }, 1500);
  }
  
  function init() {
    log('Initializing update checker v' + CURRENT_VERSION);
    
    setTimeout(() => {
      checkForUpdates(false);
    }, 2000);
    
    setInterval(() => {
      checkForUpdates(false);
    }, CHECK_INTERVAL);
    
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        setTimeout(() => checkForUpdates(false), 1000);
      }
    });
    
    window.addEventListener('online', function() {
      setTimeout(() => checkForUpdates(false), 2000);
    });
    
    setTimeout(addManualUpdateOption, 2000);
    
    if (localStorage.getItem(UPDATE_IN_PROGRESS_KEY) === 'true') {
      localStorage.removeItem(UPDATE_IN_PROGRESS_KEY);
      setTimeout(() => {
        const newVersion = localStorage.getItem(VERSION_KEY);
        if (newVersion) {
          showToast('✅ עודכן לגרסה ' + newVersion);
        }
      }, 2000);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  window.updateChecker = {
    check: (manual = false) => checkForUpdates(manual),
    getCurrentVersion: () => CURRENT_VERSION,
    isUpdateAvailable: () => updateAvailable,
    getUpdateInfo: () => updateData
  };
  
})();
