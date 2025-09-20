import { Badge } from '@fluentui/react-components'
import type { BadgeProps } from '@fluentui/react-components'
import type { TaskStatus } from '../../types/task'

const statusLabel: Record<TaskStatus, string> = {
  open: 'Open',
  running: 'Running',
  merged: 'Merged',
  archived: 'Archived',
  failed: 'Failed',
}

type BadgeColor = NonNullable<BadgeProps['color']>

const statusColor: Record<TaskStatus, BadgeColor> = {
  open: 'informative',
  running: 'warning',
  merged: 'success',
  archived: 'subtle',
  failed: 'danger',
}

export const TaskStatusPill = ({ status }: { status: TaskStatus }) => {
  return (
    <Badge appearance="filled" color={statusColor[status]} size="medium" shape="rounded">
      {statusLabel[status]}
    </Badge>
  )
}
