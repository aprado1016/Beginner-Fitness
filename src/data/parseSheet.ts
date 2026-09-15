// Defensive parsing for values coming out of a spreadsheet cell. Spreadsheets
// are user-edited free text, so every cell is treated as untrusted input and
// normalized rather than trusted at face value (Postel's Law: be liberal in
// what you accept).

export interface ParseWarning {
  exercise: string
  field: string
  raw: string
  message: string
}

export const parseWarnings: ParseWarning[] = []

function warn(exercise: string, field: string, raw: string, message: string) {
  parseWarnings.push({ exercise, field, raw, message })
  if (typeof console !== 'undefined') {
    console.warn(`[sheet] ${exercise} — ${field}: "${raw}" — ${message}`)
  }
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
}

/**
 * Weight cells are the most common casualty of spreadsheet auto-formatting:
 * typing a bare number like "10" into a column Sheets has guessed is a date
 * silently becomes "10-Jan" (or a date serial number). This recovers the
 * number a human actually meant instead of ever showing a date as a weight.
 */
export function parseWeightCell(raw: string, exerciseName: string): number | null {
  const value = (raw ?? '').trim()
  if (!value) return null

  // Plain number, optionally with "lb"/"lbs" suffix.
  const plain = value.match(/^(\d+(?:\.\d+)?)\s*(lb|lbs)?$/i)
  if (plain) return parseFloat(plain[1])

  // "10-Jan" / "Jan-10" style — Sheets reinterpreted a bare number as a date.
  const dashDate = value.match(/^(\d{1,2})-([A-Za-z]{3,})$/) ?? value.match(/^([A-Za-z]{3,})-(\d{1,2})$/)
  if (dashDate) {
    const [, a, b] = dashDate
    const dayCandidate = MONTHS[a.toLowerCase()] ? b : a
    const day = parseInt(dayCandidate, 10)
    if (!Number.isNaN(day)) {
      warn(exerciseName, 'weight', raw, `looked like a misformatted date, recovered ${day} lb`)
      return day
    }
  }

  // Excel date serial number (days since 1899-12-30) — another common glitch.
  const serial = value.match(/^\d{4,5}$/)
  if (serial) {
    const asNumber = parseInt(serial[0], 10)
    // Serial numbers land in the tens-of-thousands; not a plausible dumbbell weight.
    warn(exerciseName, 'weight', raw, `looked like an Excel date serial (${asNumber}), treating as bodyweight`)
    return null
  }

  const trailingNumber = value.match(/(\d+(?:\.\d+)?)/)
  if (trailingNumber) {
    warn(exerciseName, 'weight', raw, 'unexpected format, extracted the first number found')
    return parseFloat(trailingNumber[1])
  }

  warn(exerciseName, 'weight', raw, 'unparseable, treating as bodyweight')
  return null
}

export function parseSetsCell(raw: string): number {
  const n = parseInt(raw, 10)
  return Number.isFinite(n) && n > 0 ? n : 3
}

export interface ParsedReps {
  type: 'reps' | 'duration'
  reps?: number
  durationSeconds?: number
}

export function parseRepsCell(raw: string, exerciseName: string): ParsedReps {
  const value = (raw ?? '').trim()

  const seconds = value.match(/(\d+(?:\.\d+)?)\s*sec/i)
  if (seconds) return { type: 'duration', durationSeconds: parseFloat(seconds[1]) }

  const minutes = value.match(/(\d+(?:\.\d+)?)\s*min/i)
  if (minutes) return { type: 'duration', durationSeconds: parseFloat(minutes[1]) * 60 }

  const reps = value.match(/(\d+)/)
  if (reps) return { type: 'reps', reps: parseInt(reps[1], 10) }

  warn(exerciseName, 'reps', raw, 'unparseable, defaulting to 10 reps')
  return { type: 'reps', reps: 10 }
}

export interface ParsedNotes {
  supersetLabel: string | null
  eachSide: boolean
  freeNote: string | null
}

export function parseNotesCell(raw: string): ParsedNotes {
  const value = (raw ?? '').trim()
  const supersetMatch = value.match(/superset\s*([a-z0-9]*)/i)
  const eachSide = /each\s*(leg|side|arm)/i.test(value)

  let freeNote = value
  if (supersetMatch) freeNote = freeNote.replace(supersetMatch[0], '').trim()
  freeNote = freeNote.replace(/,\s*$/, '').replace(/^,\s*/, '').trim()

  return {
    supersetLabel: supersetMatch ? `superset-${(supersetMatch[1] || 'x').toLowerCase()}` : null,
    eachSide,
    freeNote: freeNote || null,
  }
}

/** Strips gym shorthand into a beginner-friendly display name, keeping the abbreviation as secondary text. */
export function splitDisplayName(rawName: string): { name: string; shortName?: string } {
  const paren = rawName.match(/^(.*?)\s*\(([^)]+)\)\s*$/)
  if (paren) return { name: paren[1].trim(), shortName: paren[2].trim() }
  return { name: rawName.trim() }
}
