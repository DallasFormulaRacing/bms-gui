# Battery Management System GUI

## 0) One-time prerequisites

### Install toolchains

* Node.js 
* Rust 

Verify:

```bash
node -v
npm -v
rustc --version
cargo --version
```

---

## 1) Install frontend dependencies

```bash
npm install
```
This creates `node_modules/`


---

## 2) Run the frontend alone (sanity check)

```bash
npm run dev
```

```
Local: http://localhost:5173/
```

```bash
Ctrl+C
```

---

## 3) Confirm Tauri config is correct

Open:

```
src-tauri/tauri.conf.json
```

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

```bash
npx tauri dev
```

```bash
Ctrl+C
```

---

## 5) Build the production frontend assets

```bash
npm run build
```

Confirm you now have:

```
dist/index.html
dist/assets/...
```

---

## 6) Build the actual installable app (release)

```bash
npx tauri build
```

This produces OS-native outputs under:

```
src-tauri/target/release/bundle/
```

Common locations:

### Windows

* `src-tauri/target/release/bundle/nsis/*.exe`
* `src-tauri/target/release/bundle/msi/*.msi`

### macOS

* `src-tauri/target/release/bundle/macos/*.app`
* `src-tauri/target/release/bundle/dmg/*.dmg`

### Linux

* `src-tauri/target/release/bundle/appimage/*.AppImage`
* `src-tauri/target/release/bundle/deb/*.deb`

Run the produced artifact to confirm it launches **without** a dev server.

