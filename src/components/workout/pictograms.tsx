import type { ReactElement, SVGProps } from 'react'
import type { ExerciseGlyph } from '@/types'

type IconProps = SVGProps<SVGSVGElement>

const stroke = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function SquatGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M10 14 24 26 38 14" />
      <path d="M10 34 24 22 38 34" />
    </svg>
  )
}

function PushGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M8 30h32" />
      <path d="M14 30 20 16h8l6 14" />
      <path d="M24 8v6" />
    </svg>
  )
}

function PlankGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6 32h36" />
      <path d="M12 32V22l24-4v14" />
      <path d="M30 10a6 6 0 1 1 0 0.01" strokeDasharray="3 4" />
    </svg>
  )
}

function BridgeGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6 32h6" />
      <path d="M36 32h6" />
      <path d="M12 32c3-12 21-12 24 0" />
      <path d="M24 10v6" />
      <path d="M20 12l4-4 4 4" />
    </svg>
  )
}

function CoreGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M16 12a12 12 0 1 0 12 12" />
      <path d="M22 8l6 4-6 4" />
    </svg>
  )
}

function ScissorGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M8 12 40 36" />
      <path d="M40 12 8 36" />
      <circle cx="24" cy="24" r="2.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RaiseGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="24" cy="10" r="4" />
      <path d="M24 16v14" />
      <path d="M24 20 10 12" />
      <path d="M24 20 38 12" />
      <path d="M8 16l2-5 5 1" />
      <path d="M40 16l-2-5-5 1" />
    </svg>
  )
}

function RowGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6 34h36" />
      <path d="M12 34V24l22-5" />
      <path d="M22 20 34 16" />
      <path d="M28 10l6 6-6 6" />
    </svg>
  )
}

function LungeGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M8 36h32" />
      <path d="M14 36 22 20l12-4" />
      <path d="M22 20 30 36" />
      <path d="M30 10l6 2-2 6" />
      <path d="M36 12 26 20" />
    </svg>
  )
}

function HingeGlyph(props: IconProps) {
  return (
    <svg {...stroke} {...props}>
      <path d="M10 36 26 30" />
      <path d="M26 30 20 12" />
      <path d="M20 12l6-3 3 5" />
      <path d="M34 20l4 4-4 4" />
    </svg>
  )
}

export const PICTOGRAMS: Record<ExerciseGlyph, { Icon: (props: IconProps) => ReactElement; label: string }> = {
  squat: { Icon: SquatGlyph, label: 'Squat' },
  gobletSquat: { Icon: SquatGlyph, label: 'Squat' },
  pushup: { Icon: PushGlyph, label: 'Push' },
  plank: { Icon: PlankGlyph, label: 'Hold' },
  bridge: { Icon: BridgeGlyph, label: 'Bridge' },
  hipThrust: { Icon: BridgeGlyph, label: 'Bridge' },
  crunch: { Icon: CoreGlyph, label: 'Core' },
  verticalCrunch: { Icon: CoreGlyph, label: 'Core' },
  sitUp: { Icon: CoreGlyph, label: 'Core' },
  legSwitch: { Icon: ScissorGlyph, label: 'Core' },
  lateralRaise: { Icon: RaiseGlyph, label: 'Raise' },
  frontRaise: { Icon: RaiseGlyph, label: 'Raise' },
  frontHold: { Icon: RaiseGlyph, label: 'Hold' },
  uprightRow: { Icon: RowGlyph, label: 'Row' },
  row: { Icon: RowGlyph, label: 'Row' },
  lunge: { Icon: LungeGlyph, label: 'Lunge' },
  reverseLunge: { Icon: LungeGlyph, label: 'Lunge' },
  deadlift: { Icon: HingeGlyph, label: 'Hinge' },
}
