import type { DataGridProps } from '@fluentui/react-components'
import type { Task } from '../../../types/task'

export type TaskListSortState = NonNullable<DataGridProps['sortState']>

export const defaultSortState: TaskListSortState = {
  sortColumn: 'createdAt',
  sortDirection: 'descending',
}

export const filterTasks = (tasks: Task[], query: string) => {
  if (!query) {
    return tasks
  }

  const lowered = query.toLowerCase()
  return tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(lowered) ||
      task.repository.toLowerCase().includes(lowered) ||
      task.status.toLowerCase().includes(lowered)
    )
  })
}

const statusWeight = (status: Task['status']) => {
  switch (status) {
    case 'open':
      return 0
    case 'running':
      return 1
    case 'merged':
      return 2
    case 'failed':
      return 3
    case 'archived':
    default:
      return 4
  }
}

export const sortTasks = (tasks: Task[], sortState: TaskListSortState) => {
  if (!sortState.sortColumn) {
    return tasks
  }

  const direction = sortState.sortDirection === 'ascending' ? 1 : -1

  const sorted = [...tasks].sort((a, b) => {
    switch (sortState.sortColumn) {
      case 'title':
        return a.title.localeCompare(b.title) * direction
      case 'repository':
        return a.repository.localeCompare(b.repository) * direction
      case 'status':
        return (statusWeight(a.status) - statusWeight(b.status)) * direction
      case 'changes': {
        const left = a.additions - a.deletions
        const right = b.additions - b.deletions
        return (left - right) * direction
      }
      case 'createdAt':
      default:
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
    }
  })

  return sorted
}
