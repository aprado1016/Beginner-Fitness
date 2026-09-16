import { useEffect, useState } from 'react'
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppShell } from '@/components/layout/AppShell'
import { SplashScreen } from '@/components/SplashScreen'
import { Home } from '@/screens/Home'
import { Welcome } from '@/screens/Welcome'
import { WorkoutLibrary } from '@/screens/WorkoutLibrary'
import { WorkoutPreview } from '@/screens/WorkoutPreview'
import { ActiveWorkout } from '@/screens/ActiveWorkout'
import { WorkoutComplete } from '@/screens/WorkoutComplete'
import { ProgressScreen } from '@/screens/Progress'
import { Settings } from '@/screens/Settings'
import { AppStateProvider, useAppState } from '@/state/AppStateContext'

const SPLASH_DURATION_MS = 1100

// Redirects to /welcome until a name is set, and away from it once one is — runs alongside the
// splash so routing has already settled on the right screen by the time the splash fades out.
function OnboardingGate() {
  const { preferences } = useAppState()
  const navigate = useNavigate()
  const location = useLocation()
  const needsOnboarding = !preferences.name.trim()

  useEffect(() => {
    if (needsOnboarding && location.pathname !== '/welcome') {
      navigate('/welcome', { replace: true })
    } else if (!needsOnboarding && location.pathname === '/welcome') {
      navigate('/', { replace: true })
    }
  }, [needsOnboarding, location.pathname, navigate])

  return null
}

function AppRoutes() {
  return (
    <>
      <OnboardingGate />
      <Routes>
        <Route path="welcome" element={<Welcome />} />
        <Route element={<AppShell />}>
          <Route index element={<Home />} />
          <Route path="workouts" element={<WorkoutLibrary />} />
          <Route path="workouts/:slug" element={<WorkoutPreview />} />
          <Route path="workout/active" element={<ActiveWorkout />} />
          <Route path="workout/complete" element={<WorkoutComplete />} />
          <Route path="progress" element={<ProgressScreen />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </>
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = window.setTimeout(() => setShowSplash(false), reduceMotion ? 0 : SPLASH_DURATION_MS)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <AppStateProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
      <AnimatePresence>{showSplash && <SplashScreen key="splash" />}</AnimatePresence>
    </AppStateProvider>
  )
}
