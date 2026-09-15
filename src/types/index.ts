// Core domain types. Mirrors the shape described in the product brief:
// Workout -> Exercise, and WorkoutSession -> ExerciseSession for logged history.

export type MeasureType = 'reps' | 'duration'

export interface ExercisePrescription {
  type: MeasureType
  /** Target reps, when type is 'reps'. */
  reps?: number
  /** Target duration in seconds, when type is 'duration'. */
  durationSeconds?: number
  /** True when the rep/duration target applies per side (e.g. "8 each leg"). */
  eachSide?: boolean
}

export type MediaType = 'illustration' | 'photo' | 'gif' | 'video' | 'image'

export interface ExerciseMedia {
  type: MediaType
  /** URL for the real asset. Left undefined until production media is sourced. */
  src?: string
  /** Second frame, for a photo pair that crossfades to suggest motion (start <-> end position). */
  srcAlt?: string
  poster?: string
  /** Glyph key used by the built-in placeholder illustration renderer (fallback when no photo/video is set). */
  glyph: ExerciseGlyph
}

export type ExerciseGlyph =
  | 'squat'
  | 'pushup'
  | 'plank'
  | 'bridge'
  | 'crunch'
  | 'legSwitch'
  | 'lateralRaise'
  | 'frontRaise'
  | 'frontHold'
  | 'row'
  | 'uprightRow'
  | 'gobletSquat'
  | 'lunge'
  | 'verticalCrunch'
  | 'deadlift'
  | 'hipThrust'
  | 'reverseLunge'
  | 'sitUp'

export interface FormGuidance {
  /** 2-4 short, beginner-friendly cues. */
  cues: string[]
  musclesWorked: string[]
  commonMistake: string
}

export interface Exercise {
  id: string
  /** Full beginner-friendly name, e.g. "Romanian Deadlift". */
  name: string
  /** Optional gym-shorthand shown as secondary text, e.g. "RDL". */
  shortName?: string
  sets: number
  prescription: ExercisePrescription
  /** Prescribed load in lb, or null for bodyweight-only moves. */
  prescribedWeight: number | null
  /** Exercises sharing a supersetGroup within the same workout are performed back-to-back as a round. */
  supersetGroup?: string
  notes?: string
  media: ExerciseMedia
  form: FormGuidance
}

export interface Workout {
  id: string
  day: number
  name: string
  /** Short marketing-style label, e.g. "Full Body". */
  focus: string
  slug: string
  exercises: Exercise[]
  estimatedMinutes: number
}

// ---- Session / history models ----

export interface SetLog {
  setIndex: number
  completed: boolean
  actualReps?: number
  actualDurationSeconds?: number
  actualWeight?: number | null
}

export interface ExerciseSession {
  exerciseId: string
  sets: SetLog[]
}

export interface WorkoutSession {
  id: string
  workoutId: string
  dateISO: string
  startedAt: number
  completedAt?: number
  durationSeconds?: number
  exerciseSessions: ExerciseSession[]
  completed: boolean
}

export interface Preferences {
  name: string
  theme: 'system' | 'light' | 'dark'
  soundEnabled: boolean
  hapticsEnabled: boolean
}

export interface AppState {
  version: number
  preferences: Preferences
  sessions: WorkoutSession[]
  /** id of the session currently in progress, if any. */
  activeSessionId: string | null
}
