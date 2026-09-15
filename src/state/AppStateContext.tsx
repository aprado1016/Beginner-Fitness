import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState, Exercise, Preferences, SetLog, Workout, WorkoutSession } from '@/types'
import { defaultState, loadState, saveState } from '@/lib/storage'
import { generateId } from '@/lib/id'
import { todayISO } from '@/lib/format'
import { getLastPerformance } from '@/lib/workoutStats'
import { getWorkoutById } from '@/data/workouts'

interface AppStateContextValue {
  state: AppState
  preferences: Preferences
  sessions: WorkoutSession[]
  activeSession: WorkoutSession | undefined
  activeWorkout: Workout | undefined
  startSession: (workout: Workout) => WorkoutSession
  resumeOrStartSession: (workout: Workout) => WorkoutSession
  logSet: (exerciseId: string, setIndex: number, patch: Partial<SetLog>) => void
  completeSession: () => void
  discardActiveSession: () => void
  updatePreferences: (patch: Partial<Preferences>) => void
  lastPerformance: (exerciseId: string) => ReturnType<typeof getLastPerformance>
}

const AppStateContext = createContext<AppStateContextValue | null>(null)

function initializeExerciseSessions(workout: Workout, sessions: WorkoutSession[]) {
  return workout.exercises.map((exercise: Exercise) => {
    const last = getLastPerformance(sessions, exercise.id)
    const sets: SetLog[] = Array.from({ length: exercise.sets }, (_, i) => ({
      setIndex: i,
      completed: false,
      actualReps: exercise.prescription.type === 'reps' ? exercise.prescription.reps : undefined,
      actualDurationSeconds:
        exercise.prescription.type === 'duration' ? exercise.prescription.durationSeconds : undefined,
      actualWeight: last?.weight ?? exercise.prescribedWeight,
    }))
    return { exerciseId: exercise.id, sets }
  })
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const activeSession = useMemo(
    () => state.sessions.find((s) => s.id === state.activeSessionId),
    [state.sessions, state.activeSessionId],
  )

  const activeWorkout = activeSession ? getWorkoutById(activeSession.workoutId) : undefined

  const startSession = useCallback(
    (workout: Workout) => {
      const session: WorkoutSession = {
        id: generateId('session'),
        workoutId: workout.id,
        dateISO: todayISO(),
        startedAt: Date.now(),
        completed: false,
        exerciseSessions: initializeExerciseSessions(workout, state.sessions),
      }
      setState((prev) => ({
        ...prev,
        sessions: [...prev.sessions, session],
        activeSessionId: session.id,
      }))
      return session
    },
    [state.sessions],
  )

  const resumeOrStartSession = useCallback(
    (workout: Workout) => {
      const existing = state.sessions.find(
        (s) => !s.completed && s.workoutId === workout.id && s.id === state.activeSessionId,
      )
      if (existing) return existing
      return startSession(workout)
    },
    [state.sessions, state.activeSessionId, startSession],
  )

  const logSet = useCallback((exerciseId: string, setIndex: number, patch: Partial<SetLog>) => {
    setState((prev) => {
      if (!prev.activeSessionId) return prev
      const sessions = prev.sessions.map((session) => {
        if (session.id !== prev.activeSessionId) return session
        const exerciseSessions = session.exerciseSessions.map((es) => {
          if (es.exerciseId !== exerciseId) return es
          const sets = es.sets.map((set) => (set.setIndex === setIndex ? { ...set, ...patch } : set))
          return { ...es, sets }
        })
        return { ...session, exerciseSessions }
      })
      return { ...prev, sessions }
    })
  }, [])

  const completeSession = useCallback(() => {
    setState((prev) => {
      const session = prev.sessions.find((s) => s.id === prev.activeSessionId)
      if (!session) return prev
      const durationSeconds = Math.round((Date.now() - session.startedAt) / 1000)
      const sessions = prev.sessions.map((s) =>
        s.id === session.id ? { ...s, completed: true, completedAt: Date.now(), durationSeconds } : s,
      )
      return { ...prev, sessions, activeSessionId: null }
    })
  }, [])

  const discardActiveSession = useCallback(() => {
    setState((prev) => ({ ...prev, activeSessionId: null }))
  }, [])

  const updatePreferences = useCallback((patch: Partial<Preferences>) => {
    setState((prev) => ({ ...prev, preferences: { ...prev.preferences, ...patch } }))
  }, [])

  const lastPerformanceFn = useCallback(
    (exerciseId: string) => getLastPerformance(state.sessions, exerciseId),
    [state.sessions],
  )

  const value: AppStateContextValue = {
    state,
    preferences: state.preferences,
    sessions: state.sessions,
    activeSession,
    activeWorkout,
    startSession,
    resumeOrStartSession,
    logSet,
    completeSession,
    discardActiveSession,
    updatePreferences,
    lastPerformance: lastPerformanceFn,
  }

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider')
  return ctx
}

// Reset default export helper used by tests/dev tools if ever needed.
export const emptyAppState = defaultState
