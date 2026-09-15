type ClassValue = string | number | false | null | undefined | Record<string, boolean>

export function clsx(...args: ClassValue[]): string {
  const out: string[] = []
  for (const arg of args) {
    if (!arg) continue
    if (typeof arg === 'string' || typeof arg === 'number') {
      out.push(String(arg))
    } else {
      for (const key in arg) {
        if (arg[key]) out.push(key)
      }
    }
  }
  return out.join(' ')
}
