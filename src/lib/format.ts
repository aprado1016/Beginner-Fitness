export function formatWeight(weight: number | null | undefined): string {
  if (weight === null || weight === undefined) return 'Bodyweight'
  return `${weight} lb`
}

export function formatReps(reps: number | undefined, eachSide?: boolean): string {
  if (reps === undefined) return ''
  return eachSide ? `${reps} reps each side` : `${reps} reps`
}

export function formatDuration(seconds: number | undefined): string {
  if (seconds === undefined) return ''
  if (seconds < 60) return `${seconds} sec`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `${minutes}m ${rest}s` : `${minutes} min`
}

export function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

const DAY_MS = 24 * 60 * 60 * 1000

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function isSameDay(dateISO: string, other: string): boolean {
  return dateISO === other
}

export function formatRelativeDate(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00`)
  const today = new Date(`${todayISO()}T00:00:00`)
  const diffDays = Math.round((today.getTime() - date.getTime()) / DAY_MS)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatShortDate(dateISO: string): string {
  const date = new Date(`${dateISO}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function greetingForNow(): string {
  const hour = new Date().getHours()
  if (hour < 5) return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
