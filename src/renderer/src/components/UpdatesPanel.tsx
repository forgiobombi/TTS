import { useEffect, useState } from 'react'
import { Download, ExternalLink, RefreshCw, RotateCw } from 'lucide-react'
import { useTranslation } from '../i18n'

type Mode = 'automatic' | 'manual'
type Phase = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'current' | 'error'

export default function UpdatesPanel() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<Mode>('automatic')
  const [version, setVersion] = useState('')
  const [latest, setLatest] = useState('')
  const [phase, setPhase] = useState<Phase>('idle')
  const [percent, setPercent] = useState(0)
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    let mounted = true
    void Promise.all([window.electronAPI.getUpdateMode(), window.electronAPI.getAppVersion()])
      .then(([m, v]) => { if (mounted) { setMode(m); setVersion(v) } }).catch(() => undefined)
    const unsubscribe = [
      window.electronAPI.onUpdaterChecking(() => setPhase('checking')),
      window.electronAPI.onUpdaterAvailable((info: { version: string }) => {
        setLatest(info.version)
        setPhase('available')
      }),
      window.electronAPI.onUpdaterNotAvailable(() => setPhase('current')),
      window.electronAPI.onUpdaterProgress((progress: { percent: number }) => {
        setPercent(Math.max(0, Math.min(100, Math.round(progress.percent))))
        setPhase('downloading')
      }),
      window.electronAPI.onUpdaterDownloaded((info: { version: string }) => {
        setLatest(info.version)
        setPhase('downloaded')
      }),
      window.electronAPI.onUpdaterError((message: string) => {
        setError(message)
        setPhase('error')
      }),
    ]
    return () => { mounted = false; unsubscribe.forEach((fn) => fn()) }
  }, [])

  const chooseMode = async (next: Mode) => {
    setPending(true)
    try {
      const result = await window.electronAPI.setUpdateMode(next)
      if (result.success) setMode(next)
      else { setError(result.error || t('updates.modeError')); setPhase('error') }
    } catch (e) { setError(String(e)); setPhase('error') }
    finally { setPending(false) }
  }

  const check = async () => {
    setPending(true)
    setPhase('checking')
    setError('')
    try {
      const result = await window.electronAPI.checkForUpdates()
      if (!result.success) {
        if (result.error?.includes('disabled for this build')) { setSupported(false); setPhase('idle') }
        else { setError(result.error || 'Unknown error'); setPhase('error') }
      } else if (result.updateInfo?.version && result.updateInfo.version !== version) {
        setLatest(result.updateInfo.version)
        setPhase((prev) => prev === 'downloaded' ? prev : 'available')
      } else setPhase((prev) => prev === 'downloaded' ? prev : 'current')
    } catch (e) { setError(String(e)); setPhase('error') }
    finally { setPending(false) }
  }

  const download = async () => {
    setPending(true)
    setPercent(0)
    setPhase('downloading')
    try {
      const result = await window.electronAPI.downloadUpdate()
      if (!result.success) { setError(result.error || 'Download failed'); setPhase('error') }
    } catch (e) { setError(String(e)); setPhase('error') }
    finally { setPending(false) }
  }

  const message = phase === 'checking' ? t('updates.checking')
    : phase === 'available' ? t('updates.available', { version: latest })
    : phase === 'downloading' ? t('updates.downloading', { percent })
    : phase === 'downloaded' ? t('updates.downloaded', { version: latest })
    : phase === 'current' ? t('updates.current')
    : phase === 'error' ? t('updates.error', { error })
    : ''

  return <section className="hud-frame p-5 space-y-4" aria-label={t('updates.title')}>
    <div>
      <h2 className="text-lg font-semibold text-ink-strong">{t('updates.title')}</h2>
      <p className="text-sm text-ink-soft mt-1">{t('updates.description')}</p>
      <p className="text-xs text-ink-mute mt-2">{t('updates.version', { version: version || '—' })}</p>
    </div>
    <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label={t('updates.title')}>
      {(['automatic', 'manual'] as const).map((value) =>
        <label key={value} className="panel-muted flex items-center gap-2 p-3 cursor-pointer">
          <input type="radio" name="update-mode" disabled={pending} checked={mode === value}
            onChange={() => void chooseMode(value)} className="accent-brand-500" />
          <span className="text-sm text-ink-strong">{t(value === 'automatic' ? 'updates.automatic' : 'updates.manual')}</span>
        </label>)}
    </div>
    <p className="text-xs text-ink-soft">{t(mode === 'automatic' ? 'updates.autoInfo' : 'updates.manualInfo')}</p>
    {message && <p role="status" aria-live="polite" className="text-sm text-ink-body">{message}</p>}
    {!supported && <p className="text-xs text-ink-soft">{t('updates.unavailable')}</p>}
    {phase === 'downloading' && <progress className="w-full accent-brand-500" value={percent} max={100} aria-label={t('updates.downloading', { percent })} />}
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-secondary inline-flex items-center gap-2 text-sm" onClick={() => void check()} disabled={pending || phase === 'checking'}>
        <RefreshCw className="h-4 w-4" />{t('updates.check')}
      </button>
      {phase === 'available' && mode === 'manual' &&
        <button type="button" className="btn-primary inline-flex items-center gap-2 text-sm" onClick={() => void download()} disabled={pending}>
          <Download className="h-4 w-4" />{t('updates.download')}
        </button>}
      {phase === 'downloaded' &&
        <button type="button" className="btn-primary inline-flex items-center gap-2 text-sm"
          onClick={() => void window.electronAPI.installUpdate()}>
          <RotateCw className="h-4 w-4" />{t('updates.install')}
        </button>}
      <button type="button" className="btn-secondary inline-flex items-center gap-2 text-sm"
        onClick={() => window.electronAPI.openExternal('https://github.com/forgiobombi/TTS/releases/latest')}>
        <ExternalLink className="h-4 w-4" />{t('updates.releases')}
      </button>
    </div>
  </section>
}
