# Privacy and Security

VoxRelay is open-source. The project does not require a VoxRelay account or advertise telemetry for ordinary usage.

- **Cloud voices:** text sent to Microsoft's Edge speech service requires an internet connection, and is processed according to that provider's behavior. Do not treat cloud TTS as an offline/private model.
- **Local voices:** locally installed engines can synthesize without sending text to an online voice service.
- **Application data:** settings, shortcut text, voice history and downloaded models are stored on the local machine in the application's legacy data folder.
- **Updates:** installed Windows builds fetch release metadata/installers from GitHub Releases. The packaged app does not need a GitHub personal access token.
- **Virtual microphone:** VB-Audio Cable is a third-party driver; review its official documentation and terms.
- **Installer verification:** compare the SHA-256 of the downloaded executable against `SHA256SUMS.txt` from the release. The current installer is unsigned.

Security vulnerabilities should be reported as described in [SECURITY.md](https://github.com/forgiobombi/TTS/blob/main/SECURITY.md), rather than published with exploit details in public issues.
