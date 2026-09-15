import { useState } from 'react'
import type { FormGuidance } from '@/types'
import { ChevronDownIcon, InfoIcon, TargetIcon } from '@/components/icons'
import { Badge } from '@/components/ui/Badge'
import { clsx } from '@/lib/clsx'

interface HowToDoItProps {
  form: FormGuidance
  defaultOpen?: boolean
}

export function HowToDoIt({ form, defaultOpen = false }: HowToDoItProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = 'how-to-do-it-panel'

  return (
    <div className="border-t border-glass-subtle pt-1">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-control px-1 py-2.5 text-left transition-colors hover:bg-glass-hover"
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-heading">
          <InfoIcon className="h-[18px] w-[18px] text-fg-brand" />
          How to do it
        </span>
        <ChevronDownIcon
          className={clsx('h-4 w-4 text-body-subtle transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div id={panelId} className="animate-rise-in space-y-4 px-1 pb-3 pt-1">
          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-subtle">Form cues</h4>
            <ul className="space-y-1.5">
              {form.cues.map((cue, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-body">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                  {cue}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-body-subtle">
              <TargetIcon className="h-3.5 w-3.5" /> Muscles worked
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {form.musclesWorked.map((muscle) => (
                <Badge key={muscle} variant="brand">
                  {muscle}
                </Badge>
              ))}
            </div>
          </div>

          <div className="rounded-control border border-warning-medium bg-warning-soft px-3 py-2.5">
            <p className="text-xs font-semibold text-warning-strong">Avoid this common mistake</p>
            <p className="mt-0.5 text-sm leading-relaxed text-body">{form.commonMistake}</p>
          </div>
        </div>
      )}
    </div>
  )
}
