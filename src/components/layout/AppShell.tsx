import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useTheme } from '@/hooks/useTheme'

const IMMERSIVE_PREFIXES = ['/workout/active', '/workout/complete']

export function AppShell() {
  useTheme()
  const location = useLocation()
  const isImmersive = IMMERSIVE_PREFIXES.some((p) => location.pathname.startsWith(p))

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-1 flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-[max(env(safe-area-inset-top,0px),0.75rem)] focus:z-50 focus:rounded-control focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <main id="main-content" className="flex-1 pb-4 pt-[max(env(safe-area-inset-top,0px),0px)]">
        <Outlet />
      </main>
      {!isImmersive && <BottomNav />}
    </div>
  )
}
