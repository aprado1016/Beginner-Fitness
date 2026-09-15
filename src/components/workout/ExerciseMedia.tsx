import type { ExerciseMedia as ExerciseMediaType } from '@/types'
import { PICTOGRAMS } from './pictograms'
import { clsx } from '@/lib/clsx'

interface ExerciseMediaProps {
  media: ExerciseMediaType
  exerciseName: string
  size?: 'md' | 'lg'
}

export function ExerciseMedia({ media, exerciseName, size = 'lg' }: ExerciseMediaProps) {
  const isCompact = size === 'md'
  const heightClass = isCompact ? 'aspect-square' : 'aspect-[4/3]'

  if (media.type === 'photo' && media.src) {
    return (
      <div className={clsx('relative w-full overflow-hidden rounded-base bg-neutral-tertiary', heightClass)}>
        <img
          src={media.src}
          alt={`Demonstration of ${exerciseName}`}
          className="exercise-photo-filter h-full w-full object-cover object-top"
        />
        {media.srcAlt && (
          <img
            src={media.srcAlt}
            alt=""
            aria-hidden="true"
            className="exercise-photo-filter exercise-photo-crossfade absolute inset-0 h-full w-full object-cover object-top"
          />
        )}
      </div>
    )
  }

  if (media.type !== 'illustration' && media.src) {
    return (
      <div className={clsx('relative w-full overflow-hidden rounded-base bg-neutral-tertiary', heightClass)}>
        {media.type === 'video' ? (
          <video
            src={media.src}
            poster={media.poster}
            autoPlay
            loop
            muted
            playsInline
            className="h-full w-full object-cover"
            aria-label={`Demonstration of ${exerciseName}`}
          />
        ) : (
          <img src={media.src} alt={`Demonstration of ${exerciseName}`} className="h-full w-full object-cover" />
        )}
      </div>
    )
  }

  const { Icon, label } = PICTOGRAMS[media.glyph]

  if (isCompact) {
    return (
      <div
        className={clsx('relative flex w-full items-center justify-center overflow-hidden rounded-control', heightClass)}
        style={{
          background: 'linear-gradient(160deg, rgb(var(--c-brand-softer)) 0%, rgb(var(--c-neutral-tertiary)) 65%)',
        }}
        role="img"
        aria-label={`Illustration showing the ${label.toLowerCase()} movement pattern for ${exerciseName}`}
      >
        <Icon className="h-6 w-6 text-fg-brand-strong" />
      </div>
    )
  }

  return (
    <div
      className={clsx(
        'relative flex w-full flex-col items-center justify-center overflow-hidden rounded-base',
        heightClass,
      )}
      style={{
        background:
          'linear-gradient(160deg, rgb(var(--c-brand-softer)) 0%, rgb(var(--c-neutral-tertiary)) 65%)',
      }}
      role="img"
      aria-label={`Illustration showing the ${label.toLowerCase()} movement pattern for ${exerciseName}`}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/60 shadow-sm dark:bg-white/10">
        <Icon className="h-11 w-11 text-fg-brand-strong" />
      </div>
      <span className="mt-3 text-xs font-medium uppercase tracking-wide text-fg-brand-strong/80">{label} movement</span>
      <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-medium text-heading/70 backdrop-blur-sm dark:bg-white/10 dark:text-white/70">
        Illustration
      </span>
    </div>
  )
}
