import { useEffect, useMemo, useRef, useState } from 'react'

type TaskEventLevel = 'info' | 'success' | 'warning' | 'error'

export type TaskEvent = {
  id: string
  taskId: string
  level: TaskEventLevel
  message: string
  timestamp: string
}

const EVENT_MESSAGES: Array<{ level: TaskEventLevel; message: string }> = [
  { level: 'info', message: 'Agent queued spec review for the latest diff.' },
  { level: 'success', message: 'CI checks completed successfully on commit e2f4c1.' },
  { level: 'warning', message: 'Retrying repository sync after transient network blip.' },
  { level: 'info', message: 'Generated synthetic tests for the new entrypoint.' },
  { level: 'error', message: 'Unit tests failed: tasks/useTaskEventStream.test.ts (flaky suite).' },
  { level: 'info', message: 'Developer joined the room for pair review.' },
  { level: 'success', message: 'Applied lint fixes suggested by the agent.' },
  { level: 'warning', message: 'Long-running build detected; switching to streamed logs.' },
]

const MAX_EVENTS = 40

const pickEvent = (index: number) => EVENT_MESSAGES[index % EVENT_MESSAGES.length]

export const useTaskEventStream = (taskId: string | undefined) => {
  const [events, setEvents] = useState<TaskEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const counterRef = useRef(0)

  useEffect(() => {
    if (!taskId) {
      setEvents([])
      setIsConnected(false)
      return
    }

    let cancelled = false
    setIsConnected(true)
    counterRef.current = 0

    const seedEvents: TaskEvent[] = Array.from({ length: 3 }, (_, index) => {
      const template = pickEvent(index)
      return {
        id: `${taskId}-seed-${index}`,
        taskId,
        level: template.level,
        message: template.message,
        timestamp: new Date(Date.now() - (3 - index) * 1000 * 20).toISOString(),
      }
    })
    setEvents(seedEvents)

    const interval = window.setInterval(() => {
      if (cancelled) {
        return
      }

      counterRef.current += 1
      const template = pickEvent(counterRef.current)
      const nextEvent: TaskEvent = {
        id: `${taskId}-${Date.now()}`,
        taskId,
        level: template.level,
        message: template.message,
        timestamp: new Date().toISOString(),
      }

      setEvents((previous) => {
        const next = [...previous, nextEvent]
        if (next.length > MAX_EVENTS) {
          return next.slice(next.length - MAX_EVENTS)
        }
        return next
      })
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
      setIsConnected(false)
    }
  }, [taskId])

  const latestEvent = useMemo(() => events.at(-1), [events])

  return {
    events,
    isConnected,
    latestEvent,
  }
}
