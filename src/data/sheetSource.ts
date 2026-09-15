// -----------------------------------------------------------------------------
// This module simulates the raw export of the "Beginner Friendly 3 Day Split"
// Google Sheet, in the same shape a Sheets API `values.get` call would return:
// an array of rows, each a flat array of cell strings.
//
// Keeping the raw shape isolated here (rather than hand-authoring clean
// Workout objects) means a future Google Sheets sync only has to replace
// `getRawRows()` with a real API call — everything downstream (parseSheet in
// workouts.ts) already expects loosely-typed, occasionally-messy cell values.
//
// A couple of cells below intentionally reproduce a real formatting glitch:
// Sheets/Excel will silently reinterpret a bare number typed into a
// weight column as a date (e.g. typing "10" next to other date-like cells
// can produce "1/10" or "10-Jan"). parseWeightCell() in workouts.ts detects
// and recovers from this instead of showing "Jan 10" as a workout weight.
// -----------------------------------------------------------------------------

export interface RawSheetRow {
  day: string
  exercise: string
  sets: string
  reps: string
  weight: string
  notes: string
}

const HEADER = ['Day', 'Exercise', 'Sets', 'Reps', 'Weight (lb)', 'Notes'] as const

// prettier-ignore
const ROWS: string[][] = [
  HEADER as unknown as string[],

  // ---- Day 1: Full Body ----
  ['Day 1 - Full Body', 'Dumbbell Squat Press', '3', '10', '10-Jan', ''],
  ['Day 1 - Full Body', 'Push Up', '3', '8', '', 'Superset A w/ Plank'],
  ['Day 1 - Full Body', 'Plank', '3', '30 sec', '', 'Superset A w/ Push Up'],
  ['Day 1 - Full Body', 'Glute Bridge', '3', '10', '20', ''],
  ['Day 1 - Full Body', 'Suitcase Crunch', '3', '12', '', 'Hands to ankles'],
  ['Day 1 - Full Body', 'Leg Switches', '3', '12', '', '3x back and forth'],

  // ---- Day 2: Upper Body ----
  ['Day 2 - Upper Body', 'Push Up', '3', '8', '', ''],
  ['Day 2 - Upper Body', 'Dumbbell Lateral Raise', '3', '10', '5', 'Superset B'],
  ['Day 2 - Upper Body', 'Dumbbell Front Raise', '3', '10', '5', 'Superset B'],
  ['Day 2 - Upper Body', 'DB Front Hold', '3', '30 sec', '5-Jan', 'Superset B'],
  ['Day 2 - Upper Body', 'Renegade Row', '3', '10', '5', ''],
  ['Day 2 - Upper Body', 'Dumbbell Upright Row', '3', '10', '5', ''],

  // ---- Day 3: Lower Body ----
  ['Day 3 - Lower Body', 'Kettlebell Goblet Squat', '3', '10', '20', ''],
  ['Day 3 - Lower Body', 'Walking Lunge', '3', '10', '10', ''],
  ['Day 3 - Lower Body', 'Standing Vertical Crunch', '3', '10', '10', ''],
  ['Day 3 - Lower Body', 'Romanian Deadlift (RDL)', '3', '8', '10', ''],
  ['Day 3 - Lower Body', 'Dumbbell Hip Thrust', '3', '8', '20', ''],
  ['Day 3 - Lower Body', 'Elevated Reverse Lunge', '3', '8', '10', 'Each leg'],
  ['Day 3 - Lower Body', 'Weighted Overhead Sit Up', '3', '10', '', ''],
]

/** Stand-in for a `spreadsheets.values.get` response — swap for a real fetch later. */
export function getRawRows(): string[][] {
  return ROWS
}

export function rowsToObjects(rows: string[][]): RawSheetRow[] {
  const [, ...body] = rows
  return body.map(([day, exercise, sets, reps, weight, notes]) => ({
    day,
    exercise,
    sets,
    reps,
    weight,
    notes,
  }))
}
