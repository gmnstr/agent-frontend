// portal/src/components/data/TaskStatusBadge.tsx
import { makeStyles, tokens } from '@fluentui/react-components'

type Status = 'open' | 'running' | 'merged' | 'failed'

const useStyles = makeStyles({
  root: {
    borderRadius: '6px',
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: 600,
    padding: '0 8px 0 6px',
    height: '20px',
    display: 'inline-grid',
    gridAutoFlow: 'column',
    alignItems: 'center',
    columnGap: '6px',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  open: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
  },
  running: {
    backgroundColor: tokens.colorBrandBackground2,
    color: tokens.colorBrandForeground1,
  },
  merged: {
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground1,
  },
  failed: {
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground1,
  },
})

const dotColor: Record<Status, string> = {
  open: tokens.colorNeutralForeground3,
  running: tokens.colorBrandForeground1,
  merged: tokens.colorNeutralForeground2,
  failed: tokens.colorPaletteRedForeground1,
}

export function TaskStatusBadge({ status, label }: { status: Status; label?: string }) {
  const s = useStyles()
  const cls =
    status === 'running' ? s.running : status === 'failed' ? s.failed : status === 'merged' ? s.merged : s.open

  return (
    <span className={`${s.root} ${cls}`} role="status" aria-label={label ?? status}>
      <span className={s.dot} style={{ backgroundColor: dotColor[status] }} aria-hidden="true" />
      {label ?? status}
    </span>
  )
}
