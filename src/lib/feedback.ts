// Lightweight, dependency-free haptic + audio feedback. No external assets —
// tones are synthesized with the Web Audio API so the app stays fast to load.

export function vibrate(pattern: number | number[], enabled: boolean) {
  if (!enabled) return
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  try {
    navigator.vibrate(pattern)
  } catch {
    // Some browsers throw if called outside a user gesture — safe to ignore.
  }
}

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return null
  if (!audioCtx) audioCtx = new AudioContextClass()
  return audioCtx
}

function tone(frequency: number, startOffset: number, duration: number, ctx: AudioContext, gainValue = 0.08) {
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = 'sine'
  oscillator.frequency.value = frequency
  gain.gain.setValueAtTime(0, ctx.currentTime + startOffset)
  gain.gain.linearRampToValueAtTime(gainValue, ctx.currentTime + startOffset + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(ctx.currentTime + startOffset)
  oscillator.stop(ctx.currentTime + startOffset + duration + 0.02)
}

export function playChime(kind: 'tick' | 'timerDone' | 'setComplete' | 'workoutComplete', enabled: boolean) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  if (ctx.state === 'suspended') void ctx.resume()

  switch (kind) {
    case 'tick':
      tone(880, 0, 0.06, ctx, 0.04)
      break
    case 'setComplete':
      tone(660, 0, 0.12, ctx)
      tone(880, 0.08, 0.16, ctx)
      break
    case 'timerDone':
      tone(784, 0, 0.15, ctx)
      tone(1046, 0.12, 0.22, ctx)
      break
    case 'workoutComplete':
      tone(523, 0, 0.14, ctx)
      tone(659, 0.1, 0.14, ctx)
      tone(784, 0.2, 0.14, ctx)
      tone(1046, 0.32, 0.3, ctx)
      break
  }
}
