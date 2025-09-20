const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const formatRelativeTime = (value: string | number | Date): string => {
  const target = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value
  const now = Date.now()
  const diff = now - target.getTime()

  if (Number.isNaN(diff)) {
    return ''
  }

  if (diff < MINUTE) {
    const seconds = Math.max(1, Math.round(diff / SECOND))
    return `${seconds}s ago`
  }

  if (diff < HOUR) {
    const minutes = Math.round(diff / MINUTE)
    return `${minutes}m ago`
  }

  if (diff < DAY) {
    const hours = Math.round(diff / HOUR)
    return `${hours}h ago`
  }

  if (diff < WEEK) {
    const days = Math.round(diff / DAY)
    return `${days}d ago`
  }

  const weeks = Math.round(diff / WEEK)
  return `${weeks}w ago`
}
