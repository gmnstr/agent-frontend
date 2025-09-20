import type { Task, TaskStatus } from '../types/task'

const STATUS_POOL: TaskStatus[] = ['open', 'running', 'merged', 'failed', 'archived']
const REPOSITORIES = [
  'octo/agent-core',
  'octo/agent-ui',
  'octo/swe-kit',
  'octo/runtime',
  'octo/vector-db',
  'octo/infra',
]

const TITLES = [
  'Improve diff rendering performance',
  'Address lint warnings in workflow engine',
  'Ship new command palette UI',
  'Tune retry policy for external calls',
  'Add log streaming resilience',
  'Upgrade highlight.js syntax sets',
  'Polish settings environment table',
  'Add keyboard shortcuts for task search',
]

const SUMMARIES = [
  'Implements virtualization and chunked syntax highlighting.',
  'Stabilizes SSE reconnect logic and adds coverage tests.',
  'Cleans up repository structure and aligns coding standards.',
  'Introduces optimistic UI for environment creation.',
  'Improves loading skeletons for the task detail view.',
]

const buildMockTasks = (): Task[] => {
  const tasks: Task[] = []
  const now = Date.now()

  for (let index = 0; index < 200; index += 1) {
    const createdAt = new Date(now - index * 1000 * 60 * 37)
    const status = STATUS_POOL[index % STATUS_POOL.length]
    const title = TITLES[index % TITLES.length]
    const repository = REPOSITORIES[index % REPOSITORIES.length]
    const additions = 40 + ((index * 17) % 900)
    const deletions = 10 + ((index * 11) % 700)
    const summary = SUMMARIES[index % SUMMARIES.length]

    tasks.push({
      id: `task-${index + 1}`,
      title,
      repository,
      status,
      additions,
      deletions,
      createdAt: createdAt.toISOString(),
      summary,
    })
  }

  return tasks
}

const MOCK_TASKS = buildMockTasks()

export const fetchTasks = async (): Promise<Task[]> => {
  await new Promise((resolve) => setTimeout(resolve, 250))
  return MOCK_TASKS
}
