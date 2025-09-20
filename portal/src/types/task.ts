export type TaskStatus = 'open' | 'running' | 'merged' | 'archived' | 'failed'

export interface Task {
  id: string
  title: string
  repository: string
  status: TaskStatus
  additions: number
  deletions: number
  createdAt: string
  summary?: string
}
