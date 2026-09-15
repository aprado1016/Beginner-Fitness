import { NavLink } from 'react-router-dom'
import { ChartFilledIcon, ChartIcon, DumbbellFilledIcon, DumbbellIcon, HomeFilledIcon, HomeIcon } from '@/components/icons'
import { clsx } from '@/lib/clsx'

const ITEMS = [
  { to: '/', label: 'Home', Icon: HomeIcon, FilledIcon: HomeFilledIcon, end: true },
  { to: '/workouts', label: 'Workouts', Icon: DumbbellIcon, FilledIcon: DumbbellFilledIcon, end: false },
  { to: '/progress', label: 'Progress', Icon: ChartIcon, FilledIcon: ChartFilledIcon, end: false },
]

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="glass-edges sticky bottom-0 z-30 border-t border-glass bg-glass pb-[max(env(safe-area-inset-bottom,0px),10px)] pt-2 backdrop-blur-glass"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {ITEMS.map(({ to, label, Icon, FilledIcon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-11 flex-col items-center justify-center gap-1 rounded-control px-3 py-1.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-fg-brand' : 'text-body-subtle hover:text-heading',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <FilledIcon className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  <span className={isActive ? 'font-semibold' : ''}>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
