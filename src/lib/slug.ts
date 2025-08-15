import { customAlphabet } from 'nanoid'

// Generate URL-safe nanoid with lowercase letters and numbers
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6)

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateUniqueSlug(baseSlug: string, existingSlugs: string[] = []): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug
  }

  // Try with nanoid suffix
  for (let i = 0; i < 5; i++) {
    const uniqueSlug = `${baseSlug}-${nanoid()}`
    if (!existingSlugs.includes(uniqueSlug)) {
      return uniqueSlug
    }
  }

  // Fallback: use timestamp
  return `${baseSlug}-${Date.now()}`
}

export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length >= 1 && slug.length <= 100
}
