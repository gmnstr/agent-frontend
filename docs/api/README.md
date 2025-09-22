# API Documentation

## Overview

The Agent Frontend currently uses mock APIs for development and testing. All API interactions are managed through React Query for optimal caching and state management.

## Current Implementation

### Mock APIs
Located in `portal/src/api/`, all APIs currently return mock data:

- **`tasks.ts`** - Task management operations
- **`environments.ts`** - Environment configuration management

### Real-time Features
- Task status updates simulated via `useTaskEventStream` hook
- WebSocket connections will replace interval-based polling in production

## API Structure

### Base Configuration
```typescript
// Future: Centralized API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'https://api.example.com'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})
```

### Error Handling
```typescript
// Standardized error response format
interface ApiError {
  message: string
  code: string
  details?: Record<string, unknown>
}

// React Query error handling
const { data, error, isLoading } = useQuery({
  queryKey: ['resource'],
  queryFn: fetchResource,
  onError: (error: ApiError) => {
    console.error('API Error:', error.message)
    // Handle error appropriately
  },
})
```

## Task API

### Data Models

#### Task
```typescript
interface Task {
  id: string
  title: string
  summary: string | null
  status: TaskStatus
  repository: string
  createdAt: string
  updatedAt: string
  assignee: string | null
  labels: string[]
  priority: 'low' | 'medium' | 'high'
  estimatedHours: number | null
  actualHours: number | null
}

type TaskStatus = 'open' | 'running' | 'merged' | 'failed' | 'archived'
```

### Endpoints

#### GET /api/tasks
Fetch all tasks with optional filtering and pagination.

**Query Parameters:**
- `status` - Filter by task status
- `repository` - Filter by repository
- `assignee` - Filter by assignee
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (default: 'createdAt')
- `order` - Sort order: 'asc' | 'desc' (default: 'desc')

**Response:**
```typescript
interface TasksResponse {
  tasks: Task[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
```

**Current Mock Implementation:**
```typescript
export const fetchTasks = async (): Promise<Task[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  return mockTasks
}
```

#### GET /api/tasks/:id
Fetch a specific task by ID.

**Response:**
```typescript
interface TaskResponse {
  task: Task
  history: TaskHistoryEntry[]
  files: TaskFile[]
}
```

#### POST /api/tasks
Create a new task.

**Request Body:**
```typescript
interface CreateTaskRequest {
  title: string
  summary?: string
  repository: string
  assignee?: string
  labels?: string[]
  priority?: 'low' | 'medium' | 'high'
  estimatedHours?: number
}
```

#### PUT /api/tasks/:id
Update an existing task.

**Request Body:**
```typescript
interface UpdateTaskRequest {
  title?: string
  summary?: string
  status?: TaskStatus
  assignee?: string
  labels?: string[]
  priority?: 'low' | 'medium' | 'high'
  estimatedHours?: number
  actualHours?: number
}
```

#### DELETE /api/tasks/:id
Delete a task (soft delete to 'archived' status).

### Real-time Events

#### WebSocket: /ws/tasks
Subscribe to real-time task updates.

**Event Types:**
```typescript
interface TaskEvent {
  type: 'task_created' | 'task_updated' | 'task_deleted' | 'status_changed'
  taskId: string
  task: Task
  timestamp: string
  userId: string
}
```

**Current Mock Implementation:**
```typescript
export const useTaskEventStream = () => {
  const [events, setEvents] = useState<TaskEvent[]>([])

  useEffect(() => {
    // Simulate real-time events
    const interval = setInterval(() => {
      const mockEvent = generateMockTaskEvent()
      setEvents(prev => [...prev, mockEvent].slice(-50))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return { events }
}
```

## Environment API

### Data Models

#### Environment
```typescript
interface Environment {
  id: string
  name: string
  repository: string
  status: EnvironmentStatus
  creator: string
  createdAt: string
  lastSyncAt: string
  taskCount: number
  configuration: EnvironmentConfig
}

type EnvironmentStatus = 'healthy' | 'degraded' | 'offline'

interface EnvironmentConfig {
  nodeVersion: string
  packageManager: 'npm' | 'yarn' | 'pnpm'
  buildCommand: string
  testCommand: string
  environmentVariables: Record<string, string>
}
```

### Endpoints

#### GET /api/environments
Fetch all environments.

**Query Parameters:**
- `status` - Filter by environment status
- `repository` - Filter by repository
- `creator` - Filter by creator

**Response:**
```typescript
interface EnvironmentsResponse {
  environments: Environment[]
  total: number
}
```

#### GET /api/environments/:id
Fetch specific environment details.

#### POST /api/environments
Create a new environment.

**Request Body:**
```typescript
interface CreateEnvironmentRequest {
  name: string
  repository: string
  configuration: EnvironmentConfig
}
```

#### PUT /api/environments/:id
Update environment configuration.

#### DELETE /api/environments/:id
Delete an environment.

#### GET /api/environments/:id/logs
Fetch environment logs.

**Query Parameters:**
- `since` - Timestamp to fetch logs from
- `level` - Log level filter: 'debug' | 'info' | 'warn' | 'error'
- `limit` - Number of log entries (default: 100)

## React Query Integration

### Query Keys
Consistent query key structure for caching:

```typescript
// Query key factories
const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: TaskFilters) => [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
}

const environmentKeys = {
  all: ['environments'] as const,
  lists: () => [...environmentKeys.all, 'list'] as const,
  list: (filters: EnvironmentFilters) => [...environmentKeys.lists(), { filters }] as const,
  details: () => [...environmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...environmentKeys.details(), id] as const,
}
```

### Custom Hooks
Reusable hooks for API operations:

```typescript
// Task hooks
export const useTasks = (filters: TaskFilters = {}) => {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => fetchTasks(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export const useTask = (id: string) => {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchTask(id),
    enabled: !!id,
  })
}

export const useCreateTask = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}

// Environment hooks
export const useEnvironments = () => {
  return useQuery({
    queryKey: environmentKeys.all,
    queryFn: fetchEnvironments,
    staleTime: 1000 * 60 * 10, // 10 minutes
  })
}
```

### Optimistic Updates
For better UX, implement optimistic updates:

```typescript
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateTaskStatus,
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) })

      // Snapshot previous value
      const previousTask = queryClient.getQueryData(taskKeys.detail(id))

      // Optimistically update
      queryClient.setQueryData(taskKeys.detail(id), (old: Task) => ({
        ...old,
        status,
        updatedAt: new Date().toISOString(),
      }))

      return { previousTask }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTask) {
        queryClient.setQueryData(taskKeys.detail(variables.id), context.previousTask)
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) })
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() })
    },
  })
}
```

## Authentication (Future)

### JWT Token Management
```typescript
interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Token storage and refresh logic
const useAuthToken = () => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null)

  const refreshToken = useCallback(async () => {
    // Refresh token logic
  }, [])

  const logout = useCallback(() => {
    setTokens(null)
    queryClient.clear()
  }, [])

  return { tokens, refreshToken, logout }
}
```

### API Client with Auth
```typescript
const authenticatedApiClient = axios.create({
  baseURL: API_BASE_URL,
})

authenticatedApiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

authenticatedApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      await refreshAccessToken()
      return authenticatedApiClient.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

## Migration from Mock to Real APIs

### Step 1: Environment Configuration
- Add environment variables for API URLs
- Configure different URLs for development/staging/production

### Step 2: Replace Mock Functions
- Update API functions to use real HTTP clients
- Maintain same interface for seamless transition

### Step 3: Error Handling
- Implement proper error handling for network failures
- Add retry logic for transient errors

### Step 4: Authentication
- Add authentication token management
- Implement login/logout flows

### Step 5: Real-time Features
- Replace interval-based polling with WebSocket connections
- Implement connection retry and error handling

### Step 6: Testing
- Update tests to mock HTTP requests instead of return values
- Add integration tests with real API calls