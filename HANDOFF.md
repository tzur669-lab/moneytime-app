# HANDOFF — מעקב שעות Pro

> Load this file first in any new session. Do not duplicate content from here in other files.

---

## What This Is

Hebrew PWA + Android APK for tracking work hours, calculating wages (with Israeli overtime law), and syncing data with a partner. No backend server — everything runs in the browser with localStorage, Google Drive (personal backup), and Firebase RTDB (pair sync).

Live: `https://tzur669-lab.github.io/moneytime-app/`

---

## Core Architecture (one-liner per layer)

| Layer | File(s) | Responsibility |
|---|---|---|
| Data | `constants.js` | `D` object (localStorage CRUD), wage calc (`cp`, `cpDay`), date key `fk()` |
| Sync | `firebase.js` | Firebase RTDB — pair/partner data only |
| Sync | `google-drive.js` | Google Drive — full personal backup (`moneytime_solo.json`) |
| UI | `ui-calendar.js`, `ui-day-modal.js`, `ui-reports.js`, `ui-settings.js`, `ui-pair.js` | Render and interact |
| Features | `export.js`, `update.js`, `clock.js` | PDF/Excel/CSV, APK update banner, live clock |
| Bootstrap | `init.js` | DOMContentLoaded wiring, PWA install prompt, nav, theme, global modals |

Script load order in `index.html` is fixed and critical — `constants.js` must be first.

---

## Non-Obvious Invariants — DO NOT BREAK

1. **Date key = `fk(date)`** → always `YYYY-MM-DD`. Every localStorage work entry uses this as its key. Break this format and all data access silently returns nothing.

2. **`D` object is the single data API.**
   - `D.g()` / `D.s(data)` → work data (`localStorage["wd"]`)
   - `D.gs()` / `D.ss(s)` → settings (`localStorage["settings"]`)
   - `D.gp()` / `D.sp(data)` → partner data (`localStorage["pd"]`)
   - Never write directly to `localStorage` for these keys.

3. **Pair code is deterministic:** `calcPairCode(a, b)` sorts both codes alphabetically and joins with `_`. Both users must compute the same code — never change this algorithm.

4. **Overtime calc is a toggle.** `settings.calcOvertime` gates all overtime logic in `cp()`:
   - `false` = hours × rate (simple)
   - `true` = 0–8h regular, 8–10h at ×1.25, >10h at ×1.5

5. **`saveDr()` is the save-all function.** After any data mutation, call `saveDr()` — it syncs to Drive + Firebase. Do not call Drive/Firebase functions directly from UI code.

6. **APK OAuth uses Firebase polling, not postMessage.** `CapApp`/`CapBrowser` can't postMessage back to the WebView. The flow is: open external browser → callback writes token to `Firebase:/oauthTokens/{state}` → app polls every 2s → cleans up token after receipt.

7. **`aToken` is the global OAuth access token** (declared in `constants.js`, set by `google-drive.js`). Check `aToken` before any Drive call.

---

## Data Flow Summary

```
User action
  → UI file (ui-*.js)
  → D.s() / D.ss()           ← writes localStorage
  → saveDr()
      ├─ syncPairToFirebase() ← if paired
      └─ driveUpsert()        ← if aToken set

On load (init.js DOMContentLoaded):
  initGD() → validates token → loadDr()
    └─ merges Drive data into localStorage (Drive wins if timestamp newer)
    └─ syncPairToFirebase() + loadPartnerFromFirebase()
  checkPairLink() → auto-detect incoming pair (4s delay)
```

---

## If You Touch X, Be Careful With Y

- **`constants.js`** → any change breaks everything downstream; it has no imports
- **`fk()` date format** → changing it orphans all existing stored data
- **`cp()` / `cpDay()`** → used by reports, calendar, day modal, export — test all four views
- **`loadDr()` merge logic** → timestamp comparison decides which data wins; Drive can overwrite local data silently
- **`calcPairCode()`** → must stay in sync between both paired devices; changing it breaks all existing pairs
- **`index.html` script order** → `constants.js` must load before everything else
- **`build-apk.yml`** → patches `AndroidManifest.xml`, `build.gradle`, and `sw.js` at build time; edits to those files in source may be overwritten

---

## Docs Index

- [MAP.md](MAP.md) — quick file map (one-liner per file)
- [ARCHITECTURE.md](ARCHITECTURE.md) — system diagram and coupling details
