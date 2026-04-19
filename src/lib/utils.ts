import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format an ISO date string to a human-readable date + time.
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

// Format an ISO date string to date only.
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'medium' })
}

// Generate star label (e.g. "4.5 / 5")
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} / 5`
}

// Convert minutes to "Xh Ym" label.
export function minutesToDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`
}

// Slugify a string (for categories etc.)
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}
