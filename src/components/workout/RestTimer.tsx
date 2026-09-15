import { useEffect, useRef, useState } from 'react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { CloseIcon } from '@/components/icons'
import { formatClock } from '@/lib/format'
import { playChime, vibrate } from '@/lib/feedback'
import { useAppState } from '@/state/AppStateContext'

interface RestTimerProps {
  seconds?: number
  onDismiss: () => void
}

/**
 * A non-blocking banner, not a modal — she can tap through to the next set at any time.
 * Lives in the fixed top stack (not inline in content), so no card chrome of its own here.
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

  return (
    <div className="animate-rise-in flex items-center gap-3">
      <ProgressRing progress={remaining / total} size={44} strokeWidth={4}>
        <span className="text-xs font-bold tabular-nums text-heading">{formatClock(remaining)}</span>
      </ProgressRing>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-heading">Rest</p>
        <p className="truncate text-xs text-body-subtle">Take a breather before the next set</p>
      </div>

      <button
        type="button"
        onClick={() => {
          setTotal((t) => t + 15)
          setRemaining((r) => r + 15)
        }}
        className="min-h-9 flex-shrink-0 rounded-control border border-border-default-medium bg-neutral-secondary-medium px-2.5 text-xs font-medium text-body transition-colors hover:bg-neutral-tertiary-medium hover:text-heading"
      >
        +15
      </button>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Skip rest"
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-control text-body-subtle transition-colors hover:bg-neutral-secondary-medium hover:text-heading"
      >
        <CloseIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
