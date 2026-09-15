import type { Exercise, Workout } from '@/types'
import { getRawRows, rowsToObjects } from './sheetSource'
import { parseNotesCell, parseRepsCell, parseSetsCell, parseWeightCell, splitDisplayName } from './parseSheet'
import { getExerciseContent } from './exerciseContent'
import { slugify } from '@/lib/id'

// -----------------------------------------------------------------------------
// This is the single place that turns raw spreadsheet rows into the app's
// Workout/Exercise data model. Everything below (UI, storage, history) only
// ever imports WORKOUTS from this file — never sheetSource directly — so
// swapping the spreadsheet source (a real Google Sheets fetch, a different
// program) means changing this file alone.
// -----------------------------------------------------------------------------

function buildWorkouts(): Workout[] {
  const rows = rowsToObjects(getRawRows())
  const byDay = new Map<string, typeof rows>()

  for (const row of rows) {
    const list = byDay.get(row.day) ?? []
    list.push(row)
    byDay.set(row.day, list)
  }

  const workouts: Workout[] = []
  let dayNumber = 0

  for (const [dayLabel, dayRows] of byDay) {
    dayNumber += 1
    const focus = dayLabel.split('-').slice(1).join('-').trim() || dayLabel

    const exercises: Exercise[] = dayRows.map((row) => {
      const { name, shortName } = splitDisplayName(row.exercise)
      const notes = parseNotesCell(row.notes)
      const content = getExerciseContent(name)

      const exercise: Exercise = {
        id: `${slugify(dayLabel)}__${slugify(name)}`,
        name,
        shortName,
        sets: parseSetsCell(row.sets),
        prescription: toPrescription(parseRepsCell(row.reps, name), notes.eachSide),
        prescribedWeight: parseWeightCell(row.weight, name),
        supersetGroup: notes.supersetLabel ?? undefined,
        notes: notes.freeNote ?? undefined,
        media: { type: 'illustration', glyph: content.glyph },
        form: content.form,
      }
      return exercise
    })

    workouts.push({
      id: slugify(dayLabel),
      day: dayNumber,
      name: `Day ${dayNumber}`,
      focus,
      slug: slugify(focus),
      exercises,
      estimatedMinutes: estimateWorkoutMinutes(exercises),
    })
  }

  return workouts
}

function toPrescription(
  parsed: ReturnType<typeof parseRepsCell>,
  eachSide: boolean,
): Exercise['prescription'] {
  if (parsed.type === 'duration') {
    return { type: 'duration', durationSeconds: parsed.durationSeconds, eachSide }
  }
  return { type: 'reps', reps: parsed.reps, eachSide }
}

const SECONDS_PER_REP = 3.5
const REST_BETWEEN_SETS = 45

function estimateWorkoutMinutes(exercises: Exercise[]): number {
  let totalSeconds = 0
  for (const exercise of exercises) {
    const workSeconds =
      exercise.prescription.type === 'duration'
        ? exercise.prescription.durationSeconds ?? 30
        : (exercise.prescription.reps ?? 10) * SECONDS_PER_REP
    totalSeconds += exercise.sets * (workSeconds + REST_BETWEEN_SETS)
  }
  return Math.max(15, Math.round(totalSeconds / 60 / 5) * 5)
}

export const WORKOUTS: Workout[] = buildWorkouts()

export function getWorkoutById(id: string): Workout | undefined {
  return WORKOUTS.find((w) => w.id === id)
}

export function getExerciseById(exerciseId: string): Exercise | undefined {
  for (const workout of WORKOUTS) {
    const found = workout.exercises.find((e) => e.id === exerciseId)
    if (found) return found
  }
  return undefined
}

/** Groups a workout's exercises into either a single exercise or a superset round. */
export type WorkoutStep =
  | { type: 'single'; exercise: Exercise }
  | { type: 'superset'; groupId: string; exercises: Exercise[] }

export function toSteps(workout: Workout): WorkoutStep[] {
  const steps: WorkoutStep[] = []
  const seenGroups = new Set<string>()

  for (const exercise of workout.exercises) {
    if (exercise.supersetGroup) {
      if (seenGroups.has(exercise.supersetGroup)) continue
      seenGroups.add(exercise.supersetGroup)
      const groupExercises = workout.exercises.filter((e) => e.supersetGroup === exercise.supersetGroup)
      steps.push({ type: 'superset', groupId: exercise.supersetGroup, exercises: groupExercises })
    } else {
      steps.push({ type: 'single', exercise })
    }
  }

  return steps
}
