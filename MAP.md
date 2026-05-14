# מפת קבצי מעקב שעות Pro
 
## HTML / מבנה
- `index.html` — רק HTML (head + body מבנה + מודאלים + nav)
- `callback.html` — דף OAuth redirect
- `manifest.json` — PWA manifest
- `sw.js` — Service Worker (cache)
- `capacitor.config.json` — הגדרות APK

## CSS
- `styles.css` — כל העיצוב (משתני CSS, תמות, קומפוננטות)

## JS — ליבה
- `constants.js` — קבועים, storage (D.*), חישובי שכר (cp/cpDay), תאריכים
- `firebase.js` — Firebase RTDB, pair sync, autoDetect
- `google-drive.js` — OAuth, Drive read/write, סנכרון

## JS — UI
- `ui-calendar.js` — רינדור יומן (חודש/שבוע/יום)
- `ui-day-modal.js` — מודאל יום, שמירה, עבודות נוספות, סיכום פרטנר
- `ui-reports.js` — דוחות, גרפים, ארכיון, זוגי
- `ui-settings.js` — הגדרות, עבודות, בונוסים קבועים, תמות
- `ui-pair.js` — חיבור זוג, QR, ניתוק

## JS — פיצ'רים
- `export.js` — PDF, Excel, CSV, שיתוף, שחזור, מחיקה
- `update.js` — בדיקת עדכונים, APK download, באנר
- `clock.js` — שעון נוכחות
- `init.js` — DOMContentLoaded, ניווט, helpers גלובלי, PWA install

## Build
- `build-apk.yml` — GitHub Actions: build APK, sign, release, Firebase version push
- `package.json` — Capacitor dependencies

## Docs
- `HANDOFF.md` — single source of truth for new sessions (load first)
- `ARCHITECTURE.md` — module breakdown, coupling map, build pipeline
- `README.md` — docs index + quick start
