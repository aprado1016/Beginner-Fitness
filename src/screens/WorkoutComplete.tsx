import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '@/state/AppStateContext'
import { getWorkoutById } from '@/data/workouts'
import { getCompletedSessions, countSetsCompleted } from '@/lib/workoutStats'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { TrophyIcon } from '@/components/icons'
import { playChime, vibrate } from '@/lib/feedback'

const CONFETTI_COLORS = ['bg-brand', 'bg-sky-400', 'bg-pink-400', 'bg-amber-400', 'bg-emerald-400']

export function WorkoutComplete() {
  const navigate = useNavigate()
  const { sessions, preferences } = useAppState()

  const session = useMemo(() => getCompletedSessions(sessions)[0], [sessions])
  const workout = session ? getWorkoutById(session.workoutId) : undefined

  useEffect(() => {
    if (!session) {
      navigate('/', { replace: true })
      return
    }
    playChime('workoutComplete', preferences.soundEnabled)
    vibrate([50, 40, 50, 40, 120], preferences.hapticsEnabled)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!session || !workout) return null

  const setsCompleted = countSetsCompleted(session)
  const minutes = session.durationSeconds ? Math.max(1, Math.round(session.durationSeconds / 60)) : workout.estimatedMinutes

  return (
    <div className="flex min-h-[var(--vh,100dvh)] flex-col items-center justify-center px-6 pb-[max(env(safe-area-inset-bottom,0px),1rem)] pt-[max(env(safe-area-inset-top,0px),1rem)]">
      <div className="relative mb-2 flex h-24 w-24 items-center justify-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-visible">
          {CONFETTI_COLORS.map((color, i) => (
            <span
              key={i}
              className={`absolute top-0 h-2 w-2 rounded-sm ${color} animate-confetti-fall`}
              style={{
                left: `${10 + i * 18}%`,
                animationDelay: `${i * 90}ms`,
              }}
            />
          ))}
        </div>
        <div className="animate-pop flex h-24 w-24 items-center justify-center rounded-full bg-brand-softer">
          <TrophyIcon className="h-11 w-11 text-fg-brand-strong" />
        </div>
      </div>

      <h1 className="animate-rise-in text-center text-2xl font-semibold text-heading">Workout Complete 🎉</h1>
      <p className="animate-rise-in mt-1 text-center text-sm font-medium text-body-subtle">
        {workout.name} — {workout.focus}
      </p>

      <GlassCard padding="lg" className="animate-rise-in mt-6 w-full max-w-xs">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat value={workout.exercises.length} label="Exercises" />
          <Stat value={setsCompleted} label="Sets" />
          <Stat value={minutes} label="Minutes" />
        </div>
      </GlassCard>

      <p className="animate-rise-in mt-6 text-center text-base font-medium text-heading">Nice work, {preferences.name}!</p>

      <Button size="xl" fullWidth className="mt-8 max-w-xs" onClick={() => navigate('/')}>
        Done
      </Button>
    </div>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-xl font-semibold text-heading">{value}</p>
      <p className="text-[11px] uppercase tracking-wide text-body-subtle">{label}</p>
    </div>
  )
}
