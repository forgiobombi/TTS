import { useEffect, useState } from 'react'
import type { BackendStatus } from '../../../shared/types'
import { useAppStore } from '../stores/appStore'
import { SUPPORTED_LOCALES, useTranslation } from '../i18n'
import {
  BookOpen,
  Contrast,
  Eye,
  Mic,
  RefreshCw,
  Settings,
  Type,
  Volume2,
} from 'lucide-react'
import AudioOutputPicker from '../components/AudioOutputPicker'
import UpdatesPanel from '../components/UpdatesPanel'
import { detectVBCable } from '../utils/virtualMicSetup'

export default function SettingsPage() {
  const { language, t } = useTranslation()
  const {
    highContrast,
    setHighContrast,
    setLanguage,
    largeFont,
    setLargeFont,
    showExperimentalModels,
    setShowExperimentalModels,
    setTutorialSeen,
    voiceSource,
    setVoiceSource,
  } = useAppStore()
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    running: false,
    port: 9472,
    version: '1.0.0',
    uptime: 0,
    phase: 'starting',
  })
  const [vbCableInstalled, setVbCableInstalled] = useState(false)
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    loadStatus()
    loadAudioDevices()
    void window.electronAPI.getAppVersion().then(setAppVersion).catch(() => undefined)
  }, [])

  const loadStatus = async () => {
    const status = await window.electronAPI.getBackendStatus()
    setBackendStatus(status)
  }

  const loadAudioDevices = async () => {
    // Online-first: detecta o cabo pelo renderer (enumerateDevices); backend so reforco.
    let detected = false
    try {
      if (navigator.mediaDevices?.enumerateDevices) {
        const outs = await navigator.mediaDevices.enumerateDevices()
        detected = outs.some((d) => d.kind === 'audiooutput' && /cable/i.test(d.label))
      }
    } catch {
      /* ignore */
    }
    if (!detected) {
      try {
        detected = detectVBCable(await window.electronAPI.listAudioDevices())
      } catch {
        /* ignore */
      }
    }
    setVbCableInstalled(detected)
  }

  const restartBackend = async () => {
    await window.electronAPI.restartBackend()
    setTimeout(loadStatus, 3000)
  }

  const backendLabel =
    backendStatus.phase === 'running'
      ? t('settings.online')
      : backendStatus.phase === 'starting'
        ? t('settings.starting')
        : backendStatus.phase === 'error'
          ? t('settings.failed')
          : t('settings.offline')

  const statusDotColor = backendStatus.phase === 'running'
    ? 'var(--vl-state-success)'
    : backendStatus.phase === 'starting'
      ? 'var(--vl-state-warn)'
      : 'var(--vl-state-error)'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-7 h-7" style={{ color: 'var(--vl-state-ready)' }} />
        <h1 className="text-2xl font-bold text-ink-strong">{t('nav.settings')}</h1>
      </div>

      <div className="hud-frame p-5">
        <label htmlFor="app-language" className="block text-sm font-semibold text-ink-strong mb-2">{t('settings.language')}</label>
        <p className="text-sm text-ink-soft mb-3">{t('settings.languageHelp')}</p>
        <select id="app-language" value={language} onChange={(e) => setLanguage(e.target.value as typeof language)} className="input-field max-w-xs w-full">
          {SUPPORTED_LOCALES.map((locale) => <option key={locale.code} value={locale.code}>{locale.name}</option>)}
        </select>
      </div>

      <div className="hud-frame p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5" style={{ color: 'var(--vl-state-ready)' }} />
            <h2 className="text-lg font-medium text-ink-strong">{t('settings.backend')}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: statusDotColor }} />
            <span className="text-sm text-ink-soft">{backendLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="panel-muted p-3">
            <span className="text-ink-mute">{t('settings.port')}</span>
            <p className="text-ink-strong font-medium font-mono">{backendStatus.port}</p>
          </div>
          <div className="panel-muted p-3">
            <span className="text-ink-mute">{t('settings.uptime')}</span>
            <p className="text-ink-strong font-medium font-mono">{backendStatus.uptime}s</p>
          </div>
        </div>

        <button onClick={restartBackend} className="btn-secondary text-sm flex items-center gap-2" aria-label="Restart Python backend">
          <RefreshCw className="w-4 h-4" />
          {backendStatus.phase === 'starting' ? t('settings.restart') : t('settings.retry')}
        </button>
        {backendStatus.lastError && (
          <p className="mt-3 text-sm" style={{ color: 'var(--vl-state-error)' }}>{backendStatus.lastError}</p>
        )}
      </div>

      <div className="hud-frame p-5">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-5 h-5" style={{ color: 'var(--vl-state-ready)' }} />
          <h2 className="text-lg font-medium text-ink-strong">{t('settings.voiceSource')}</h2>
        </div>
        <p className="mb-3 text-sm text-ink-soft">
          {t('settings.autoDescription')}
        </p>
        <div className="grid gap-2 sm:grid-cols-3" role="radiogroup" aria-label="Voice source">
          {([
            { value: 'auto', title: t('settings.auto'), hint: t('settings.autoHint') },
            { value: 'cloud', title: t('settings.cloud'), hint: t('settings.cloudHint') },
            { value: 'local', title: t('settings.local'), hint: t('settings.localHint') },
          ] as const).map((option) => (
            <label
              key={option.value}
              className={`panel-muted flex cursor-pointer flex-col gap-1 p-3 transition-colors hover:bg-brand-500/8 ${
                voiceSource === option.value ? 'ring-1 ring-brand-500' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="voice-source"
                  value={option.value}
                  checked={voiceSource === option.value}
                  onChange={() => setVoiceSource(option.value)}
                  className="accent-brand-500"
                />
                <span className="text-sm font-medium text-ink-strong">{option.title}</span>
              </span>
              <span className="text-xs text-ink-mute">{option.hint}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="hud-frame p-5">
        <div className="flex items-center gap-3 mb-4">
          <Mic className="w-5 h-5" style={{ color: 'var(--vl-state-ready)' }} />
          <h2 className="text-lg font-medium text-ink-strong">{t('settings.virtualMic')}</h2>
        </div>

        <div
          className="rounded-xl p-3 text-sm flex items-start gap-2"
          style={
            vbCableInstalled
              ? { background: 'var(--vl-state-success-bg)', border: '1px solid var(--vl-state-success-border)' }
              : { background: 'var(--vl-state-warn-bg)', border: '1px solid var(--vl-state-warn-border)' }
          }
        >
          <Mic
            className="h-4 w-4 flex-shrink-0 mt-0.5"
            style={{ color: vbCableInstalled ? 'var(--vl-state-success)' : 'var(--vl-state-warn)' }}
          />
          <p className="text-ink-body">
            {vbCableInstalled
              ? 'Virtual microphone installed. In Discord/Zoom/games, choose CABLE Output as the microphone.'
              : 'Virtual microphone not detected yet. It comes with the app installer — restart Windows if you just installed it.'}
          </p>
        </div>

        <div className="mt-4 space-y-3">
          <AudioOutputPicker />
        </div>
      </div>

      <div className="hud-frame p-5">
        <div className="flex items-center gap-3 mb-4">
          <Contrast className="w-5 h-5" style={{ color: 'var(--vl-state-ready)' }} />
          <h2 className="text-lg font-medium text-ink-strong">{t('settings.accessibility')}</h2>
        </div>

        <div className="space-y-3">
          <label className="panel-muted flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-brand-500/8">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-ink-soft" />
              <div>
                <p className="text-sm font-medium text-ink-strong">{t('settings.highContrast')}</p>
                <p className="text-xs text-ink-mute">{t('settings.highContrastHint')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={(event) => setHighContrast(event.target.checked)}
              className="w-5 h-5 accent-brand-500"
            />
          </label>

          <label className="panel-muted flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-brand-500/8">
            <div className="flex items-center gap-3">
              <Type className="w-5 h-5 text-ink-soft" />
              <div>
                <p className="text-sm font-medium text-ink-strong">{t('settings.largeFonts')}</p>
                <p className="text-xs text-ink-mute">{t('settings.largeFontsHint')}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={largeFont}
              onChange={(event) => setLargeFont(event.target.checked)}
              className="w-5 h-5 accent-brand-500"
            />
          </label>
        </div>
      </div>

      <div className="hud-frame p-5">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-5 h-5" style={{ color: 'var(--vl-state-ready)' }} />
          <h2 className="text-lg font-medium text-ink-strong">{t('settings.localVoices')}</h2>
        </div>

        <label className="panel-muted flex items-center justify-between p-3 cursor-pointer transition-colors hover:bg-brand-500/8">
          <div>
            <p className="text-sm font-medium text-ink-strong">{t('settings.experimental')}</p>
            <p className="text-xs text-ink-mute">
              Shows Bark, Fish Speech, and other items outside the main flow. They remain off the recommended path for end users.
            </p>
          </div>
          <input
            type="checkbox"
            checked={showExperimentalModels}
            onChange={(event) => setShowExperimentalModels(event.target.checked)}
            className="w-5 h-5 accent-brand-500"
          />
        </label>
      </div>

      <div className="hud-frame p-5">
        <h2 className="text-lg font-medium text-ink-strong mb-3">{t('settings.globalShortcuts')}</h2>
        <p className="text-sm text-ink-soft mb-3">
          Press any combination from any app. Custom editing is coming in the next version.
        </p>
        <ul className="space-y-2 text-sm">
          {[
            ['Ctrl+Shift+F', 'Focus the window and the text field'],
            ['Ctrl+Shift+V', 'Open compact mode'],
            ['Ctrl+Shift+M', 'Toggle the virtual microphone'],
            ['Ctrl+Shift+S', 'Stop the playing audio'],
            ['Ctrl+Shift+1..9', 'Speak quick phrase 1 to 9'],
          ].map(([shortcut, desc]) => (
            <li key={shortcut} className="panel-muted flex items-center justify-between p-2.5">
              <span className="text-ink-body">{desc}</span>
              <code className="badge-shortcut text-[11px] px-2 w-auto" style={{ minWidth: 'auto', width: 'auto', height: 'auto', padding: '2px 6px' }}>
                {shortcut}
              </code>
            </li>
          ))}
        </ul>
      </div>

      <UpdatesPanel />

      <div className="hud-frame p-5">
        <h2 className="text-lg font-medium text-ink-strong mb-3">{t('settings.about')}</h2>
        <p className="text-sm text-ink-soft leading-relaxed mb-4">
          VoxRelay is a free and open-source assistive communication tool.
          It helps anyone who prefers, needs, or chooses to turn text into voice with speed, autonomy, and privacy.
        </p>
        <button
          onClick={() => setTutorialSeen(false)}
          className="btn-secondary inline-flex items-center gap-2 text-sm mb-4"
          aria-label="Replay the intro tutorial"
        >
          <BookOpen className="w-4 h-4" />
          {t('settings.replay')}
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="panel-muted p-3">
            <span className="text-ink-mute block mb-1">{t('settings.version')}</span>
            <span className="text-ink-strong">{appVersion || '—'}</span>
          </div>
          <div className="panel-muted p-3">
            <span className="text-ink-mute block mb-1">{t('settings.license')}</span>
            <span className="text-ink-strong">MIT</span>
          </div>
          <div className="panel-muted p-3">
            <span className="text-ink-mute block mb-1">{t('settings.mainFlow')}</span>
            <span className="text-ink-strong">Piper, Kokoro, virtual microphone</span>
          </div>
          <div className="panel-muted p-3">
            <span className="text-ink-mute block mb-1">{t('settings.advanced')}</span>
            <span className="text-ink-strong">XTTS v2 after validating NVIDIA/CUDA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
