// Real demonstration photos, sourced from free-exercise-db (public domain / Unlicense —
// https://github.com/yuhonas/free-exercise-db). Each entry was hand-checked against the
// actual photo content (that dataset has some mislabeled images) before being wired in here.
// Exercises with no reliable real-photo match fall back to the illustrated pictogram instead
// of showing a misleading demonstration.
//
// `frames` is 1 or 2 image paths (under /exercises/<id>/) — two frames crossfade to suggest
// motion between the start and end position; one frame is shown static.

export interface ExercisePhotoMedia {
  frames: [string] | [string, string]
}

const EXERCISE_PHOTOS: Record<string, ExercisePhotoMedia> = {
  'day-1-full-body__dumbbell-squat-press': { frames: ['/exercises/Kettlebell_Thruster/0.jpg', '/exercises/Kettlebell_Thruster/1.jpg'] },
  'day-1-full-body__push-up': { frames: ['/exercises/Pushups/0.jpg', '/exercises/Pushups/1.jpg'] },
  'day-1-full-body__plank': { frames: ['/exercises/Plank/1.jpg'] },
  'day-1-full-body__glute-bridge': { frames: ['/exercises/Butt_Lift_Bridge/0.jpg', '/exercises/Butt_Lift_Bridge/1.jpg'] },
  'day-1-full-body__suitcase-crunch': { frames: ['/exercises/Crunches/0.jpg', '/exercises/Crunches/1.jpg'] },
  'day-1-full-body__leg-switches': { frames: ['/exercises/Scissor_Kick/0.jpg', '/exercises/Scissor_Kick/1.jpg'] },

  'day-2-upper-body__push-up': { frames: ['/exercises/Pushups/0.jpg', '/exercises/Pushups/1.jpg'] },
  'day-2-upper-body__dumbbell-lateral-raise': { frames: ['/exercises/Side_Lateral_Raise/0.jpg', '/exercises/Side_Lateral_Raise/1.jpg'] },
  'day-2-upper-body__dumbbell-front-raise': { frames: ['/exercises/Front_Dumbbell_Raise/0.jpg', '/exercises/Front_Dumbbell_Raise/1.jpg'] },
  'day-2-upper-body__db-front-hold': {
    frames: [
      '/exercises/Standing_Dumbbell_Straight-Arm_Front_Delt_Raise_Above_Head/0.jpg',
      '/exercises/Standing_Dumbbell_Straight-Arm_Front_Delt_Raise_Above_Head/1.jpg',
    ],
  },
  'day-2-upper-body__renegade-row': { frames: ['/exercises/Alternating_Renegade_Row/0.jpg', '/exercises/Alternating_Renegade_Row/1.jpg'] },
  'day-2-upper-body__dumbbell-upright-row': { frames: ['/exercises/Standing_Dumbbell_Upright_Row/0.jpg', '/exercises/Standing_Dumbbell_Upright_Row/1.jpg'] },

  'day-3-lower-body__kettlebell-goblet-squat': { frames: ['/exercises/Goblet_Squat/0.jpg', '/exercises/Goblet_Squat/1.jpg'] },
  'day-3-lower-body__walking-lunge': { frames: ['/exercises/Bodyweight_Walking_Lunge/1.jpg'] },
  // No reliable real photo for a *standing* vertical crunch in the source dataset — falls back to the illustration.
  'day-3-lower-body__romanian-deadlift': { frames: ['/exercises/Romanian_Deadlift/0.jpg', '/exercises/Romanian_Deadlift/1.jpg'] },
  'day-3-lower-body__dumbbell-hip-thrust': { frames: ['/exercises/Barbell_Hip_Thrust/0.jpg', '/exercises/Barbell_Hip_Thrust/1.jpg'] },
  'day-3-lower-body__elevated-reverse-lunge': { frames: ['/exercises/Elevated_Back_Lunge/1.jpg'] },
  'day-3-lower-body__weighted-overhead-sit-up': { frames: ['/exercises/Press_Sit-Up/1.jpg'] },
}

export function getExercisePhoto(exerciseId: string): ExercisePhotoMedia | undefined {
  return EXERCISE_PHOTOS[exerciseId]
}
