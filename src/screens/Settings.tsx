import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '@/state/AppStateContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { ChevronLeftIcon, VibrateIcon, VolumeIcon } from '@/components/icons'
import { clsx } from '@/lib/clsx'
import type { Preferences } from '@/types'

const THEME_OPTIONS: { value: Preferences['theme']; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

export function Settings() {
  const navigate = useNavigate()
  const { preferences, updatePreferences } = useAppState()

  return (
    <div className="animate-fade-in px-4 pt-5">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-3 -ml-2 flex min-h-11 items-center gap-1 rounded-control px-2 text-sm font-medium text-body-subtle hover:text-heading"
      >
        <ChevronLeftIcon className="h-4 w-4" /> Back
      </button>

      <h1 className="mb-5 text-2xl font-semibold text-heading">Settings</h1>

      <div className="space-y-4">
        <GlassCard padding="lg">
          <label htmlFor="display-name" className="text-sm font-semibold text-heading">
            Your name
          </label>
          <p className="mb-2.5 mt-0.5 text-xs text-body-subtle">Shown on your home screen greeting.</p>
          <input
            id="display-name"
            type="text"
            value={preferences.name}
            onChange={(e) => updatePreferences({ name: e.target.value })}
            maxLength={30}
            className="min-h-11 w-full rounded-control border border-border-default-medium bg-neutral-primary-soft px-3.5 text-base text-heading outline-none focus-visible:border-brand"
          />
        </GlassCard>

        <GlassCard padding="lg">
          <p className="text-sm font-semibold text-heading">Appearance</p>
          <p className="mb-3 mt-0.5 text-xs text-body-subtle">Match your device, or choose one.</p>
          <div className="grid grid-cols-3 gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ theme: opt.value })}
                aria-pressed={preferences.theme === opt.value}
                className={clsx(
                  'min-h-11 rounded-base border text-sm font-medium transition-colors',
                  preferences.theme === opt.value
                    ? 'border-transparent bg-brand text-white shadow-xs'
                    : 'border-border-default-medium bg-neutral-secondary-soft text-body hover:text-heading',
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard padding="lg" className="space-y-4">
          <ToggleRow
            icon={<VolumeIcon className="h-4 w-4" />}
            label="Sound"
            description="Chimes for timers and completions"
            checked={preferences.soundEnabled}
            onChange={(v) => updatePreferences({ soundEnabled: v })}
          />
          <ToggleRow
            icon={<VibrateIcon className="h-4 w-4" />}
            label="Vibration"
            description="Gentle haptic feedback on your phone"
            checked={preferences.hapticsEnabled}
            onChange={(v) => updatePreferences({ hapticsEnabled: v })}
          />
        </GlassCard>

        <p className="px-1 text-center text-xs text-body-subtle">
          Your workouts and progress are saved on this device only.
        </p>
      </div>
    </div>
  )
}

function ToggleRow({
  icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode
  label: string
  description: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-softer text-fg-brand-strong">
          {icon}
        </span>
        <div>
          <p className="text-sm font-medium text-heading">{label}</p>
          <p className="text-xs text-body-subtle">{description}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative h-7 w-12 flex-shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand' : 'bg-neutral-quaternary',
        )}
      >
        <span
          className={clsx(
            'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
