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
      className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom,0px),1rem)]"
    >
      <ul className="glass-edges flex items-stretch gap-1 rounded-full border border-glass bg-glass p-1.5 shadow-glass backdrop-blur-glass">
        {ITEMS.map(({ to, label, Icon, FilledIcon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                clsx(
                  'flex min-h-11 items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium transition-colors',
                  isActive ? 'bg-brand text-white shadow-xs' : 'text-body-subtle hover:text-heading',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive ? <FilledIcon className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
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
