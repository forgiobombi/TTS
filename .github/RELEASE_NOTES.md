# VoxRelay v1.3.3 — Layout and Windows icon fixes

Download **VoxRelay-Setup-1.3.3.exe** below for Windows 10/11 x64.

## New in 1.3.3
- Reworked the Speak workspace so the editor, controls and shortcuts no longer overlap, and the textarea no longer expands to fill the entire screen.
- Repaired Windows executable resource editing so VoxRelay.exe and NSIS installation shortcuts use the branded VoxRelay icon rather than the Electron default icon.
- GitHub Releases-powered updater, enabled by default on packaged Windows installations.
- Settings → Updates: choose **Automatic** (checks every six hours, downloads automatically, installs when closing) or **Manual** (check, download, install only on request).
- **Check for updates**, download progress, **Restart and install** and a direct GitHub Releases link.
- English remains the default UI/voice language; Italian and Brazilian Portuguese translations are editable JSON.
- Updated wiki/documentation and removed the old GitHub Pages landing website.

## Installer integrity
The release includes `latest.yml` and `.blockmap` metadata for electron-updater, plus `SHA256SUMS.txt` for verifying your downloaded installer.

In PowerShell:
```powershell
Get-FileHash -Algorithm SHA256 .\VoxRelay-Setup-1.3.3.exe
```
Compare its hash to `SHA256SUMS.txt` from this release.

## Important notes
- **Windows x64 only.** This build is not code-signed. Windows SmartScreen may warn; review the publisher and checksum before running. Do not disable security software or bypass organizational restrictions.
- Virtual microphone: VB-Audio Cable is bundled, and the installer may ask for administrator permissions to install it. Restart Windows if its audio device is not visible.
- Updating to 1.3.3 preserves the existing configuration and downloaded local voices.
- Automatic updates require GitHub Releases to remain public and to publish `latest.yml` together with every future NSIS installer.
- Live Edge TTS and real Discord routing require testing on actual Windows hardware; CI tests are not a substitute.
- Documentation and release guidance: [GitHub Wiki](https://github.com/forgiobombi/TTS/wiki) or [docs](https://github.com/forgiobombi/TTS/tree/main/docs).
