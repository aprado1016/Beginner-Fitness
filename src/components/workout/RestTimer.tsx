import { useEffect, useRef, useState } from 'react'
import { ClockIcon, CloseIcon } from '@/components/icons'
import { formatClock } from '@/lib/format'
import { playChime, vibrate } from '@/lib/feedback'
import { useAppState } from '@/state/AppStateContext'

interface RestTimerProps {
  seconds?: number
  onDismiss: () => void
}

/**
 * A non-blocking banner, not a modal — she can tap through to the next set at any time.
 * Sits inline in the flow rather than covering the screen.
 */
export function RestTimer({ seconds = 60, onDismiss }: RestTimerProps) {
  const { preferences } = useAppState()
  const [total, setTotal] = useState(seconds)
  const [remaining, setRemaining] = useState(seconds)
  const onDismissRef = useRef(onDismiss)
  onDismissRef.current = onDismiss

  useEffect(() => {
    const endTime = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const secLeft = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      setRemaining(secLeft)
      if (secLeft <= 0) {
        window.clearInterval(id)
        playChime('timerDone', preferences.soundEnabled)
        vibrate([80, 60, 80], preferences.hapticsEnabled)
        window.setTimeout(() => onDismissRef.current(), 900)
      }
    }, 250)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  const progress = 1 - remaining / total

  return (
    <div className="animate-rise-in glass-edges relative overflow-hidden rounded-base border border-glass bg-glass px-4 py-3 shadow-glass backdrop-blur-glass">
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-neutral-quaternary">
        <div
          className="h-full bg-brand transition-all duration-300 ease-linear"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ClockIcon className="h-5 w-5 text-fg-brand" />
          <div>
            <p className="text-sm font-semibold text-heading">Rest</p>
            <p className="text-xs text-body-subtle">Take a breather before the next set</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="min-w-[3ch] text-lg font-semibold tabular-nums text-heading">
            {formatClock(remaining)}
          </span>
          <button
            type="button"
            onClick={() => {
              setTotal((t) => t + 15)
              setRemaining((r) => r + 15)
            }}
            className="min-h-9 rounded-control border border-border-default-medium bg-neutral-secondary-medium px-2.5 text-xs font-medium text-body transition-colors hover:bg-neutral-tertiary-medium hover:text-heading"
          >
            +15
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Skip rest"
            className="flex h-9 w-9 items-center justify-center rounded-control text-body-subtle transition-colors hover:bg-neutral-secondary-medium hover:text-heading"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
