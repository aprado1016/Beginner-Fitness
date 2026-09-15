import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '@/state/AppStateContext'
import { toSteps } from '@/data/workouts'
import { ExerciseCard } from '@/components/workout/ExerciseCard'
import { SupersetPanel } from '@/components/workout/SupersetPanel'
import { RestTimer } from '@/components/workout/RestTimer'
import { SegmentedProgressBar } from '@/components/ui/SegmentedProgressBar'
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/components/icons'
import { clsx } from '@/lib/clsx'
import type { ExerciseSession } from '@/types'

export function ActiveWorkout() {
  const navigate = useNavigate()
  const { activeSession, activeWorkout, logSet, completeSession, lastPerformance } = useAppState()

  const steps = useMemo(() => (activeWorkout ? toSteps(activeWorkout) : []), [activeWorkout])
  const [stepIndex, setStepIndex] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [restKey, setRestKey] = useState(0)
  const completedRef = useRef(false)

  useEffect(() => {
    if (!activeSession || !activeWorkout) {
      navigate('/', { replace: true })
    }
  }, [activeSession, activeWorkout, navigate])

  const sessionsByExerciseId = useMemo(() => {
    const map: Record<string, ExerciseSession> = {}
    for (const es of activeSession?.exerciseSessions ?? []) map[es.exerciseId] = es
    return map
  }, [activeSession])

  const totalSets = useMemo(
    () => Object.values(sessionsByExerciseId).reduce((sum, es) => sum + es.sets.length, 0),
    [sessionsByExerciseId],
  )
  const completedSets = useMemo(
    () =>
      Object.values(sessionsByExerciseId).reduce((sum, es) => sum + es.sets.filter((s) => s.completed).length, 0),
    [sessionsByExerciseId],
  )

  const isStepComplete = (index: number) => {
    const step = steps[index]
    if (!step) return false
    if (step.type === 'single') {
      return sessionsByExerciseId[step.exercise.id]?.sets.every((s) => s.completed) ?? false
    }
    return step.exercises.every((ex) => sessionsByExerciseId[ex.id]?.sets.every((s) => s.completed))
  }

  // Auto-advance to the first incomplete step whenever it changes underneath us.
  useEffect(() => {
    if (steps.length === 0) return
    if (isStepComplete(stepIndex)) {
      const next = steps.findIndex((_, i) => i >= stepIndex && !isStepComplete(i))
      if (next !== -1 && next !== stepIndex) {
        const t = window.setTimeout(() => setStepIndex(next), 550)
        return () => window.clearTimeout(t)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionsByExerciseId, stepIndex, steps.length])

  // Detect full-workout completion.
  useEffect(() => {
    if (!activeSession || totalSets === 0) return
    if (completedSets === totalSets && !completedRef.current) {
      completedRef.current = true
      completeSession()
      window.setTimeout(() => navigate('/workout/complete', { replace: true }), 500)
    }
  }, [completedSets, totalSets, activeSession, completeSession, navigate])

  if (!activeSession || !activeWorkout || steps.length === 0) return null

  const step = steps[Math.min(stepIndex, steps.length - 1)]
  const firstExerciseNumber =
    activeWorkout.exercises.findIndex((e) => (step.type === 'single' ? e.id === step.exercise.id : e.id === step.exercises[0].id)) + 1

  const isLastSetOfWorkout = completedSets === totalSets - 1

  const triggerRest = () => {
    if (isLastSetOfWorkout) return
    setRestKey((k) => k + 1)
    setShowRest(true)
  }

  return (
    <div className="animate-fade-in flex min-h-dvh flex-col px-4 pt-[max(env(safe-area-inset-top,0px),0.75rem)]">
      <div className="flex items-center justify-between gap-2 py-2">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Exit workout"
          className="flex h-11 w-11 items-center justify-center rounded-full text-body-subtle hover:bg-neutral-secondary-medium hover:text-heading"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-fg-brand-emphasis">
            {activeWorkout.name} — {activeWorkout.focus}
          </p>
          <p className="text-sm font-medium text-body-subtle">
            Exercise {Math.min(firstExerciseNumber, activeWorkout.exercises.length)} of {activeWorkout.exercises.length}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            aria-label="Previous exercise"
            className="flex h-11 w-11 items-center justify-center rounded-full text-body-subtle hover:bg-neutral-secondary-medium hover:text-heading disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            disabled={stepIndex === steps.length - 1}
            onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            aria-label="Next exercise"
            className="flex h-11 w-11 items-center justify-center rounded-full text-body-subtle hover:bg-neutral-secondary-medium hover:text-heading disabled:opacity-30"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <SegmentedProgressBar total={totalSets} completed={completedSets} className="mb-4" />

      <div className="flex-1 space-y-3 pb-4">
        <div key={step.type === 'single' ? step.exercise.id : step.groupId} className="animate-rise-in">
          {step.type === 'single' ? (
            <ExerciseCard
              exercise={step.exercise}
              session={sessionsByExerciseId[step.exercise.id]}
              lastPerformance={lastPerformance(step.exercise.id)}
              onToggleSet={(setIndex) => {
                const set = sessionsByExerciseId[step.exercise.id].sets[setIndex]
                const nowComplete = !set.completed
                logSet(step.exercise.id, setIndex, { completed: nowComplete })
                if (nowComplete) triggerRest()
              }}
              onChangeWeight={(setIndex, w) => logSet(step.exercise.id, setIndex, { actualWeight: w })}
              onChangeReps={(setIndex, r) => logSet(step.exercise.id, setIndex, { actualReps: r })}
              onCompleteWithDuration={(setIndex, d) => {
                logSet(step.exercise.id, setIndex, { completed: true, actualDurationSeconds: d })
                triggerRest()
              }}
            />
          ) : (
            <SupersetPanel
              exercises={step.exercises}
              sessionsByExerciseId={sessionsByExerciseId}
              lastPerformances={Object.fromEntries(step.exercises.map((e) => [e.id, lastPerformance(e.id)]))}
              onToggleSet={(exerciseId, setIndex) => {
                const set = sessionsByExerciseId[exerciseId].sets[setIndex]
                const nowComplete = !set.completed
                logSet(exerciseId, setIndex, { completed: nowComplete })
                if (nowComplete) triggerRest()
              }}
              onChangeWeight={(exerciseId, setIndex, w) => logSet(exerciseId, setIndex, { actualWeight: w })}
              onChangeReps={(exerciseId, setIndex, r) => logSet(exerciseId, setIndex, { actualReps: r })}
              onCompleteWithDuration={(exerciseId, setIndex, d) => {
                logSet(exerciseId, setIndex, { completed: true, actualDurationSeconds: d })
                triggerRest()
              }}
            />
          )}
        </div>

        {showRest && <RestTimer key={restKey} onDismiss={() => setShowRest(false)} />}
      </div>

      <div className={clsx('flex justify-center gap-1.5 pb-4')}>
        {steps.map((s, i) => (
          <span
            key={s.type === 'single' ? s.exercise.id : s.groupId}
            className={clsx(
              'h-1.5 w-1.5 rounded-full transition-colors',
              i === stepIndex ? 'bg-brand' : isStepComplete(i) ? 'bg-brand/40' : 'bg-neutral-quaternary',
            )}
          />
        ))}
      </div>
    </div>
  )
}
