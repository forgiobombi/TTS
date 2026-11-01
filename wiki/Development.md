# Development

Stack: **Electron + Vite**, **React/TypeScript**, and a Python FastAPI backend for optional local speech engines.

## Requirements
- Windows 10/11
- Node.js 20+ (Node 22 recommended for local development)
- Python 3.12 when building the packaged local backend

## Source checkout
```powershell
git clone https://github.com/forgiobombi/TTS.git
cd TTS
npm ci
npm run dev
```

## Quality checks
```powershell
npm run check:locales
npm run type-check
npm test
npm run build
```

The project also runs Windows Electron E2E and Python API tests in CI.

## Build installer
The release workflow creates the full NSIS installer and bundles the Python backend and verified VB-Audio driver. For complete instructions, see [Release Process](Release-Process).

Architecture notes: [docs/ARCHITECTURE.md](https://github.com/forgiobombi/TTS/blob/main/docs/ARCHITECTURE.md).
