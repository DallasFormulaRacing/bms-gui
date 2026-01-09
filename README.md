# Battery Management System GUI

## Latest release installers:

| Installer Download Links                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows on x86-64**                                                                                                                                |
| [**(Recommended) Installer Executable (.exe)**](https://github.com/DallasFormulaRacing/bms-gui/releases/latest/download/BMS-GUI_0.1.0_x64-setup.exe) |
| [**Microsoft Installer package (.msi)**](https://github.com/DallasFormulaRacing/bms-gui/releases/latest/download/v0.0.2/BMS-GUI_0.1.0_x64_en-US.msi) |
| **Apple Silicon**                                                                                                                                    |
| [**macOS Disk Image Mounter (.dmg)**](https://github.com/DallasFormulaRacing/bms-gui/releases/latest/download/BMS-GUI_0.1.0_aarch64.dmg)             |
| **Linux on x86-64**                                                                                                                                  |
| [**Linux App Image (.AppImage)**](https://github.com/DallasFormulaRacing/bms-gui/releases/latest/download/BMS-GUI_0.1.0_amd64.AppImage)              |
| [**Linux Debian Package (.deb)**](https://github.com/DallasFormulaRacing/bms-gui/releases/latest/download/BMS-GUI_0.1.0_amd64.deb)                   |

## Overriding Antivirus/Malware Protection Measures

> [!WARNING]
> This application is not signed or notarized. Commercial operating systems such as Windows and macOS **will** flag the app as malware/damaged or some other variation which will keep you from launching the app.

### Overriding Antivirus/Malware Protection Measures for macOS:

Install the app normally by launching the .dmg and dragging it into your Applications folder.

Now, open your terminal and run the following commands:

```bash
xattr -cr /Applications/BMS\ Interface.app
codesign --force --deep --sign - /Applications/BMS\ Interface.app
```

Open with

```bash
open /Applications/BMS\ Interface.app
```

or open graphically from the desktop environment.

### Overriding Antivirus/Malware Protection Measures for Windows:

[WIP]

> [!NOTE]
> If you still cannot get past Microsoft Defender or macOS Gatekeeper, you may elect to build locally; instructions below.

### Overriding Antivirus/Malware Protection Measures for Linux:

> [!NOTE]
> For users running Linux having trouble building the AppImage, try setting NO_STRIP to true by running `export NO_STRIP=true`

---
