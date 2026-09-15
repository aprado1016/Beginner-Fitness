import { useEffect, useRef, useState } from 'react'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { formatClock } from '@/lib/format'

interface TimerRingProps {
  totalSeconds: number
  running: boolean
  onTick?: (remainingSeconds: number) => void
  onComplete: () => void
  size?: number
}

export function TimerRing({ totalSeconds, running, onTick, onComplete, size = 148 }: TimerRingProps) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const onCompleteRef = useRef(onComplete)
  const onTickRef = useRef(onTick)
  onCompleteRef.current = onComplete
  onTickRef.current = onTick

  useEffect(() => {
    setRemaining(totalSeconds)
  }, [totalSeconds])

  useEffect(() => {
    if (!running) return
    const endTime = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const msLeft = endTime - Date.now()
      const secLeft = Math.max(0, msLeft / 1000)
      setRemaining(secLeft)
      onTickRef.current?.(secLeft)
      if (secLeft <= 0) {
        window.clearInterval(id)
        onCompleteRef.current()
      }
    }, 100)
    return () => window.clearInterval(id)
    // Intentionally re-runs only when `running` flips, so pausing/resuming restarts the countdown from the current `remaining`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const displaySeconds = Math.ceil(remaining)

  return (
    <ProgressRing progress={remaining / totalSeconds} size={size} strokeWidth={8}>
      <div className="flex flex-col items-center">
        <span className="text-4xl font-semibold tabular-nums text-heading">{formatClock(displaySeconds)}</span>
        <span className="text-xs font-medium text-body-subtle">{running ? 'in progress' : 'paused'}</span>
      </div>
    </ProgressRing>
  )
}
