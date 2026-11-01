# Translating VoxRelay (free workflow)

VoxRelay uses three **flat JSON dictionaries** with stable keys and English as the source language:
- `src/renderer/src/localization/en.json` (source)
- `src/renderer/src/localization/it.json`
- `src/renderer/src/localization/pt-BR.json`

## Option A — 100% free, no service account

Edit the JSON files directly on GitHub and open a pull request. Keep the key names and placeholders unchanged. Run `npm run check:locales` before committing. This works even with a private repository and has no translation volume or user-seat charges.

## Option B — Tolgee Cloud Free (visual translator)

Tolgee supports **Native JSON** with dotted keys, as used here. Its hosted Free plan is free of charge, but has quotas for words/seats and other features.

1. Sign up at https://app.tolgee.io and create a project named `VoxRelay`.
2. Set **English** as the source language and add Italian and Portuguese (Brazil).
3. In Tolgee, open **Import**, select Native JSON/JSON with flat keys, then import `en.json` as English.
4. Import `it.json` as Italian and `pt-BR.json` as Portuguese (Brazil). Check the import preview; keys with periods must remain **flat**, not be nested.
5. Edit translations through the browser. Preserve `{count}` and `{error}`.
6. Use **Export** in Native JSON format with flat keys (no structure delimiter) and commit the exported files under the same names.
7. Run `npm run check:locales` and `npm run type-check` prior to merging.

Tolgee documentation: https://docs.tolgee.io/platform/formats/native_json and https://docs.tolgee.io/platform/projects_and_organizations/import

**Important:** An external Tolgee account and project have not been created automatically. This guide uses manual import/export and does not pretend to configure automatic GitHub sync.

## Crowdin and Weblate

Crowdin has an open-source sponsorship program for eligible publicly hosted projects, subject to approval; it is not automatically free for this currently private repository. Hosted Weblate's gratis Libre plan requires a public project. The self-hosted Weblate code is free, but server hosting/maintenance are your responsibility. If the repository is later made public, those can be reconsidered.

## Developers

- `useTranslation()` supplies `t(key, parameters)` to React screens.
- Add a new stable key to **en.json** first, and add matching translations to other catalogs.
- Provide an English fallback when the translation is missing.
- The UI language defaults to `en`, saved in the app's existing settings; changing it never changes the selected voice.
- Edge online voices are separately filtered by locale and English voices are preferred on a fresh installation.
- The initial catalogs intentionally cover **primary** app screens. Secondary dialogs and runtime error messages still contain hardcoded English; extending extraction remains a follow-up.
