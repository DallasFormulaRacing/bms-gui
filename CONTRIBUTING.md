# Instructions for building locally (for developers)

You do not need to do this for the installers above

## 0) One-time prerequisites

### Install toolchains

Install the following:

-   Node.js
-   Rust

Verify:

```bash
node -v
npm -v
rustc --version
cargo --version
```

---

## 1) Install frontend dependencies

Run:

```bash
npm install
```

Verify that this creates `node_modules/`

---

## 2) Run the frontend alone (sanity check)

Run:

```bash
npm run dev
```

Verify this:

```
Local: http://localhost:5173/
```

Exit with:

```bash
Ctrl+C
```

---

## 3) Confirm Tauri config is correct

Open:

```
src-tauri/tauri.conf.json
```

Verify this:

```json
"build": {
  "frontendDist": "../dist",
  "devUrl": "http://localhost:5173",
  "beforeDevCommand": "npm run dev",
  "beforeBuildCommand": "npm run build"
}
```

---

## 4) First Tauri dev run (builds Rust once)

Run:

```bash
npx tauri dev
```

Verify and exit:

```bash
Ctrl+C
```

---

## 5) Build the production frontend assets

Run:

```bash
npm run build
```

Verify you now have:

```
dist/index.html
dist/assets/...
```

---

## 6) Build the actual installable app (release)

Run:

```bash
npx tauri build
```

This produces OS-native outputs under:

```
src-tauri/target/release/bundle/
```

Common locations:

### Windows

-   `src-tauri/target/release/bundle/nsis/*.exe`
-   `src-tauri/target/release/bundle/msi/*.msi`

### macOS

-   `src-tauri/target/release/bundle/macos/*.app`
-   `src-tauri/target/release/bundle/dmg/*.dmg`

### Linux

-   `src-tauri/target/release/bundle/appimage/*.AppImage`
-   `src-tauri/target/release/bundle/deb/*.deb`

Run the produced artifact to confirm it launches **without** a dev server (aka your terminal).
