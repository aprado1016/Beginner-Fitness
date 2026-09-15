import { HashRouter, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Home } from '@/screens/Home'
import { WorkoutLibrary } from '@/screens/WorkoutLibrary'
import { WorkoutPreview } from '@/screens/WorkoutPreview'
import { ActiveWorkout } from '@/screens/ActiveWorkout'
import { WorkoutComplete } from '@/screens/WorkoutComplete'
import { ProgressScreen } from '@/screens/Progress'
import { Settings } from '@/screens/Settings'
import { AppStateProvider } from '@/state/AppStateContext'

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
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
      </HashRouter>
    </AppStateProvider>
  )
}
