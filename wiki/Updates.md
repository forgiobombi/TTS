# Automatic and Manual Updates

VoxRelay publishes installer and update data on [public GitHub Releases](https://github.com/forgiobombi/TTS/releases/latest).

## Automatic (default)
Installed Windows releases check at launch (after a short delay), then every **six hours**. If a newer stable version exists, VoxRelay downloads it automatically and installs it when the app normally closes. You can also choose **Restart and install** once download has finished.

## Manual
Open **Settings → Updates → Manual**. Select **Check for updates**, then **Download update** and **Restart and install** if one is available. No background check is performed in manual mode.

## Manual download
Always possible at [GitHub Releases](https://github.com/forgiobombi/TTS/releases/latest): get `VoxRelay-Setup-X.Y.Z.exe`, check `SHA256SUMS.txt`, and install it over the current version. Your settings and local voices remain.

## Publisher and security
Current installers are **unsigned**. Windows may show a SmartScreen warning, and UAC is expected for installation/driver updates. Only obtain updates from the repository and check the hash when downloading manually.

The updater uses `latest.yml` and an NSIS installer. This currently supports **Windows 10/11 x64** only. No GitHub token is required from users. Developer builds cannot self-update.

[Technical release guide](https://github.com/forgiobombi/TTS/blob/main/docs/UPDATES.md).
