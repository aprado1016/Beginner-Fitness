export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

let counter = 0

/** Compact, dependency-free unique id. Good enough for client-only session records. */
export function generateId(prefix = 'id'): string {
  counter += 1
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}_${Date.now().toString(36)}${counter}${random}`
}
