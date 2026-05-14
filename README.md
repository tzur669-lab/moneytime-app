# מעקב שעות Pro

Hebrew work-hours tracker with overtime calc, Google Drive backup, and Firebase pair sync.
Runs as a PWA on GitHub Pages and as a signed Android APK.

**Live:** `https://tzur669-lab.github.io/moneytime-app/`

---

## Documentation Index

| File | Read when... |
|---|---|
| [HANDOFF.md](HANDOFF.md) | Starting any new session — invariants, data flow, danger zones |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Editing a specific module or adding a feature — coupling map, full module breakdown |
| [MAP.md](MAP.md) | Need a quick reminder of which file does what |

---

## Quick Start (dev)

Open `index.html` directly in a browser or serve with any static server:

```
npx serve .
```

No build step. All JS is vanilla, loaded via `<script>` tags in `index.html`.

---

## Build APK

Push to `main` branch → GitHub Actions builds, signs, and releases the APK automatically.
See [ARCHITECTURE.md § Build Pipeline](ARCHITECTURE.md#build-pipeline-github-actions) for details.

Required secrets: `KEYSTORE_BASE64`, `KEYSTORE_PASSWORD`, `KEY_ALIAS`, `KEY_PASSWORD`, `FIREBASE_SECRET`
