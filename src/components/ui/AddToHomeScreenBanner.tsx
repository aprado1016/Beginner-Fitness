import { useEffect, useState } from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ShareIcon, CloseIcon, PlusIcon } from '@/components/icons'

const DISMISSED_KEY = 'maggie-fitness:a2hs-dismissed'

function isStandaloneDisplay() {
  // display-mode: standalone is the standard check (Android/Chrome, desktop); iOS Safari
  // exposes its own non-standard navigator.standalone flag instead of supporting that media query.
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(nav.standalone)
}

function isIosDevice() {
  const ua = window.navigator.userAgent
  // iPadOS 13+ reports as "MacIntel" in the UA string, so touch-point count is the only way
  // to tell it apart from an actual Mac.
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// Not a standard DOM type — Chrome/Android-only event for a programmatic install prompt.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Only ever visible in a regular browser tab — never once the app is actually installed to the
 * home screen, since there's nothing left to instruct at that point. iOS has no programmatic
 * install API, so it gets written instructions instead; Chrome/Android's real install prompt is
 * used directly where available.
 */
export function AddToHomeScreenBanner() {
  const [dismissed, setDismissed] = useState(() => localStorage.getItem(DISMISSED_KEY) === '1')
  const [standalone] = useState(isStandaloneDisplay)
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(() => (isIosDevice() ? 'ios' : null))
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      setPlatform('android')
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDismissed(true)
  }

  const handleInstallClick = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const choice = await installPrompt.userChoice
    if (choice.outcome === 'accepted') dismiss()
  }

  if (standalone || dismissed || !platform) return null

  return (
    <GlassCard padding="md" className="flex items-start gap-3">
      <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-softer text-fg-brand-strong">
        {platform === 'ios' ? <ShareIcon className="h-4 w-4" /> : <PlusIcon className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading">Install this app</p>
        {platform === 'ios' ? (
          <p className="mt-0.5 text-xs text-body-subtle">
            Tap <ShareIcon className="inline h-3.5 w-3.5 -translate-y-px" aria-label="Share" /> below, then "Add to
            Home Screen" — it'll open full-screen, just like a real app.
          </p>
        ) : (
          <>
            <p className="mt-0.5 text-xs text-body-subtle">
              Add it to your home screen — it'll open full-screen, just like a real app.
            </p>
            <button
              type="button"
              onClick={handleInstallClick}
              className="mt-2 text-xs font-semibold text-fg-brand hover:text-fg-brand-strong"
            >
              Install now
            </button>
          </>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-body-subtle hover:bg-neutral-secondary-medium hover:text-heading"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </GlassCard>
  )
}
