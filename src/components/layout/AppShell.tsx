import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useTheme } from '@/hooks/useTheme'
import { clsx } from '@/lib/clsx'

const IMMERSIVE_PREFIXES = ['/workout/active', '/workout/complete']

export function AppShell() {
  useTheme()
  const location = useLocation()
  const isImmersive = IMMERSIVE_PREFIXES.some((p) => location.pathname.startsWith(p))

  return (
    <div className="mx-auto flex min-h-[var(--vh,100dvh)] w-full max-w-md flex-1 flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-[max(env(safe-area-inset-top,0px),0.75rem)] focus:z-50 focus:rounded-control focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        className={clsx(
          'flex-1',
          // Immersive screens (active workout) manage their own fixed top/bottom chrome and
          // safe-area padding internally, so this wrapper adds none — doing so twice just
          // pushes content down for no reason.
          !isImmersive && 'pt-[max(env(safe-area-inset-top,0px),0px)]',
          // The pill nav is fixed (not in document flow), so reserve room for it here instead.
          !isImmersive && 'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]',
        )}
      >
        <Outlet />
      </main>
      {!isImmersive && <BottomNav />}
    </div>
  )
}
