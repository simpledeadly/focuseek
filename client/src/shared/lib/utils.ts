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

  if (!match || match[0] === '') {
    const msg = 'Введите время в формате 1h 1m 1s\n'
    console.log(msg, duration, match)
    return 0
  }

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

export const getStartOfTodayMillis = () => {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
  return startOfToday.getTime()
}

export const formatDateToYMD = (date: Date, time: boolean = false): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  if (time) {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}`
  } else {
    return `${day}.${month}.${year}`
  }
}

export const updateLocalStorageField = (key: string, field: string, newValue: string) => {
  const stored = localStorage.getItem(key)
  const obj = stored ? JSON.parse(stored) : {}

  obj[field] = newValue

  localStorage.setItem(key, JSON.stringify(obj))
}

export const declOfNum = (number: number, titles: [string, string, string]): string => {
  const cases = [2, 0, 1, 1, 1, 2]
  return titles[
    number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
  ]
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
