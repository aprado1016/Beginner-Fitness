import type { Exercise, ExerciseSession } from '@/types'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExerciseMedia } from './ExerciseMedia'
import { HowToDoIt } from './HowToDoIt'
import { SetRow } from './SetRow'
import { SegmentedProgressBar } from '@/components/ui/SegmentedProgressBar'
import { CheckIcon } from '@/components/icons'
import type { LastPerformance } from '@/lib/workoutStats'
import { formatRelativeDate } from '@/lib/format'

interface SupersetPanelProps {
  exercises: Exercise[]
  sessionsByExerciseId: Record<string, ExerciseSession>
  lastPerformances: Record<string, LastPerformance | undefined>
  onToggleSet: (exerciseId: string, setIndex: number) => void
  onChangeWeight: (exerciseId: string, setIndex: number, weight: number | null) => void
  onChangeReps: (exerciseId: string, setIndex: number, reps: number) => void
  onCompleteWithDuration: (exerciseId: string, setIndex: number, durationSeconds: number) => void
}

export function SupersetPanel({
  exercises,
  sessionsByExerciseId,
  lastPerformances,
  onToggleSet,
  onChangeWeight,
  onChangeReps,
  onCompleteWithDuration,
}: SupersetPanelProps) {
  const totalRounds = exercises[0]?.sets ?? 3

  let currentRound = totalRounds - 1
  for (let round = 0; round < totalRounds; round += 1) {
    const roundComplete = exercises.every((ex) => sessionsByExerciseId[ex.id]?.sets[round]?.completed)
    if (!roundComplete) {
      currentRound = round
      break
    }
    if (round === totalRounds - 1) currentRound = totalRounds // all done
  }

  const allComplete = currentRound >= totalRounds
  const roundsDone = exercises.length
    ? Math.min(...exercises.map((ex) => sessionsByExerciseId[ex.id]?.sets.filter((s) => s.completed).length ?? 0))
    : 0

  const pendingRepsExercises = !allComplete
    ? exercises.filter((ex) => ex.prescription.type === 'reps' && !sessionsByExerciseId[ex.id]?.sets[currentRound]?.completed)
    : []

  return (
    <GlassCard padding="none" className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-control border border-border-brand/40 bg-brand-softer px-2.5 py-1 text-xs font-semibold text-fg-brand-strong">
          Superset — perform back to back
        </span>
        <span className="text-xs font-medium text-body-subtle">
          {allComplete ? 'All rounds complete' : `Round ${currentRound + 1} of ${totalRounds}`}
        </span>
      </div>

      <div className="px-4 pb-1">
        <SegmentedProgressBar total={totalRounds} completed={roundsDone} />
      </div>

      <div className="divide-y divide-glass-subtle px-4">
        {exercises.map((exercise, i) => {
          const session = sessionsByExerciseId[exercise.id]
          const currentSet = session?.sets[Math.min(currentRound, totalRounds - 1)]
          const last = lastPerformances[exercise.id]
          if (!session || !currentSet) return null

          return (
            <div key={exercise.id} className="py-4">
              <div className="flex items-center gap-3">
                <div className="w-16 flex-shrink-0">
                  <ExerciseMedia media={exercise.media} exerciseName={exercise.name} size="md" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-heading">{exercise.name}</h3>
                  {exercise.shortName && <p className="text-xs text-body-subtle">{exercise.shortName}</p>}
                  {last && (
                    <p className="mt-0.5 text-xs font-medium text-fg-brand-strong">
                      Last time ({formatRelativeDate(last.dateISO)}): {last.weight !== null ? `${last.weight} lb` : 'Bodyweight'}
                    </p>
                  )}
                </div>
                {i < exercises.length - 1 && (
                  <span aria-hidden className="text-lg text-body-subtle">
                    ↓
                  </span>
                )}
              </div>

              <div className="mt-3">
                {allComplete ? (
                  <div className="flex items-center gap-2 rounded-control bg-success-soft px-3 py-2.5 text-sm font-medium text-success-strong">
                    <CheckIcon className="h-4 w-4" /> All {totalRounds} rounds complete
                  </div>
                ) : (
                  <SetRow
                    set={currentSet}
                    prescription={exercise.prescription}
                    weight={currentSet.actualWeight ?? null}
                    onToggle={() => onToggleSet(exercise.id, currentSet.setIndex)}
                    onChangeWeight={(w) => onChangeWeight(exercise.id, currentSet.setIndex, w)}
                    onChangeReps={(r) => onChangeReps(exercise.id, currentSet.setIndex, r)}
                    onCompleteWithDuration={(d) => onCompleteWithDuration(exercise.id, currentSet.setIndex, d)}
                  />
                )}
              </div>

              <div className="mt-1">
                <HowToDoIt form={exercise.form} />
              </div>
            </div>
          )
        })}
      </div>

      {!allComplete && pendingRepsExercises.length > 1 && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={() => {
              for (const ex of pendingRepsExercises) {
                onToggleSet(ex.id, currentRound)
              }
            }}
            className="min-h-12 w-full rounded-base bg-brand text-sm font-semibold text-white shadow-xs transition-transform active:scale-[0.98]"
          >
            Complete Round {currentRound + 1}
          </button>
        </div>
      )}
    </GlassCard>
  )
}
