import type { Exercise, ExerciseSession } from '@/types'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExerciseMedia } from './ExerciseMedia'
import { HowToDoIt } from './HowToDoIt'
import { SetRow } from './SetRow'
import type { LastPerformance } from '@/lib/workoutStats'
import { formatRelativeDate } from '@/lib/format'

interface ExerciseCardProps {
  exercise: Exercise
  session: ExerciseSession
  lastPerformance?: LastPerformance
  onToggleSet: (setIndex: number) => void
  onChangeWeight: (setIndex: number, weight: number | null) => void
  onChangeReps: (setIndex: number, reps: number) => void
  onCompleteWithDuration: (setIndex: number, durationSeconds: number) => void
}

export function ExerciseCard({
  exercise,
  session,
  lastPerformance,
  onToggleSet,
  onChangeWeight,
  onChangeReps,
  onCompleteWithDuration,
}: ExerciseCardProps) {
  return (
    <GlassCard padding="none" className="overflow-hidden">
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold leading-snug text-heading">{exercise.name}</h2>
            {exercise.shortName && <p className="text-xs text-body-subtle">{exercise.shortName}</p>}
          </div>
        </div>
        {lastPerformance && (
          <p className="mt-1 text-xs font-medium text-fg-brand-strong">
            Last time ({formatRelativeDate(lastPerformance.dateISO)}):{' '}
            {lastPerformance.weight !== null ? `${lastPerformance.weight} lb` : 'Bodyweight'}
          </p>
        )}
        {exercise.notes && <p className="mt-1 text-xs text-body-subtle">{exercise.notes}</p>}
      </div>

      <div className="px-4">
        <ExerciseMedia media={exercise.media} exerciseName={exercise.name} />
      </div>

      <div className="space-y-2 p-4">
        {session.sets.map((set) => (
          <SetRow
            key={set.setIndex}
            set={set}
            prescription={exercise.prescription}
            weight={set.actualWeight ?? null}
            onToggle={() => onToggleSet(set.setIndex)}
            onChangeWeight={(w) => onChangeWeight(set.setIndex, w)}
            onChangeReps={(r) => onChangeReps(set.setIndex, r)}
            onCompleteWithDuration={(d) => onCompleteWithDuration(set.setIndex, d)}
          />
        ))}
      </div>

      <div className="px-3 pb-1">
        <HowToDoIt form={exercise.form} />
      </div>
    </GlassCard>
  )
}
