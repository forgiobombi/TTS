# Installation (Windows)

## System requirements
- Windows 10 or Windows 11, **64-bit**
- At least 4 GB RAM (8 GB recommended)
- Internet connection for online Edge TTS voices
- More free disk space and, optionally, a capable GPU for local models

## Install
1. Visit [GitHub Releases](https://github.com/forgiobombi/TTS/releases/latest).
2. Download **VoxRelay-Setup-X.Y.Z.exe**.
3. Verify its SHA-256 against the release's **SHA256SUMS.txt** in PowerShell:

   ```powershell
   Get-FileHash -Algorithm SHA256 .\VoxRelay-Setup-X.Y.Z.exe
   ```
4. Run the installer and accept UAC only if you trust the release. The current unsigned build may trigger a Windows SmartScreen warning; do not bypass an organizational security policy.
5. Allow VB-Audio Virtual Cable installation if you want to send audio through a virtual microphone. A Windows restart may be required.
6. Launch VoxRelay. The interface and initial preferred voice are English by default.

The installer packages the application and local Python backend; no manual Node or Python installation is required. Existing settings and local voices are retained when upgrading.

For setup details see [Quick Start](Quick-Start).
