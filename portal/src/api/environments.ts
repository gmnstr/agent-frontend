import type { Environment, EnvironmentStatus } from '../types/environment'

const STATUS_POOL: EnvironmentStatus[] = ['healthy', 'degraded', 'healthy', 'healthy', 'offline']
const REPOSITORIES = [
  'octo/runtime',
  'octo/agent-ui',
  'octo/agent-core',
  'octo/data-pipeline',
  'octo/swe-kit',
  'octo/vector-db',
  'octo/workflow-engine',
]

const OWNERS = ['Mina Harper', 'Devon Castillo', 'Aria Chen', 'Rahul Patel', 'Elena Novak', 'Jonah Lee']

const ENVIRONMENT_NAMES = [
  'Production shipyard',
  'Staging runway',
  'Load testing loop',
  'Blue/green sandbox',
  'Canary lab',
  'QA observatory',
  'Nightly automation',
  'Security drill zone',
  'Docs preview stack',
  'Internal beta',
  'Partner sandbox',
  'Legacy parity',
]

const buildMockEnvironments = (): Environment[] => {
  const now = Date.now()

  return ENVIRONMENT_NAMES.map((name, index) => {
    const createdAt = new Date(now - index * 1000 * 60 * 60 * 36)
    const lastSyncAt = new Date(now - (index % 5) * 1000 * 60 * 17)
    const repository = REPOSITORIES[index % REPOSITORIES.length]
    const creator = OWNERS[index % OWNERS.length]
    const status = STATUS_POOL[index % STATUS_POOL.length]
    const taskCount = 12 + ((index * 7) % 24)

    return {
      id: `env-${index + 1}`,
      name,
      repository,
      taskCount,
      creator,
      createdAt: createdAt.toISOString(),
      status,
      lastSyncAt: lastSyncAt.toISOString(),
    }
  })
}

const MOCK_ENVIRONMENTS = buildMockEnvironments()

export const fetchEnvironments = async (): Promise<Environment[]> => {
  await new Promise((resolve) => setTimeout(resolve, 320))
  return MOCK_ENVIRONMENTS
}
