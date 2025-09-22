export type EnvironmentStatus = 'healthy' | 'degraded' | 'offline'

export interface Environment {
  id: string
  name: string
  repository: string
  taskCount: number
  creator: string
  createdAt: string
  status: EnvironmentStatus
  lastSyncAt: string
}
