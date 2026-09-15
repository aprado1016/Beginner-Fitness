import { useEffect } from 'react'
import { useAppState } from '@/state/AppStateContext'

/** Applies preferences.theme to the document root so the CSS custom-property overrides in index.css engage. */
export function useTheme() {
  const { preferences } = useAppState()

  useEffect(() => {
    const root = document.documentElement
    if (preferences.theme === 'system') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', preferences.theme)
    }
  }, [preferences.theme])
}
