# ARCHITECTURE — מעקב שעות Pro

> See [HANDOFF.md](HANDOFF.md) for invariants and data flow. This file covers structure and coupling.

---

## System Diagram

```
┌─────────────────────────────────────────────────┐
│                  Browser / APK                  │
│                                                 │
│  index.html ──loads──► [scripts in order]       │
│                                                 │
│  ┌──────────────────────────────────────────┐   │
│  │            UI Layer                      │   │
│  │  ui-calendar  ui-day-modal  ui-reports   │   │
│  │  ui-settings  ui-pair                    │   │
│  └──────────────┬───────────────────────────┘   │
│                 │ calls D.s() / D.gs()           │
│  ┌──────────────▼───────────────────────────┐   │
│  │         Data Layer (constants.js)        │   │
│  │   D object → localStorage                │   │
│  │   cp() / cpDay() / fk() / getDts()       │   │
│  └──────────────┬───────────────────────────┘   │
│                 │ saveDr()                       │
│  ┌──────────────▼───────────────────────────┐   │
│  │         Sync Layer                       │   │
│  │  google-drive.js ──► Google Drive API    │   │
│  │  firebase.js     ──► Firebase RTDB       │   │
│  └──────────────────────────────────────────┘   │
│                                                 │
│  Features (independent, call D and saveDr):     │
│  export.js   update.js   clock.js               │
│                                                 │
│  Bootstrap: init.js (DOMContentLoaded)          │
└─────────────────────────────────────────────────┘

External services:
  Google Drive API (v3)     → personal backup
  Firebase RTDB             → pair sync + APK OAuth relay
  GitHub Actions            → APK build + release
  GitHub Pages              → PWA hosting
```

---

## Module Responsibilities

### `constants.js` — Data Foundation
- `D` — localStorage CRUD wrapper (never bypass it)
- `DEF_S` — default settings object (source of truth for settings shape)
- `cp(h, r, bonuses)` — wage calc for one job entry
- `cpExtra(h, r)` — wage calc for extra jobs (no bonuses)
- `cpDay(dayData)` — aggregate day total (main + all extras)
- `fk(date)` — canonical date key `YYYY-MM-DD`
- `getDts(range, startId, endId)` — date range array for reports
- `HC` — Hebrew calendar formatter (Intl-based)
- Global vars: `aToken`, `tClient`, `dProm`, `tInt`, `curDt`, `selDt`, `mType`, `per`, `rTab`

### `firebase.js` — Pair Sync
- `fbWrite(path, data)` / `fbRead(path)` — raw Firebase REST
- `syncPairToFirebase()` — push my work data + identity under `pairs/{pairCode}/{myKey}`
- `loadPartnerFromFirebase()` — pull partner data into `D.sp()`
- `autoDetectIncomingPair()` — scan Firebase for anyone pointing at `myCode` (runs 4s after load)
- `restorePairFromCloud()` — restore lost pair connection by scanning Firebase
- `_cleanupOldTokens()` — delete expired OAuth tokens from `Firebase:/oauthTokens`
- Firebase path: `pairs/{pairCode}/{userKey}` — pairCode is deterministic (see HANDOFF)

### `google-drive.js` — Personal Backup + Auth
- `initGD()` — validates saved token, sets up postMessage listener, triggers `loadDr()`
- `startGoogleAuth()` — opens OAuth popup (PWA) or external browser + Firebase polling (APK)
- `saveDr()` — **the save-all entry point**: Drive upsert + Firebase sync
- `loadDr()` — merge Drive data (wins if timestamp newer than local)
- `driveUpsert(fileName, body, isShared)` — create-or-update a Drive file
- Drive file: `moneytime_solo.json` in `appDataFolder` (private, not visible to user)
- `_savePairByGoogleId()` / `_restorePairByGoogleId()` — cross-device pair recovery via Google ID

### `ui-calendar.js` — Calendar View
- `renderCal()` — entry point, dispatches to month/week/day render
- View state stored in `_calView` (localStorage key: `calView`)

### `ui-day-modal.js` — Day Entry Modal
- `openDay(dateStr)` / `saveDay()` — open modal for a date, save to `D.s()`
- Handles extra jobs array, bonuses, notes
- Calls `saveDr()` after save

### `ui-reports.js` — Reports + Charts
- `updRep()` — re-render all report tabs
- Uses `cpDay()` for every date in range; renders charts via `hCh`, `pCh`, etc. (global Chart.js instances)

### `ui-settings.js` — Settings Panel
- `renderSettings()` — re-renders settings UI from `D.gs()`
- `applyColorTheme(name)` / `applyStyleTheme(name)` — apply CSS variables

### `ui-pair.js` — Pair Management
- `renderCouple()` — render partner's calendar view
- QR code generation and pair code entry
- `checkPairLink()` — called on init, checks URL for incoming pair link

### `export.js` — Export Features
- PDF, Excel (XLSX), CSV export
- Multi-date bulk edit (`execMulti()` in `init.js` calls `saveDr()`)
- Data restore from JSON

### `update.js` — APK Updates
- `checkAppUpdate()` — polls `Firebase:/appVersion`, shows update banner if newer
- Handles in-app APK download and install via Capacitor

### `clock.js` — Live Clock
- `initClock()` — updates `#clockTime` every second

### `init.js` — Bootstrap
- DOMContentLoaded: theme, UID gen, calendar view restore, `initClock()`, `renderCal()`, `initGD()`, `checkPairLink()`
- Nav: `swPage(p, btn)` — switches pages, triggers re-renders
- PWA install banner wiring
- Global helpers: `vib()`, `flash()`, `openM()`, `closeM()`, `showToast()`
- Keyboard: Escape closes modals, Enter submits day modal

---

## Coupling Map

**Tightly coupled (change one, check the other):**
- `cp()` / `cpDay()` ↔ `ui-reports.js`, `ui-day-modal.js`, `ui-calendar.js`, `export.js`
- `fk()` ↔ every file that reads/writes work data
- `D.gs()` settings shape ↔ `loadDr()` merge logic (must stay in sync with `DEF_S`)
- `saveDr()` ↔ all UI save actions (single choke point — intentional)

**Intentionally isolated:**
- `clock.js` — pure display, no data access
- `update.js` — reads Firebase directly, no D object usage
- `export.js` — read-only access to `D.g()` / `D.gs()`, never writes
- `callback.html` — standalone OAuth redirect page, no shared globals

---

## Build Pipeline (GitHub Actions)

On push to `main`:
1. Bump `APP_VERSION` in `update.js` and cache name in `sw.js`
2. Copy all web assets → `www/`
3. `npx cap sync android` — inject web assets into Android project
4. Patch `AndroidManifest.xml` (permissions, deep link, FileProvider, network security)
5. Decode keystore from secret → sign release APK
6. Upload APK artifact + create GitHub Release
7. Push updated `update.js` + `sw.js` back to repo
8. Write new version to `Firebase:/appVersion` (triggers in-app update banner)

**Secrets required:** `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`, `FIREBASE_SECRET`
