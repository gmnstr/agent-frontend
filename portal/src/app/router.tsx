import { Navigate, createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './routes/RootLayout'
import { RouteErrorBoundary } from './routes/RouteErrorBoundary'
import { TaskListPage } from './routes/tasks/TaskListPage'
import { TaskDetailPlaceholder } from './routes/tasks/TaskDetailPlaceholder'
import { EnvironmentsPlaceholder } from './routes/settings/EnvironmentsPlaceholder'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <Navigate to="/tasks" replace />,
      },
      {
        path: 'tasks',
        element: <TaskListPage />,
      },
      {
        path: 'tasks/:taskId',
        element: <TaskDetailPlaceholder />,
      },
      {
        path: 'settings',
        element: <Navigate to="/settings/environments" replace />,
      },
      {
        path: 'settings/environments',
        element: <EnvironmentsPlaceholder />,
      },
    ],
  },
])
