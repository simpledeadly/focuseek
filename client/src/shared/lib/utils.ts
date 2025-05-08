import type { Updater } from '@tanstack/vue-table'
import type { Ref } from 'vue'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export const capitalize = (input: string): string => {
  return input.charAt(0).toUpperCase() + input.slice(1)
}

export const parseDurationToUnixTimestamp = (duration: string): number => {
  const regex = /(\d+h)?\s*(\d+m)?\s*(\d+s)?/
  const match = duration.match(regex)

  if (!match) return 0

  let totalMs = 0
  if (match[1]) totalMs += parseInt(match[1]) * 60 * 60 * 1000
  if (match[2]) totalMs += parseInt(match[2]) * 60 * 1000
  if (match[3]) totalMs += parseInt(match[3]) * 1000

  return totalMs
}

export const parseUnixTimestampToDuration = (totalMs: number): string => {
  const hours = Math.floor(totalMs / (1000 * 60 * 60))
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000)

  if (hours) {
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`
  } else if (minutes) {
    return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`
  } else {
    return `${seconds}s`
  }
}

export const convertToLink = (text: string): string => {
  const urlRegex = /(?:\()?(https?:\/\/[^\s<>()]+)(?:\))?/g
  return text.replace(urlRegex, (match, url) => {
    return match.replace(
      url,
      `<a href="${url}" target="_blank" rel="noopener noreferrer" class="link">${url}</a>`
    )
  })
}

export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
}

export const handleError = (error: unknown, context: string = '') => {
  const message = error instanceof Error ? error.message : 'Unknown error'
  console.error(`${context}: ${message}`)
}
