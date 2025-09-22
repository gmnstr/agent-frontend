import { Skeleton, Text, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import type { Task } from '../../types/task'
import { TaskStatusPill } from './TaskStatusPill'

type TaskListSimplifiedProps = {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  isLoading?: boolean
  emptyStateMessage?: string
  highlightQuery?: string
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
    ...shorthands.padding('1rem', '1.25rem'),
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow2,
    transitionProperty: 'background-color, transform',
    transitionDuration: '120ms',
    cursor: 'pointer',
    selectors: {
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground3,
      },
      '&:focus-visible': {
        outline: `2px solid ${tokens.colorBrandBackground}`,
        outlineOffset: '3px',
      },
    },
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontFamily: tokens.fontFamilyMonospace,
  },
  additions: {
    color: '#3FB950',
  },
  deletions: {
    color: '#F85149',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: '0.875rem',
  },
  skeleton: {
    ...shorthands.padding('1rem', '1.25rem'),
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  emptyState: {
    borderRadius: '0.85rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    ...shorthands.padding('2.5rem', '1.5rem'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  highlight: {
    backgroundColor: 'rgba(56, 139, 253, 0.25)',
    borderRadius: '0.25rem',
    ...shorthands.padding('0', '0.15rem'),
  },
})

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightMatches = (text: string, query: string, className: string): ReactNode => {
  const normalized = query.trim()

  if (!normalized) {
    return text
  }

  const escaped = escapeRegExp(normalized)

  if (!escaped) {
    return text
  }

  const regex = new RegExp(`(${escaped})`, 'ig')
  const segments = text.split(regex)

  if (segments.length <= 1) {
    return text
  }

  const normalizedLower = normalized.toLowerCase()

  return segments.map((segment, index) =>
    segment.toLowerCase() === normalizedLower ? (
      <span key={`${segment}-${index}`} className={className}>
        {segment}
      </span>
    ) : (
      <span key={`${segment}-${index}`}>{segment}</span>
    ),
  )
}

export const TaskListSimplified = ({
  tasks,
  onTaskClick,
  isLoading = false,
  emptyStateMessage = 'No tasks yet. Start by describing what you would like to build next.',
  highlightQuery = '',
}: TaskListSimplifiedProps) => {
  const styles = useStyles()

  const handleClick = (task: Task) => (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    onTaskClick?.(task)
  }

  const handleKeyDown = (task: Task) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onTaskClick?.(task)
    }
  }

  if (isLoading) {
    return (
      <div className={styles.root} aria-busy="true" aria-live="polite">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={styles.skeleton}>
            <Skeleton appearance="translucent" />
            <Skeleton appearance="translucent" />
            <Skeleton appearance="translucent" />
          </div>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className={styles.emptyState} role="status" aria-live="polite">
        {emptyStateMessage}
      </div>
    )
  }

  return (
    <div className={styles.root}>
      {tasks.map((task) => {
        const description = `${formatRelativeTime(task.createdAt)} • ${task.repository}`
        const extendedDescription = task.summary ? `${description} • ${task.summary}` : description

        return (
          <div
            key={task.id}
            className={styles.item}
            onClick={handleClick(task)}
            onKeyDown={handleKeyDown(task)}
            role={onTaskClick ? 'button' : undefined}
            tabIndex={onTaskClick ? 0 : -1}
          >
            <div className={styles.header}>
              <Text weight="semibold" size={400}>
                {highlightMatches(task.title, highlightQuery, styles.highlight)}
              </Text>
              <div className={styles.meta} aria-label="Diff statistics">
                <TaskStatusPill status={task.status} />
                <span>
                  <span className={styles.additions}>+{task.additions}</span>
                  {' '}
                  <span className={styles.deletions}>-{task.deletions}</span>
                </span>
              </div>
            </div>
            <Text size={200} className={styles.description}>
              {highlightMatches(extendedDescription, highlightQuery, styles.highlight)}
            </Text>
          </div>
        )
      })}
    </div>
  )
}
