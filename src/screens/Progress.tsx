import { useMemo, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '@/state/AppStateContext'
import { WORKOUTS, getWorkoutById } from '@/data/workouts'
import { getCompletedSessions, getCurrentWeek, getWeightHistory, countSetsCompleted } from '@/lib/workoutStats'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { formatRelativeDate, formatShortDate, formatMinutes } from '@/lib/format'
import { ChartIcon, ClockIcon, DumbbellIcon, TrophyIcon } from '@/components/icons'

export function ProgressScreen() {
  const navigate = useNavigate()
  const { sessions } = useAppState()

  const completed = useMemo(() => getCompletedSessions(sessions), [sessions])
  const currentWeek = getCurrentWeek(sessions)

  const exerciseHistories = useMemo(() => {
    const entries: { name: string; shortName?: string; points: ReturnType<typeof getWeightHistory> }[] = []
    for (const workout of WORKOUTS) {
      for (const exercise of workout.exercises) {
        if (exercise.prescribedWeight === null) continue
        if (entries.some((e) => e.name === exercise.name)) continue
        const points = getWeightHistory(sessions, exercise.id)
        if (points.length > 0) entries.push({ name: exercise.name, shortName: exercise.shortName, points })
      }
    }
    return entries.slice(0, 6)
  }, [sessions])

  if (completed.length === 0) {
    return (
      <div className="animate-fade-in flex min-h-[70dvh] flex-col items-center justify-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-softer">
          <ChartIcon className="h-7 w-7 text-fg-brand-strong" />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-heading">No workouts yet</h1>
        <p className="mt-1.5 max-w-[26ch] text-sm text-body-subtle">
          Finish your first workout and your progress will start showing up here.
        </p>
        <Button size="lg" className="mt-6" onClick={() => navigate('/')}>
          Go to today's workout
        </Button>
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-semibold text-heading">Progress</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        <StatCard value={completed.length} label="Workouts" icon={<TrophyIcon className="h-4 w-4" />} />
        <StatCard value={currentWeek} label="Current week" icon={<ClockIcon className="h-4 w-4" />} />
        <StatCard
          value={completed.reduce((sum, s) => sum + countSetsCompleted(s), 0)}
          label="Total sets"
          icon={<DumbbellIcon className="h-4 w-4" />}
        />
      </div>

      <section aria-labelledby="recent-heading">
        <h2 id="recent-heading" className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-body-subtle">
          Recent workouts
        </h2>
        <GlassCard padding="none" className="divide-y divide-glass-subtle overflow-hidden">
          {completed.slice(0, 5).map((session) => {
            const workout = getWorkoutById(session.workoutId)
            if (!workout) return null
            return (
              <div key={session.id} className="flex items-center justify-between gap-3 px-4 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-heading">
                    {workout.name} — {workout.focus}
                  </p>
                  <p className="text-xs text-body-subtle">
                    {formatRelativeDate(session.dateISO)} · {countSetsCompleted(session)} sets
                  </p>
                </div>
                <p className="text-xs font-medium text-body-subtle">
                  {formatMinutes(session.durationSeconds ? Math.round(session.durationSeconds / 60) : workout.estimatedMinutes)}
                </p>
              </div>
            )
          })}
        </GlassCard>
      </section>

      {exerciseHistories.length > 0 && (
        <section aria-labelledby="weights-heading">
          <h2 id="weights-heading" className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-body-subtle">
            Weight progress
          </h2>
          <div className="space-y-3">
            {exerciseHistories.map((entry) => (
              <GlassCard key={entry.name} padding="md">
                <p className="text-sm font-semibold text-heading">{entry.name}</p>
                <ul className="mt-2 space-y-1">
                  {entry.points.slice(-4).map((point, i, arr) => {
                    const prev = arr[i - 1]
                    const increased = prev && point.weight > prev.weight
                    return (
                      <li key={point.dateISO} className="flex items-center justify-between text-sm">
                        <span className="text-body-subtle">{formatShortDate(point.dateISO)}</span>
                        <span
                          className={
                            point.isPersonalBest ? 'font-semibold text-fg-brand-strong' : 'font-medium text-body'
                          }
                        >
                          {point.weight} lb {increased && '↑'} {point.isPersonalBest && '★'}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </GlassCard>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ value, label, icon }: { value: number; label: string; icon: ReactNode }) {
  return (
    <GlassCard padding="sm" className="flex flex-col items-center py-3.5 text-center">
      <span className="text-fg-brand">{icon}</span>
      <span className="mt-1.5 text-xl font-semibold text-heading">{value}</span>
      <span className="text-[10px] uppercase tracking-wide text-body-subtle">{label}</span>
    </GlassCard>
  )
}
