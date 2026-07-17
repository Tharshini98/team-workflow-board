const UNITS = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 3600, divisor: 60, unit: 'minute' },
  { limit: 86400, divisor: 3600, unit: 'hour' },
  { limit: 604800, divisor: 86400, unit: 'day' },
  { limit: 2629800, divisor: 604800, unit: 'week' },
  { limit: 31557600, divisor: 2629800, unit: 'month' },
  { limit: Infinity, divisor: 31557600, unit: 'year' },
]

const rtf = typeof Intl !== 'undefined' && Intl.RelativeTimeFormat
  ? new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  : null

/** Formats an ISO date string as "3 hours ago" style relative time. */
export function relativeTime(isoString, now = Date.now()) {
  if (!isoString) return ''
  const then = new Date(isoString).getTime()
  if (Number.isNaN(then)) return ''
  const diffSeconds = Math.round((now - then) / 1000)
  const abs = Math.abs(diffSeconds)

  if (abs < 5) return 'just now'

  for (const { limit, divisor, unit } of UNITS) {
    if (abs < limit) {
      const value = Math.round(diffSeconds / divisor)
      if (rtf) return rtf.format(-value, unit)
      return `${Math.abs(value)} ${unit}${Math.abs(value) === 1 ? '' : 's'} ago`
    }
  }
  return ''
}
