export type TelemetryEvent =
  | { type: 'task_opened'; taskId: string }
  | { type: 'tab_changed'; tab: string; taskId?: string }
  | { type: 'pr_clicked'; taskId: string; url?: string }
  | { type: 'route_viewed'; route: string }

export type EnrichedTelemetryEvent = TelemetryEvent & {
  timestamp: string
  pathname?: string
  timeOriginDelta?: number
}

type TelemetryListener = (event: EnrichedTelemetryEvent) => void

const listeners = new Set<TelemetryListener>()

export const subscribeToTelemetry = (listener: TelemetryListener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const trackEvent = (event: TelemetryEvent): EnrichedTelemetryEvent => {
  const timestamp = new Date().toISOString()
  const pathname = typeof window !== 'undefined' ? window.location.pathname : undefined
  const timeOriginDelta =
    typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? Math.round(performance.now())
      : undefined

  const enriched: EnrichedTelemetryEvent = {
    ...event,
    timestamp,
    pathname,
    timeOriginDelta,
  }

  if (typeof console !== 'undefined' && typeof console.info === 'function') {
    console.info('[telemetry]', enriched)
  }

  listeners.forEach((listener) => {
    try {
      listener(enriched)
    } catch (error) {
      if (import.meta.env?.MODE !== 'production') {
        console.error('Telemetry listener failed', error)
      }
    }
  })

  return enriched
}
