# Troubleshooting

## The app will not start
- Download the latest official Windows x64 installer from [Releases](https://github.com/forgiobombi/TTS/releases/latest).
- Confirm Windows 10/11 x64 and that the installer was not corrupted by comparing SHA-256.
- Review logs in the application's user-data folder, normally under `%APPDATA%\VoiceLaunch TTS\logs` (legacy app data name is retained intentionally).

## No online voices, failed synthesis, or HTTP 403
- Confirm internet access and that the selected voice is still present in the catalog.
- Try **Check for updates** and install the newest version; Microsoft occasionally changes its speech service.
- The program must use its own supported TTS API client; avoid exposing arbitrary tokens.

## The voice plays locally but friends cannot hear it
- In VoxRelay enable virtual mic and confirm **CABLE Input** as the playback target.
- In Discord or the game select **CABLE Output** as microphone input.
- Restart Windows after the cable driver installation.
- Check microphone permissions and software mute.

## Local backend offline
Online Edge voices can still work; optional local voices depend on the packaged Python backend. Open Settings to retry the backend. Check available disk space and log diagnostics.

## Updater fails
Check network access to GitHub Releases, whether a newer published stable version exists, and that Windows installed the app normally. If updating fails, download the latest installer manually.

If you cannot resolve a problem, open an issue at [GitHub Issues](https://github.com/forgiobombi/TTS/issues), with the Windows version, app version, steps to reproduce and redacted logs. **Never share private recordings, tokens or personal conversation data.**
