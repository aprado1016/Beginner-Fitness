import type { Workout, WorkoutSession } from '@/types'
import { WORKOUTS, getWorkoutById } from '@/data/workouts'
import { todayISO } from './format'

export function getCompletedSessions(sessions: WorkoutSession[]): WorkoutSession[] {
  return sessions
    .filter((s) => s.completed)
    .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))
}

/** Rotation-based "what's next": advances one day past whatever was most recently completed. */
export function getNextWorkout(sessions: WorkoutSession[]): Workout {
  const completed = getCompletedSessions(sessions)
  if (completed.length === 0) return WORKOUTS[0]

  const lastWorkout = getWorkoutById(completed[0].workoutId)
  if (!lastWorkout) return WORKOUTS[0]

  const nextDay = (lastWorkout.day % WORKOUTS.length) + 1
  return WORKOUTS.find((w) => w.day === nextDay) ?? WORKOUTS[0]
}

export function wasCompletedToday(sessions: WorkoutSession[], workoutId: string): WorkoutSession | undefined {
  const today = todayISO()
  return sessions.find((s) => s.completed && s.workoutId === workoutId && s.dateISO === today)
}

export interface LastPerformance {
  weight: number | null
  reps?: number
  durationSeconds?: number
  dateISO: string
}

/** Most recent logged set for an exercise, across any completed session — powers "Last time: 25 lb". */
export function getLastPerformance(sessions: WorkoutSession[], exerciseId: string): LastPerformance | undefined {
  const completed = getCompletedSessions(sessions)
  for (const session of completed) {
    const exerciseSession = session.exerciseSessions.find((e) => e.exerciseId === exerciseId)
    if (!exerciseSession) continue
    const loggedSets = exerciseSession.sets.filter((s) => s.completed)
    if (loggedSets.length === 0) continue
    const last = loggedSets[loggedSets.length - 1]
    return {
      weight: last.actualWeight ?? null,
      reps: last.actualReps,
      durationSeconds: last.actualDurationSeconds,
      dateISO: session.dateISO,
    }
  }
  return undefined
}

export interface WeightPoint {
  dateISO: string
  weight: number
  isPersonalBest?: boolean
}

/** One point per session date, using the heaviest completed set logged that day. */
export function getWeightHistory(sessions: WorkoutSession[], exerciseId: string): WeightPoint[] {
  const completed = getCompletedSessions(sessions).slice().reverse() // oldest -> newest
  const points: WeightPoint[] = []

  for (const session of completed) {
    const exerciseSession = session.exerciseSessions.find((e) => e.exerciseId === exerciseId)
    if (!exerciseSession) continue
    const weights = exerciseSession.sets
      .filter((s) => s.completed && typeof s.actualWeight === 'number')
      .map((s) => s.actualWeight as number)
    if (weights.length === 0) continue
    points.push({ dateISO: session.dateISO, weight: Math.max(...weights) })
  }

  let best = -Infinity
  for (const point of points) {
    if (point.weight > best) {
      best = point.weight
      point.isPersonalBest = true
    }
  }

  return points
}

export function countSetsCompleted(session: WorkoutSession): number {
  return session.exerciseSessions.reduce((sum, e) => sum + e.sets.filter((s) => s.completed).length, 0)
}

export function getCurrentWeek(sessions: WorkoutSession[]): number {
  const completed = getCompletedSessions(sessions)
  if (completed.length === 0) return 1
  const firstDate = new Date(completed[completed.length - 1].dateISO)
  const now = new Date()
  const diffDays = Math.max(0, Math.round((now.getTime() - firstDate.getTime()) / (24 * 60 * 60 * 1000)))
  return Math.floor(diffDays / 7) + 1
}
