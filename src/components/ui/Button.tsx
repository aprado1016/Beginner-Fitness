import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { clsx } from '@/lib/clsx'

type Variant = 'brand' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'ghost'
type Size = 'sm' | 'base' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  pill?: boolean
  fullWidth?: boolean
  icon?: ReactNode
  children?: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  brand:
    'bg-brand text-white border border-transparent hover:bg-brand-strong focus-visible:ring-4 focus-visible:ring-brand/30 shadow-xs',
  secondary:
    'bg-neutral-secondary-medium text-body border border-border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus-visible:ring-4 focus-visible:ring-neutral-tertiary/40 shadow-xs',
  tertiary:
    'bg-neutral-primary-soft text-body border border-border-default hover:bg-neutral-secondary-medium hover:text-heading focus-visible:ring-4 shadow-xs',
  success:
    'bg-success text-white border border-transparent hover:bg-success-strong focus-visible:ring-4 focus-visible:ring-success-medium/50 shadow-xs',
  danger:
    'bg-danger text-white border border-transparent hover:bg-danger-strong focus-visible:ring-4 focus-visible:ring-danger-medium/50 shadow-xs',
  ghost: 'bg-transparent text-heading border border-transparent hover:bg-neutral-secondary-medium',
}

const GLINT = 'shadow-[var(--shadow-xs),inset_var(--color-1-400)_0_6px_0px_-5px,var(--color-1-700)_0_4px_10px_-5px]'

const SIZE_CLASSES: Record<Size, string> = {
  sm: 'min-h-11 text-sm px-4 py-2 gap-1.5',
  base: 'min-h-11 text-sm px-4 py-2.5 gap-2',
  lg: 'min-h-12 text-base px-5 py-3 gap-2',
  xl: 'min-h-[52px] text-base px-6 py-3.5 gap-2',
}

export function Button({
  variant = 'brand',
  size = 'base',
  pill = false,
  fullWidth = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const hasGlint = variant !== 'ghost'
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-150 active:scale-[0.97]',
        pill ? 'rounded-full' : 'rounded-base',
        VARIANT_CLASSES[variant],
        hasGlint && !disabled ? GLINT : '',
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        disabled && 'cursor-not-allowed bg-disabled text-fg-disabled border-border-default-medium opacity-70 shadow-none active:scale-100',
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  )
}
