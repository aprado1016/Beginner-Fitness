import { useEffect, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ShareIcon, PlusIcon } from '@/components/icons'
import { isIosDevice } from '@/lib/platform'

// Not a standard DOM type — Chrome/Android-only event for a programmatic install prompt.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/**
 * Replaces the entire app in a regular browser tab — the app is meant to be used only once
 * installed to the home screen, so there's nothing to dismiss or bypass here, unlike a typical
 * "install our app" banner. Once actually launched from the home screen icon, App never renders
 * this at all.
 */
export function InstallRequired() {
  const [isIos] = useState(isIosDevice)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] pt-[max(env(safe-area-inset-top,0px),1.5rem)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full flex-col items-center text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-softer shadow-xs">
          {isIos ? (
            <ShareIcon className="h-7 w-7 text-fg-brand-strong" />
          ) : (
            <PlusIcon className="h-7 w-7 text-fg-brand-strong" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-heading">Add to your Home Screen</h1>
        <p className="mt-2 text-sm text-body-subtle">
          This app is designed to be used as an installed app, not a browser tab — one quick step
          to set it up.
        </p>

        {isIos ? (
          <ol className="mt-6 w-full space-y-3 text-left">
            <InstallStep number={1}>
              Tap the <ShareIcon className="inline h-4 w-4 -translate-y-px" /> Share button in
              Safari's toolbar.
            </InstallStep>
            <InstallStep number={2}>Scroll down and tap "Add to Home Screen".</InstallStep>
            <InstallStep number={3}>Open the app from the new icon on your Home Screen.</InstallStep>
          </ol>
        ) : installPrompt ? (
          <button
            type="button"
            onClick={handleInstallClick}
            className="mt-6 min-h-[52px] w-full rounded-base bg-brand px-6 text-base font-medium text-white shadow-xs transition-all active:scale-[0.97]"
          >
            Install App
          </button>
        ) : (
          <ol className="mt-6 w-full space-y-3 text-left">
            <InstallStep number={1}>Open your browser's menu.</InstallStep>
            <InstallStep number={2}>Look for "Add to Home Screen" or "Install App".</InstallStep>
            <InstallStep number={3}>Open the app from the new icon on your Home Screen.</InstallStep>
          </ol>
        )}
      </motion.div>
    </div>
  )
}

function InstallStep({ number, children }: { number: number; children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 rounded-base border border-glass bg-glass px-4 py-3 shadow-glass backdrop-blur-glass">
      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
        {number}
      </span>
      <p className="text-sm text-body">{children}</p>
    </li>
  )
}
