import { Badge, makeStyles, tokens } from '@fluentui/react-components'
import type { TaskStatus } from '../../types/task'

const statusLabel: Record<TaskStatus, string> = {
  open: 'Open',
  running: 'Running',
  merged: 'Merged',
  archived: 'Archived',
  failed: 'Failed',
}

const statusPalette: Record<TaskStatus, { background: string; color: string }> = {
  open: { background: '#3FB950', color: '#0D1117' },
  running: { background: '#D29922', color: '#0D1117' },
  merged: { background: '#BC8CFF', color: '#0D1117' },
  archived: { background: tokens.colorNeutralBackground3, color: tokens.colorNeutralForeground2 },
  failed: { background: '#F85149', color: '#0D1117' },
}

const useStyles = makeStyles({
  pill: {
    fontWeight: 600,
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
  },
})

export const TaskStatusPill = ({ status }: { status: TaskStatus }) => {
  const styles = useStyles()
  const label = statusLabel[status]
  const palette = statusPalette[status]

  return (
    <Badge
      appearance="filled"
      size="medium"
      shape="rounded"
      className={styles.pill}
      role="status"
      aria-label={`Task status: ${label}`}
      style={{ backgroundColor: palette.background, color: palette.color }}
    >
      {label}
    </Badge>
  )
}
