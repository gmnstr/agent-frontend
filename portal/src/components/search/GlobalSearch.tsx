import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import {
  Badge,
  Button,
  Caption1,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Input,
  Spinner,
  Text,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { Search24Regular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchTasks } from '../../api/tasks'
import { fetchEnvironments } from '../../api/environments'
import type { Task } from '../../types/task'
import type { Environment } from '../../types/environment'
import type { EnvironmentStatus } from '../../types/environment'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import { TaskStatusBadge } from '../data/TaskStatusBadge'

const environmentStatusLabel: Record<EnvironmentStatus, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  offline: 'Offline',
}

const environmentStatusColor: Record<EnvironmentStatus, 'success' | 'warning' | 'danger'> = {
  healthy: 'success',
  degraded: 'warning',
  offline: 'danger',
}

type SearchSection<T> = {
  key: string
  label: string
  results: T[]
}

type TaskSearchResult = {
  kind: 'task'
  task: Task
}

type EnvironmentSearchResult = {
  kind: 'environment'
  environment: Environment
}

type SearchResult = TaskSearchResult | EnvironmentSearchResult

const useStyles = makeStyles({
  triggerButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    minWidth: '12rem',
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    paddingInlineStart: '0.9rem',
    paddingInlineEnd: '0.75rem',
    fontWeight: 500,
    transitionProperty: 'background-color, border-color, color',
    transitionDuration: '120ms',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground4,
      color: tokens.colorNeutralForeground1,
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
    },
  },
  triggerLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  shortcut: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    lineHeight: '1',
    borderRadius: '0.5rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground3,
    paddingInline: '0.35rem',
    minWidth: '2.25rem',
  },
  surface: {
    width: 'min(720px, 92vw)',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRadius: '1rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    boxShadow: tokens.shadow64,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    ...shorthands.padding('1.5rem', '1.75rem', '1.75rem'),
  },
  searchField: {
    width: '100%',
  },
  helperText: {
    color: tokens.colorNeutralForeground3,
  },
  results: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    minHeight: '12rem',
  },
  resultGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  groupLabel: {
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  resultButton: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.45rem',
    borderRadius: '0.85rem',
    backgroundColor: tokens.colorNeutralBackground1,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.padding('0.9rem', '1rem'),
    textAlign: 'left',
    transitionProperty: 'border-color, transform, background-color',
    transitionDuration: '120ms',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
      borderTopColor: tokens.colorBrandStroke1,
      borderRightColor: tokens.colorBrandStroke1,
      borderBottomColor: tokens.colorBrandStroke1,
      borderLeftColor: tokens.colorBrandStroke1,
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.colorBrandBackground}`,
      outlineOffset: '3px',
    },
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  resultMeta: {
    color: tokens.colorNeutralForeground3,
  },
  emptyState: {
    borderRadius: '0.85rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    ...shorthands.padding('2rem', '1.5rem'),
    display: 'grid',
    placeItems: 'center',
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
  highlight: {
    backgroundColor: 'rgba(88, 166, 255, 0.24)',
    borderRadius: '0.25rem',
    ...shorthands.padding('0', '0.2rem'),
  },
  loadingState: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: tokens.colorNeutralForeground3,
  },
})

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightMatches = (text: string, query: string, className: string): ReactNode => {
  if (!query) {
    return text
  }

  const escaped = escapeRegExp(query.trim())
  if (!escaped) {
    return text
  }

  const regex = new RegExp(`(${escaped})`, 'ig')
  const segments = text.split(regex)
  if (segments.length <= 1) {
    return text
  }

  const normalized = query.trim().toLowerCase()
  return segments.map((segment, index) =>
    segment.toLowerCase() === normalized ? (
      <span key={`${segment}-${index}`} className={className}>
        {segment}
      </span>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    ),
  )
}

const useShortcutLabel = () => {
  const [label, setLabel] = useState('Ctrl+K')

  useEffect(() => {
    if (typeof navigator === 'undefined') {
      return
    }

    const isMac = /mac/i.test(navigator.platform)
    setLabel(isMac ? '⌘K' : 'Ctrl+K')
  }, [])

  return label
}

export const GlobalSearch = () => {
  const styles = useStyles()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)
  const firstResultRef = useRef<HTMLButtonElement | null>(null)
  const shortcutLabel = useShortcutLabel()

  const prefetchData = useCallback(() => {
    void queryClient.prefetchQuery({ queryKey: ['tasks'], queryFn: fetchTasks, staleTime: 1000 * 30 })
    void queryClient.prefetchQuery({ queryKey: ['environments'], queryFn: fetchEnvironments, staleTime: 1000 * 60 })
  }, [queryClient])

  useEffect(() => {
    if (!open) {
      return
    }

    prefetchData()
  }, [open, prefetchData])

  useEffect(() => {
    if (!open) {
      return
    }

    const focusInput = () => {
      const input = inputRef.current
      if (input) {
        input.focus()
        input.select()
      }
    }

    const frame = window.requestAnimationFrame(focusInput)
    const timeout = window.setTimeout(focusInput, 40)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [open])

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return
      }

      const key = event.key.toLowerCase()
      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault()
        setOpen(true)
        prefetchData()
      }
    }

    window.addEventListener('keydown', listener)
    return () => window.removeEventListener('keydown', listener)
  }, [prefetchData])

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 30,
    enabled: open,
  })

  const { data: environments = [], isLoading: envLoading } = useQuery({
    queryKey: ['environments'],
    queryFn: fetchEnvironments,
    staleTime: 1000 * 60,
    enabled: open,
  })

  const isLoading = tasksLoading || envLoading
  const normalizedQuery = query.trim().toLowerCase()

  const taskResults = useMemo<TaskSearchResult[]>(() => {
    if (!normalizedQuery) {
      return []
    }

    const sorted = [...tasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return sorted
      .filter((task) => {
        const values = [task.title, task.repository, task.summary ?? '', task.status]
        return values.some((value) => value.toLowerCase().includes(normalizedQuery))
      })
      .slice(0, 6)
      .map((task) => ({ kind: 'task', task }))
  }, [normalizedQuery, tasks])

  const environmentResults = useMemo<EnvironmentSearchResult[]>(() => {
    if (!normalizedQuery) {
      return []
    }

    return environments
      .filter((environment) => {
        const values = [
          environment.name,
          environment.repository,
          environment.creator,
          environment.status,
        ]
        return values.some((value) => value.toLowerCase().includes(normalizedQuery))
      })
      .slice(0, 5)
      .map((environment) => ({ kind: 'environment', environment }))
  }, [environments, normalizedQuery])

  const sections = useMemo<SearchSection<SearchResult>[]>(() => {
    const entries: SearchSection<SearchResult>[] = []

    if (taskResults.length > 0) {
      entries.push({ key: 'tasks', label: 'Tasks', results: taskResults })
    }

    if (environmentResults.length > 0) {
      entries.push({ key: 'environments', label: 'Environments', results: environmentResults })
    }

    return entries
  }, [environmentResults, taskResults])

  const totalResults = useMemo(
    () => sections.reduce((total, section) => total + section.results.length, 0),
    [sections],
  )

  const handleOpenChange = useCallback(
    (_event: unknown, data: { open: boolean }) => {
      setOpen(data.open)
      if (!data.open) {
        setQuery('')
        firstResultRef.current = null
      }
    },
    [],
  )

  const handleQueryChange = (_event: ChangeEvent<HTMLInputElement>, data: { value: string }) => {
    setQuery(data.value)
  }

  const handleResultActivate = useCallback(
    (result: SearchResult) => {
      setOpen(false)
      setQuery('')
      firstResultRef.current = null

      if (result.kind === 'task') {
        navigate(`/tasks/${result.task.id}`)
        return
      }

      navigate('/settings/environments', { state: { highlight: result.environment.id } })
    },
    [navigate],
  )

  const handleInputKeyDown = useCallback((event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      firstResultRef.current?.focus()
    }
  }, [])

  let firstResultAssigned = false

  return (
    <Dialog open={open} onOpenChange={handleOpenChange} modalType="modal">
      <DialogTrigger disableButtonEnhancement>
        <Tooltip content={`Search the portal (${shortcutLabel})`} relationship="label">
          <Button
            appearance="subtle"
            icon={<Search24Regular />}
            className={styles.triggerButton}
            onMouseEnter={prefetchData}
            onFocus={prefetchData}
            aria-label="Open global search"
            data-testid="global-search-trigger"
          >
            <span className={styles.triggerLabel}>Search</span>
            <span className={styles.shortcut}>{shortcutLabel}</span>
          </Button>
        </Tooltip>
      </DialogTrigger>
      <DialogSurface className={styles.surface} aria-label="Search the Codex portal">
        <DialogBody className={styles.body}>
          <DialogTitle>Search</DialogTitle>
          <DialogContent>
            <Input
              className={styles.searchField}
              placeholder="Search tasks, repositories, or environments"
              type="search"
              value={query}
              onChange={handleQueryChange}
              contentBefore={<Search24Regular aria-hidden />}
              aria-label="Search the portal"
              ref={inputRef}
              onKeyDown={handleInputKeyDown}
              autoFocus
              data-testid="global-search-input"
            />
            <Caption1 className={styles.helperText} role="note">
              Use {shortcutLabel} to open search from anywhere in the portal.
            </Caption1>
          </DialogContent>
          <div className={styles.results} role="listbox" aria-live="polite">
            {isLoading ? (
              <div className={styles.loadingState}>
                <Spinner size="small" label="Loading search index" labelPosition="after" />
              </div>
            ) : null}
            {!isLoading && normalizedQuery.length === 0 ? (
              <div className={styles.emptyState} role="status">
                Start typing to search across tasks and environments.
              </div>
            ) : null}
            {!isLoading && normalizedQuery.length > 0 && totalResults === 0 ? (
              <div className={styles.emptyState} role="status">
                No results match “{query}”. Try a different phrase or keyword.
              </div>
            ) : null}
            {!isLoading && totalResults > 0
              ? sections.map((section) => (
                  <div key={section.key} className={styles.resultGroup} role="group" aria-label={section.label}>
                    <Caption1 className={styles.groupLabel}>{section.label}</Caption1>
                    {section.results.map((result) => {
                      const ref = !firstResultAssigned
                        ? (node: HTMLButtonElement | null) => {
                            firstResultAssigned = true
                            firstResultRef.current = node
                          }
                        : undefined

                      if (result.kind === 'task') {
                        const { task } = result
                        const subtitle = `${task.repository}`
                        const descriptionParts = [formatRelativeTime(task.createdAt)]
                        if (task.summary) {
                          descriptionParts.push(task.summary)
                        }

                        return (
                          <Button
                            key={task.id}
                            appearance="transparent"
                            className={styles.resultButton}
                            onClick={() => handleResultActivate(result)}
                            data-testid={`global-search-result-task-${task.id}`}
                            ref={ref}
                          >
                            <div className={styles.resultHeader}>
                              <Badge appearance="tint" color="brand">
                                Task
                              </Badge>
                              <TaskStatusBadge status={task.status} />
                            </div>
                            <Text weight="semibold" size={400} wrap>
                              {highlightMatches(task.title, normalizedQuery, styles.highlight)}
                            </Text>
                            <Text size={200} className={styles.resultMeta} wrap>
                              {highlightMatches(subtitle, normalizedQuery, styles.highlight)}
                            </Text>
                            <Caption1 className={styles.resultMeta} wrap>
                              {highlightMatches(descriptionParts.join(' • '), normalizedQuery, styles.highlight)}
                            </Caption1>
                          </Button>
                        )
                      }

                      const { environment } = result
                      const subtitle = `${environment.repository}`
                      const description = `${environment.creator} • Last sync ${formatRelativeTime(environment.lastSyncAt)}`
                      return (
                        <Button
                          key={environment.id}
                          appearance="transparent"
                          className={styles.resultButton}
                          onClick={() => handleResultActivate(result)}
                          data-testid={`global-search-result-environment-${environment.id}`}
                          ref={ref}
                        >
                          <div className={styles.resultHeader}>
                            <Badge appearance="tint" color="informative">
                              Environment
                            </Badge>
                            <Badge appearance="tint" color={environmentStatusColor[environment.status]}>
                              {environmentStatusLabel[environment.status]}
                            </Badge>
                          </div>
                          <Text weight="semibold" size={400} wrap>
                            {highlightMatches(environment.name, normalizedQuery, styles.highlight)}
                          </Text>
                          <Text size={200} className={styles.resultMeta} wrap>
                            {highlightMatches(subtitle, normalizedQuery, styles.highlight)}
                          </Text>
                          <Caption1 className={styles.resultMeta} wrap>
                            {highlightMatches(description, normalizedQuery, styles.highlight)}
                          </Caption1>
                        </Button>
                      )
                    })}
                  </div>
                ))
              : null}
          </div>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}

export default GlobalSearch
