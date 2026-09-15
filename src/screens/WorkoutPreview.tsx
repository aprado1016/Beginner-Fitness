import { useNavigate, useParams } from 'react-router-dom'
import { WORKOUTS } from '@/data/workouts'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ExerciseMedia } from '@/components/workout/ExerciseMedia'
import { ChevronLeftIcon, ClockIcon, DumbbellIcon } from '@/components/icons'
import { formatMinutes } from '@/lib/format'
import { formatSetTarget } from '@/components/workout/SetRow'
import { useAppState } from '@/state/AppStateContext'
import { clsx } from '@/lib/clsx'

export function WorkoutPreview() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { resumeOrStartSession } = useAppState()

  const workout = WORKOUTS.find((w) => w.slug === slug)

  if (!workout) {
    return (
      <div className="px-4 pt-5">
        <p className="text-body">We couldn't find that workout.</p>
        <Button className="mt-4" onClick={() => navigate('/workouts')}>
          Back to Workouts
        </Button>
      </div>
    )
  }

  const handleStart = () => {
    resumeOrStartSession(workout)
    navigate('/workout/active')
  }

  return (
    <div className="animate-fade-in px-4 pt-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 -ml-2 flex min-h-11 items-center gap-1 rounded-control px-2 text-sm font-medium text-body-subtle hover:text-heading"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Back
      </button>

      <p className="text-xs font-semibold uppercase tracking-wide text-fg-brand-strong">{workout.name}</p>
      <h1 className="text-2xl font-semibold text-heading">{workout.focus}</h1>
      <div className="mt-2 flex flex-wrap gap-2">
        <Badge icon={<ClockIcon className="h-3 w-3" />}>Approx. {formatMinutes(workout.estimatedMinutes)}</Badge>
        <Badge icon={<DumbbellIcon className="h-3 w-3" />}>{workout.exercises.length} exercises</Badge>
      </div>

      <GlassCard padding="none" className="mt-5 divide-y divide-glass-subtle overflow-hidden">
        {workout.exercises.map((exercise, index) => {
          const isSuperset = Boolean(exercise.supersetGroup)
          const prevSameGroup = index > 0 && workout.exercises[index - 1].supersetGroup === exercise.supersetGroup
          return (
            <div
              key={exercise.id}
              className={clsx('flex items-center gap-3 px-4 py-3.5', isSuperset && 'bg-brand-softer/30')}
            >
              <span className="w-5 flex-shrink-0 text-center text-sm font-semibold text-body-subtle">
                {index + 1}
              </span>
              <div className="h-12 w-12 flex-shrink-0">
                <ExerciseMedia media={exercise.media} exerciseName={exercise.name} size="md" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-semibold text-heading">{exercise.name}</p>
                  {isSuperset && (
                    <span className="flex-shrink-0 rounded-full bg-brand-softer px-1.5 py-0.5 text-[10px] font-semibold text-fg-brand-strong">
                      {prevSameGroup ? '+ superset' : 'superset'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-body-subtle">
                  {exercise.sets} × {formatSetTarget(exercise.prescription, exercise.prescribedWeight)}
                </p>
              </div>
            </div>
          )
        })}
      </GlassCard>

      <div className="sticky bottom-3 mt-6 pb-2">
        <Button size="xl" fullWidth onClick={handleStart}>
          Start Workout
        </Button>
      </div>
    </div>
  )
}
