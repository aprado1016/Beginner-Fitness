import type { AppState } from '@/types'

// -----------------------------------------------------------------------------
// Local-only persistence for the first version of the app — no account needed.
// Everything funnels through this module so a future cloud sync only has to
// change load()/save() (e.g. debounce + POST to a backend) without touching
// any screen or the AppStateContext reducer logic.
// -----------------------------------------------------------------------------

const STORAGE_KEY = 'maggie-fitness:v1'
const CURRENT_VERSION = 1

export function defaultState(): AppState {
  return {
    version: CURRENT_VERSION,
    preferences: {
      name: 'Maggie',
      theme: 'system',
      soundEnabled: true,
      hapticsEnabled: true,
    },
    sessions: [],
    activeSessionId: null,
  }
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return defaultState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      ...defaultState(),
      ...parsed,
      preferences: { ...defaultState().preferences, ...parsed.preferences },
    }
  } catch (err) {
    console.warn('Failed to load saved workout data, starting fresh.', err)
    return defaultState()
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Failed to save workout data.', err)
  }
}
