# Phase 7 — Android / Offline-first setup

Phase 7 makes My Wealth **offline-first** with IndexedDB and adds a PWA install flow. It also includes a Capacitor configuration so the same web build can be wrapped as a native Android app.

## Run the web app

```bash
npm install
npm run dev
```

## Build the web bundle

```bash
npm run build
```

## Optional Android wrapper

After installing Node.js and Android Studio:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap add android
npm run build
npx cap sync android
npx cap open android
```

Then use Android Studio to run on a connected Android phone or build an APK.

### Data architecture

- Primary app data: IndexedDB (`my-wealth-db`)
- Automatic migration fallback: previous `localStorage` state is read when IndexedDB is empty.
- JSON backup/restore remains available.
- Market data still requires internet; personal records remain available offline.

This source package does **not** contain a generated Android Studio project or APK yet. Those are produced by the Capacitor/Android toolchain on a machine with Android Studio installed.
