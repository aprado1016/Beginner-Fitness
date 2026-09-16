// display-mode: standalone is the standard check (Android/Chrome, desktop); iOS Safari exposes
// its own non-standard navigator.standalone flag instead of supporting that media query.
export function isStandaloneDisplay(): boolean {
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(nav.standalone)
}

// iPadOS 13+ reports as "MacIntel" in the UA string, so touch-point count is the only way to
// tell it apart from an actual Mac.
export function isIosDevice(): boolean {
  const ua = window.navigator.userAgent
  return /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}
