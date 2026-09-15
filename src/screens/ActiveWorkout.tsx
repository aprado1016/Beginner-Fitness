import { useEffect, useLayoutEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
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

const SWIPE_DISTANCE_THRESHOLD = 55
const SWIPE_DIRECTION_RATIO = 1.4

export function ActiveWorkout() {
  const navigate = useNavigate()
  const { activeSession, activeWorkout, logSet, completeSession, lastPerformance } = useAppState()

  const steps = useMemo(() => (activeWorkout ? toSteps(activeWorkout) : []), [activeWorkout])
  const [stepIndex, setStepIndex] = useState(0)
  const [showRest, setShowRest] = useState(false)
  const [restKey, setRestKey] = useState(0)
  const completedRef = useRef(false)

  const topStackRef = useRef<HTMLDivElement>(null)
  const bottomStackRef = useRef<HTMLDivElement>(null)
  const [topOffset, setTopOffset] = useState(64)
  const [bottomOffset, setBottomOffset] = useState(96)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (!activeSession || !activeWorkout) {
      navigate('/', { replace: true })
    }
  }, [activeSession, activeWorkout, navigate])

  useLayoutEffect(() => {
    const topEl = topStackRef.current
    const bottomEl = bottomStackRef.current
    if (!topEl || !bottomEl) return

    // contentRect excludes the observed element's own padding — the bottom pill wrapper sets
    // its safe-area padding directly on the observed element, so border-box size is used here
    // to get the true rendered height (falls back to contentRect where borderBoxSize isn't supported).
    const heightOf = (entry: ResizeObserverEntry) =>
      entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height

    const topObserver = new ResizeObserver(([entry]) => setTopOffset(heightOf(entry)))
    const bottomObserver = new ResizeObserver(([entry]) => setBottomOffset(heightOf(entry)))
    topObserver.observe(topEl)
    bottomObserver.observe(bottomEl)
    return () => {
      topObserver.disconnect()
      bottomObserver.disconnect()
    }
  }, [])

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

  const goToStep = (index: number) => setStepIndex(Math.max(0, Math.min(steps.length - 1, index)))
  const goPrev = () => goToStep(stepIndex - 1)
  const goNext = () => goToStep(stepIndex + 1)

  const handleTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const handleTouchEnd = (e: TouchEvent) => {
    const start = touchStart.current
    touchStart.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.abs(dx) < SWIPE_DISTANCE_THRESHOLD) return
    if (Math.abs(dx) < Math.abs(dy) * SWIPE_DIRECTION_RATIO) return
    if (dx < 0) goNext()
    else goPrev()
  }

  return (
    <div className="animate-fade-in relative min-h-dvh">
      {/* Fixed top stack: exit + set-completion progress + rest timer. Always visible, above scroll. */}
      <div ref={topStackRef} className="fixed inset-x-0 top-0 z-40">
        <div className="glass-edges border-b border-glass bg-glass backdrop-blur-glass">
          <div
            className="flex items-center gap-3 px-4 pb-3"
            style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0.75rem)' }}
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Exit workout"
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-body-subtle hover:bg-neutral-secondary-medium hover:text-heading"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
            <SegmentedProgressBar total={totalSets} completed={completedSets} className="flex-1" />
          </div>
        </div>
        {showRest && (
          <div className="border-b border-glass bg-glass px-4 py-2.5 backdrop-blur-glass">
            <RestTimer key={restKey} onDismiss={() => setShowRest(false)} />
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div
        className="px-4"
        style={{
          paddingTop: topOffset + 16,
          paddingBottom: bottomOffset + 16,
          transition: 'padding-top 200ms ease, padding-bottom 200ms ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
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
      </div>

      {/* Fixed bottom pill: prev/next + day/exercise label + step dots. Always visible, above scroll. */}
      <div
        ref={bottomStackRef}
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 1rem)' }}
      >
        <div className="glass-edges flex items-center gap-1 rounded-full border border-glass bg-glass p-1.5 shadow-glass backdrop-blur-glass">
          <button
            type="button"
            disabled={stepIndex === 0}
            onClick={goPrev}
            aria-label="Previous exercise"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-body-subtle transition-colors hover:bg-neutral-secondary-medium hover:text-heading disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>

          <div className="flex min-w-[132px] flex-col items-center px-1">
            <p className="max-w-[160px] truncate text-[10px] font-semibold uppercase tracking-wide text-fg-brand-emphasis">
              {activeWorkout.name} — {activeWorkout.focus}
            </p>
            <p className="text-xs font-medium text-body-subtle">
              Exercise {Math.min(firstExerciseNumber, activeWorkout.exercises.length)} of {activeWorkout.exercises.length}
            </p>
            <div className="mt-1.5 flex gap-1">
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

          <button
            type="button"
            disabled={stepIndex === steps.length - 1}
            onClick={goNext}
            aria-label="Next exercise"
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-body-subtle transition-colors hover:bg-neutral-secondary-medium hover:text-heading disabled:opacity-30"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
