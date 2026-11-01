# Windows releases and automatic updates

## What users receive

Every new `vX.Y.Z` version publishes these artifacts on [GitHub Releases](https://github.com/forgiobombi/TTS/releases):
- `VoxRelay-Setup-X.Y.Z.exe`: Windows 10/11 x64 installer (NSIS)
- `latest.yml`: release metadata, version, installer URL, SHA-512 hash and size for electron-updater
- `VoxRelay-Setup-X.Y.Z.exe.blockmap`: differential-download information
- `SHA256SUMS.txt`: installer checksum for manual verification

The Windows installer is built on GitHub-hosted Windows runners; users do not need to install Node.js or Python. The bundled local backend and virtual microphone driver are assembled during build.

## User update modes

**Automatic (default).** Installed Windows builds check GitHub Releases ten seconds after startup and every six hours. When a newer stable version is found, they download it; it is installed when the app normally closes. A restart-and-install button is also available when downloaded.

**Manual.** Choose *Settings → Updates → Manual*. Then use **Check for updates**, **Download update**, and **Restart and install** when desired. No background update checks/downloads in this mode.

You can always download an installer from GitHub Releases, and install over your existing installation. Existing settings, history, voices and models remain under the legacy app data path. Developer builds do not perform in-app self-updates. The environment variable `VOICELAUNCH_ENABLE_AUTO_UPDATE=false` explicitly disables packaged automatic updater functionality.

## Releasing a new version

1. Update `package.json` and `package-lock.json` to the same **new** semantic version.
2. Update `.github/RELEASE_NOTES.md` and the documentation.
3. Merge changes to `main` and let **Windows Release** build and test. The first successful build of a new version automatically creates `vX.Y.Z` and publishes the release.
4. The same workflow can be started manually using **Actions → Windows Release → Run workflow** or by pushing a matching `vX.Y.Z` tag.
5. Wait for the Windows build, Python-backend smoke test, E2E tests, VB-Cable checksum validation, installer and update metadata validation, and GitHub Release upload to pass.
6. Download the published installer, verify SHA-256, and complete the [real-hardware release checklist](RELEASE_VALIDATION.md).
7. Before announcing general availability, verify an actual update from the previous installed release and normal Windows UAC/SmartScreen behavior.

If the version already has a published release, the workflow uploads a testable GitHub Actions artifact **but does not silently overwrite the published version**. Increment the version number to ship another update.

## Security and limitations

- The GitHub repository and releases must stay public for client updater access without a token.
- Do not embed personal GitHub tokens in the application or the `latest.yml` manifest.
- GitHub Actions uses its scoped `GITHUB_TOKEN` only to publish releases.
- The current installer is **unsigned**; it is not appropriate to describe it as trusted or verified by Windows. Consider adding Authenticode code signing and setting `publisherName` in electron-builder for production distribution.
- `electron-updater` validates package metadata/checksums; code-signing adds publisher authenticity.
- Since the app installs a driver requiring elevated privileges, users may receive an administrator/UAC prompt during install or update. A valid signature cannot eliminate all prompts.
- Only Windows x64 updates are supported currently; do not claim macOS/Linux updates exist.
