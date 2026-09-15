import { useState } from 'react'
import type { ExercisePrescription, SetLog } from '@/types'
import { CheckIcon, ChevronDownIcon, MinusIcon, PlayIcon, PlusIcon } from '@/components/icons'
import { TimerRing } from './TimerRing'
import { formatClock } from '@/lib/format'
import { clsx } from '@/lib/clsx'
import { playChime, vibrate } from '@/lib/feedback'
import { useAppState } from '@/state/AppStateContext'

interface SetRowProps {
  set: SetLog
  prescription: ExercisePrescription
  weight: number | null
  onToggle: () => void
  onChangeWeight: (weight: number | null) => void
  onChangeReps: (reps: number) => void
  onCompleteWithDuration: (durationSeconds: number) => void
}

export function SetRow({
  set,
  prescription,
  weight,
  onToggle,
  onChangeWeight,
  onChangeReps,
  onCompleteWithDuration,
}: SetRowProps) {
  const { preferences } = useAppState()
  const [timing, setTiming] = useState(false)
  const [editing, setEditing] = useState(false)
  const isBodyweight = weight === null

  const handleComplete = () => {
    playChime('setComplete', preferences.soundEnabled)
    vibrate(30, preferences.hapticsEnabled)
    onToggle()
  }

  if (prescription.type === 'duration') {
    const target = prescription.durationSeconds ?? 30

    if (timing) {
      return (
        <div className="animate-rise-in flex flex-col items-center gap-3 rounded-base border border-glass-subtle bg-glass-hover px-4 py-5">
          <TimerRing
            totalSeconds={target}
            running
            onComplete={() => {
              setTiming(false)
              playChime('timerDone', preferences.soundEnabled)
              vibrate([60, 40, 60, 40, 120], preferences.hapticsEnabled)
              onCompleteWithDuration(target)
            }}
          />
          <button
            type="button"
            onClick={() => {
              setTiming(false)
              onCompleteWithDuration(target)
            }}
            className="min-h-9 text-xs font-medium text-body-subtle underline decoration-body-subtle/40 underline-offset-2 hover:text-heading"
          >
            I'm done early
          </button>
        </div>
      )
    }

    return (
      <div
        className={clsx(
          'flex min-h-14 items-center justify-between gap-3 rounded-control px-3 py-2 transition-colors',
          set.completed ? 'bg-success-soft' : 'bg-neutral-secondary-soft',
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <CompletionDot completed={set.completed} onClick={set.completed ? handleComplete : undefined} />
          <div className="min-w-0">
            <p className={clsx('truncate text-sm font-medium', set.completed ? 'text-success-strong' : 'text-heading')}>
              {set.completed ? 'Completed' : `${target} sec`}
            </p>
            {!isBodyweight && <p className="text-xs text-body-subtle">{weight} lb</p>}
          </div>
        </div>
        {!set.completed && (
          <button
            type="button"
            onClick={() => setTiming(true)}
            className="inline-flex min-h-11 flex-shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-sm font-semibold text-white shadow-xs transition-transform active:scale-95"
          >
            <PlayIcon className="h-3.5 w-3.5" />
            Start
          </button>
        )}
      </div>
    )
  }

  const reps = set.actualReps ?? prescription.reps ?? 10
  const summary = `${reps} reps${prescription.eachSide ? '/side' : ''} · ${isBodyweight ? 'Bodyweight' : `${weight} lb`}`

  return (
    <div className={clsx('rounded-control transition-colors', set.completed ? 'bg-success-soft' : 'bg-neutral-secondary-soft')}>
      <div className="flex min-h-14 items-center justify-between gap-2 px-3 py-2">
        <div className="flex min-w-0 items-center gap-3">
          <CompletionDot completed={set.completed} onClick={handleComplete} />
          <span className={clsx('flex-shrink-0 text-sm font-medium', set.completed ? 'text-success-strong' : 'text-heading')}>
            {set.completed ? 'Completed' : `Set ${set.setIndex + 1}`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          aria-expanded={editing}
          className="flex min-h-9 flex-shrink-0 items-center gap-1 rounded-full border border-border-default-medium bg-neutral-primary-soft px-3 text-xs font-medium text-body transition-colors hover:bg-neutral-secondary-medium hover:text-heading"
        >
          {summary}
          <ChevronDownIcon className={clsx('h-3.5 w-3.5 transition-transform', editing && 'rotate-180')} />
        </button>
      </div>

      {editing && (
        <div className="animate-rise-in flex items-center justify-center gap-6 border-t border-glass-subtle px-3 py-3">
          <MiniStepper
            label="Reps"
            value={reps}
            step={1}
            min={1}
            onChange={onChangeReps}
            format={(v) => `${v}`}
          />
          <div className="h-10 w-px bg-glass-subtle" />
          <MiniStepper
            label="Weight"
            value={weight ?? 0}
            step={2.5}
            min={0}
            onChange={(v) => onChangeWeight(v === 0 ? null : v)}
            format={(v) => (v === 0 ? 'BW' : `${v}`)}
          />
        </div>
      )}
    </div>
  )
}

function MiniStepper({
  label,
  value,
  step,
  min,
  onChange,
  format,
}: {
  label: string
  value: number
  step: number
  min: number
  onChange: (value: number) => void
  format: (value: number) => string
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-body-subtle">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label.toLowerCase()}`}
          onClick={() => onChange(Math.max(min, value - step))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-secondary-medium text-body transition-transform active:scale-90"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="min-w-[3.5ch] text-center text-base font-semibold tabular-nums text-heading">
          {format(value)}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label.toLowerCase()}`}
          onClick={() => onChange(value + step)}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-secondary-medium text-body transition-transform active:scale-90"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

function CompletionDot({ completed, onClick }: { completed: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={completed}
      aria-label={completed ? 'Mark set as not done' : 'Mark set as done'}
      className={clsx(
        'flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 active:scale-90',
        completed ? 'border-success bg-success text-white' : 'border-border-default-medium bg-transparent text-transparent hover:border-brand',
      )}
    >
      {completed && <CheckIcon className="h-5 w-5 animate-pop" />}
    </button>
  )
}

export function formatSetTarget(prescription: ExercisePrescription, weight: number | null): string {
  const parts: string[] = []
  if (prescription.type === 'duration') {
    parts.push(formatClock(prescription.durationSeconds ?? 30))
  } else {
    parts.push(`${prescription.reps ?? 10} reps${prescription.eachSide ? ' each side' : ''}`)
  }
  if (weight !== null) parts.push(`${weight} lb`)
  return parts.join(' — ')
}
