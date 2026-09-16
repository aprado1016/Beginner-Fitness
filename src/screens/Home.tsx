import { Link, useNavigate } from 'react-router-dom'
import { useAppState } from '@/state/AppStateContext'
import { WORKOUTS } from '@/data/workouts'
import { getNextWorkout, wasCompletedToday } from '@/lib/workoutStats'
import { formatMinutes, greetingForNow } from '@/lib/format'
import { GlassCard, InteractiveGlassCard } from '@/components/ui/GlassCard'
import { AddToHomeScreenBanner } from '@/components/ui/AddToHomeScreenBanner'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChevronRightIcon, ClockIcon, DumbbellIcon, GearIcon, TrophyIcon } from '@/components/icons'

export function Home() {
  const navigate = useNavigate()
  const { preferences, sessions, activeSession, activeWorkout, resumeOrStartSession } = useAppState()

  const todaysWorkout = getNextWorkout(sessions)
  const completedToday = wasCompletedToday(sessions, todaysWorkout.id)
  const isResuming = Boolean(activeSession && activeWorkout)
  const otherWorkouts = WORKOUTS.filter((w) => w.id !== todaysWorkout.id)

  const handleStart = () => {
    const target = isResuming && activeWorkout ? activeWorkout : todaysWorkout
    resumeOrStartSession(target)
    navigate('/workout/active')
  }

  return (
    <div className="animate-fade-in space-y-6 px-4 pt-5">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-body-subtle">{greetingForNow()},</p>
          <h1 className="text-2xl font-semibold text-heading">{preferences.name}</h1>
        </div>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          aria-label="Settings"
          className="flex h-11 w-11 items-center justify-center rounded-full text-body-subtle transition-colors hover:bg-neutral-secondary-medium hover:text-heading"
        >
          <GearIcon className="h-5 w-5" />
        </button>
      </header>

      <AddToHomeScreenBanner />

      <section aria-labelledby="todays-workout-heading">
        <h2 id="todays-workout-heading" className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-body-subtle">
          {isResuming ? "Continue where you left off" : "Today's Workout"}
        </h2>

        <GlassCard padding="lg" className="relative">
          {completedToday && !isResuming ? (
            <CompletedTodayState
              workoutFocus={todaysWorkout.focus}
              dayLabel={todaysWorkout.name}
              onDoAgain={handleStart}
            />
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-fg-brand-strong">
                    {(isResuming && activeWorkout ? activeWorkout.name : todaysWorkout.name)} —{' '}
                    {isResuming && activeWorkout ? activeWorkout.focus : todaysWorkout.focus}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-heading">
                    {isResuming && activeWorkout ? activeWorkout.focus : todaysWorkout.focus}
                  </h3>
                </div>
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-softer">
                  <DumbbellIcon className="h-5 w-5 text-fg-brand-strong" />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge icon={<ClockIcon className="h-3 w-3" />}>
                  {formatMinutes((isResuming && activeWorkout ? activeWorkout : todaysWorkout).estimatedMinutes)}
                </Badge>
                <Badge icon={<DumbbellIcon className="h-3 w-3" />}>
                  {(isResuming && activeWorkout ? activeWorkout : todaysWorkout).exercises.length} exercises
                </Badge>
              </div>

              <Button size="xl" fullWidth className="mt-5" onClick={handleStart}>
                {isResuming ? 'Resume Workout' : 'Start Workout'}
              </Button>
            </>
          )}
        </GlassCard>
      </section>

      <section aria-labelledby="other-days-heading">
        <h2 id="other-days-heading" className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-body-subtle">
          Your split
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {otherWorkouts.map((workout) => (
            <InteractiveGlassCard
              key={workout.id}
              padding="md"
              onClick={() => navigate(`/workouts/${workout.slug}`)}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-body-subtle">{workout.name}</p>
              <p className="mt-0.5 text-base font-semibold text-heading">{workout.focus}</p>
              <p className="mt-2 text-xs text-body-subtle">{workout.exercises.length} exercises</p>
            </InteractiveGlassCard>
          ))}
        </div>
      </section>
    </div>
  )
}

function CompletedTodayState({
  workoutFocus,
  dayLabel,
  onDoAgain,
}: {
  workoutFocus: string
  dayLabel: string
  onDoAgain: () => void
}) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft">
        <TrophyIcon className="h-7 w-7 text-success-strong" />
      </div>
      <h3 className="mt-3 text-lg font-semibold text-heading">Nice work — you're done for today</h3>
      <p className="mt-1 text-sm text-body-subtle">
        You completed {dayLabel} — {workoutFocus}. Rest up, your next workout will be ready tomorrow.
      </p>
      <Button size="base" variant="secondary" className="mt-4" onClick={onDoAgain}>
        Do it again
      </Button>
      <Link to="/progress" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-fg-brand">
        View it in Progress <ChevronRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}
