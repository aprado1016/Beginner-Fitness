import { useNavigate } from 'react-router-dom'
import { WORKOUTS } from '@/data/workouts'
import { InteractiveGlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { ChevronRightIcon, ClockIcon, DumbbellIcon } from '@/components/icons'
import { formatMinutes } from '@/lib/format'

export function WorkoutLibrary() {
  const navigate = useNavigate()

  return (
    <div className="animate-fade-in space-y-5 px-4 pt-5">
      <header>
        <h1 className="text-2xl font-semibold text-heading">Workouts</h1>
        <p className="mt-1 text-sm text-body-subtle">Your 3-day beginner split. Tap a day to preview it.</p>
      </header>

      <div className="space-y-3">
        {WORKOUTS.map((workout) => (
          <InteractiveGlassCard key={workout.id} padding="lg" onClick={() => navigate(`/workouts/${workout.slug}`)}>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-brand-softer">
                <DumbbellIcon className="h-6 w-6 text-fg-brand-strong" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-fg-brand-strong">{workout.name}</p>
                <h2 className="text-lg font-semibold text-heading">{workout.focus}</h2>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  <Badge icon={<DumbbellIcon className="h-3 w-3" />}>{workout.exercises.length} exercises</Badge>
                  <Badge icon={<ClockIcon className="h-3 w-3" />}>{formatMinutes(workout.estimatedMinutes)}</Badge>
                </div>
              </div>
              <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-body-subtle" />
            </div>
          </InteractiveGlassCard>
        ))}
      </div>
    </div>
  )
}
