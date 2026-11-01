# Voices and Languages

VoxRelay intentionally separates the **app interface language** from the **spoken voice language**.

## Interface language
Open **Settings → App language**. Available localizations currently include **English**, **Italiano** and **Português (Brasil)**. English is the default. Primary screens are translated; some secondary controls, notifications and technical errors still use English.

## Cloud (Edge TTS) voices
The Speak screen displays the available online voices, initially filtered to **en-US**. Select another language using the voice language filter. The last selected voice is saved and restored at next launch. If none was saved, the application prefers an English voice available in Microsoft's current catalog.

Online voices need network access and depend on Microsoft availability; they may stop working temporarily if the upstream service changes.

## Local voices
Piper and Kokoro can work offline once their respective model is installed. Support depends on your machine and selected model. Advanced model support is optional.

## Helping translate
Edit the JSON catalogs in [src/renderer/src/localization](https://github.com/forgiobombi/TTS/tree/main/src/renderer/src/localization). Source language is English. Keep placeholders and keys unchanged, and use `npm run check:locales` before contributing. See [localization guide](https://github.com/forgiobombi/TTS/blob/main/docs/LOCALIZATION.md).
