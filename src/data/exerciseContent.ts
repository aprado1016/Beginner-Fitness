import type { ExerciseGlyph, FormGuidance } from '@/types'

export interface ExerciseContent {
  glyph: ExerciseGlyph
  form: FormGuidance
}

// Keyed by the exercise name exactly as it appears (post display-name split) in the sheet.
// This is the one place beginner-friendly coaching copy lives, kept separate from the
// workout structure so it can be edited or swapped for CMS-sourced content later.
export const EXERCISE_CONTENT: Record<string, ExerciseContent> = {
  'Dumbbell Squat Press': {
    glyph: 'squat',
    form: {
      cues: [
        'Feet shoulder-width apart, dumbbells at your shoulders',
        'Sit your hips back and down like sitting in a chair',
        'Push through your heels to stand, pressing the weights overhead',
      ],
      musclesWorked: ['Legs', 'Shoulders', 'Core'],
      commonMistake: 'Letting the knees cave inward — keep them tracking over your toes.',
    },
  },
  'Push Up': {
    glyph: 'pushup',
    form: {
      cues: [
        'Hands slightly wider than shoulders, body in one straight line',
        'Lower your chest toward the floor with elbows at ~45°',
        'Push back up without letting your hips sag',
      ],
      musclesWorked: ['Chest', 'Shoulders', 'Core'],
      commonMistake: 'Letting the hips drop — squeeze your core to keep a straight line.',
    },
  },
  Plank: {
    glyph: 'plank',
    form: {
      cues: [
        'Forearms on the floor, elbows under shoulders',
        'Body in one straight line from head to heels',
        'Squeeze your abs and glutes — breathe steadily',
      ],
      musclesWorked: ['Core', 'Shoulders'],
      commonMistake: 'Letting the hips rise or sag — imagine a straight board from head to heels.',
    },
  },
  'Glute Bridge': {
    glyph: 'bridge',
    form: {
      cues: [
        'Lie on your back, knees bent, feet flat on the floor',
        'Drive through your heels to lift your hips up',
        'Squeeze your glutes at the top, then lower with control',
      ],
      musclesWorked: ['Glutes', 'Hamstrings', 'Core'],
      commonMistake: 'Overarching the lower back — stop the lift once hips and shoulders line up.',
    },
  },
  'Suitcase Crunch': {
    glyph: 'crunch',
    form: {
      cues: [
        'Lie on your back, arms and legs extended',
        'Crunch up, bringing your hands toward your ankles',
        'Lower back down with control',
      ],
      musclesWorked: ['Core'],
      commonMistake: 'Yanking with the neck — lead the movement with your abs, not your chin.',
    },
  },
  'Leg Switches': {
    glyph: 'legSwitch',
    form: {
      cues: [
        'Lie on your back, legs extended a few inches off the floor',
        'Scissor one leg up while the other lowers, switching rhythmically',
        'Keep your lower back pressed gently into the floor',
      ],
      musclesWorked: ['Core', 'Hip flexors'],
      commonMistake: 'Letting the lower back arch off the floor — raise your legs higher if needed.',
    },
  },
  'Dumbbell Lateral Raise': {
    glyph: 'lateralRaise',
    form: {
      cues: [
        'Stand tall, a light dumbbell in each hand at your sides',
        'Raise both arms out to the sides until shoulder height',
        'Lower slowly — avoid swinging the weights up',
      ],
      musclesWorked: ['Shoulders'],
      commonMistake: 'Using momentum to swing the weights — move slowly and stay in control.',
    },
  },
  'Dumbbell Front Raise': {
    glyph: 'frontRaise',
    form: {
      cues: [
        'Stand tall, dumbbells resting in front of your thighs',
        'Raise both arms straight out in front to shoulder height',
        'Lower slowly back to the start',
      ],
      musclesWorked: ['Shoulders', 'Core'],
      commonMistake: 'Leaning back to help lift the weight — keep your torso upright.',
    },
  },
  'DB Front Hold': {
    glyph: 'frontHold',
    form: {
      cues: [
        'Raise both dumbbells straight out in front at shoulder height',
        'Hold the position — arms straight, core braced',
        'Breathe steadily until time runs out',
      ],
      musclesWorked: ['Shoulders', 'Core'],
      commonMistake: 'Letting the arms drift down — reset to shoulder height if they drop.',
    },
  },
  'Renegade Row': {
    glyph: 'row',
    form: {
      cues: [
        'Start in a plank with a dumbbell in each hand',
        'Row one dumbbell up toward your hip, keeping hips square',
        'Lower with control and switch sides',
      ],
      musclesWorked: ['Back', 'Core', 'Shoulders'],
      commonMistake: 'Letting the hips rotate — brace your core to keep them facing the floor.',
    },
  },
  'Dumbbell Upright Row': {
    glyph: 'uprightRow',
    form: {
      cues: [
        'Hold dumbbells in front of your thighs, palms facing you',
        'Pull the weights straight up toward your chin, elbows leading',
        'Lower with control',
      ],
      musclesWorked: ['Shoulders', 'Upper back'],
      commonMistake: 'Raising the elbows too high — stop around shoulder height to protect the joint.',
    },
  },
  'Kettlebell Goblet Squat': {
    glyph: 'gobletSquat',
    form: {
      cues: [
        'Hold the kettlebell close to your chest with both hands',
        'Sit your hips back and down, chest tall',
        'Push through your heels to stand back up',
      ],
      musclesWorked: ['Legs', 'Glutes', 'Core'],
      commonMistake: 'Rounding the upper back — keep your chest lifted throughout.',
    },
  },
  'Walking Lunge': {
    glyph: 'lunge',
    form: {
      cues: [
        'Step forward, lowering your back knee toward the floor',
        'Both knees bend to about 90°',
        'Push through your front heel to step into the next lunge',
      ],
      musclesWorked: ['Legs', 'Glutes'],
      commonMistake: 'Letting the front knee drift past the toes — take a slightly longer step.',
    },
  },
  'Standing Vertical Crunch': {
    glyph: 'verticalCrunch',
    form: {
      cues: [
        'Stand tall, hands lightly behind your head',
        'Crunch your torso down as you drive one knee up to meet it',
        'Return to standing and alternate sides',
      ],
      musclesWorked: ['Core'],
      commonMistake: 'Pulling on the neck — let your abs do the work, hands just support your head.',
    },
  },
  'Romanian Deadlift': {
    glyph: 'deadlift',
    form: {
      cues: [
        'Hold dumbbells in front of your thighs, knees slightly bent',
        'Hinge at your hips, pushing them back as the weights slide down your legs',
        'Feel a stretch in your hamstrings, then drive hips forward to stand',
      ],
      musclesWorked: ['Hamstrings', 'Glutes', 'Lower back'],
      commonMistake: 'Rounding the lower back — keep it flat by hinging at the hips, not the waist.',
    },
  },
  'Dumbbell Hip Thrust': {
    glyph: 'hipThrust',
    form: {
      cues: [
        'Upper back supported on a bench or sofa edge, dumbbell on your hips',
        'Feet flat, knees bent — drive your hips up until your body is flat',
        'Squeeze your glutes at the top, then lower with control',
      ],
      musclesWorked: ['Glutes', 'Hamstrings'],
      commonMistake: 'Pushing through the toes — keep weight in your heels for better glute activation.',
    },
  },
  'Elevated Reverse Lunge': {
    glyph: 'reverseLunge',
    form: {
      cues: [
        'Stand on a low step or platform, dumbbells at your sides',
        'Step one leg back and down, lowering the back knee toward the floor',
        'Push through your front heel to return to standing',
      ],
      musclesWorked: ['Legs', 'Glutes'],
      commonMistake: 'Losing balance on the step — move slowly and keep your weight centered.',
    },
  },
  'Weighted Overhead Sit Up': {
    glyph: 'sitUp',
    form: {
      cues: [
        'Lie on your back, knees bent, weight held straight overhead',
        'Sit all the way up, keeping the weight extended above your head',
        'Lower back down with control',
      ],
      musclesWorked: ['Core', 'Shoulders'],
      commonMistake: 'Letting the arms bend and the weight drift forward — keep it stacked over your shoulders.',
    },
  },
}

export function getExerciseContent(name: string): ExerciseContent {
  return (
    EXERCISE_CONTENT[name] ?? {
      glyph: 'squat',
      form: {
        cues: ['Move with control and stop if anything feels sharp or painful.'],
        musclesWorked: ['Full body'],
        commonMistake: 'Rushing the movement — slow down and focus on form over speed.',
      },
    }
  )
}
