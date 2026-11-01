# Release Process

Official builds are published to [GitHub Releases](https://github.com/forgiobombi/TTS/releases) via **Actions → Windows Release**.

1. Increment `version` in `package.json` and `package-lock.json`.
2. Update `.github/RELEASE_NOTES.md`.
3. Merge to `main` or run the workflow manually. The first successful build of a new version tags the commit `vX.Y.Z` and publishes its release.
4. The Windows runner builds Python with PyInstaller, runs tests, builds NSIS, verifies generated `latest.yml` and computes SHA256.
5. Users download `VoxRelay-Setup-X.Y.Z.exe`; automatic updates use `latest.yml` and `.blockmap`. Do not overwrite a previously published version.
6. Perform hands-on Windows installation/Discord tests before a broad announcement.

Current installers are unsigned. Production code signing is strongly recommended.

[Detailed guide](https://github.com/forgiobombi/TTS/blob/main/docs/UPDATES.md) · [Release validation](https://github.com/forgiobombi/TTS/blob/main/docs/RELEASE_VALIDATION.md)
