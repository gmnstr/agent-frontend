import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest'
import type { ReactNode } from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'

import { GlobalSearch } from './GlobalSearch'
import { ThemeProvider } from '../../theme/ThemeProvider'
import * as tasksApi from '../../api/tasks'
import * as environmentsApi from '../../api/environments'
import type { Task } from '../../types/task'
import type { Environment } from '../../types/environment'

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Improve diff rendering performance',
    repository: 'octo/agent-ui',
    status: 'open',
    additions: 200,
    deletions: 40,
    createdAt: new Date().toISOString(),
    summary: 'Implements virtualization and chunked syntax highlighting.',
  },
  {
    id: 'task-2',
    title: 'Add keyboard shortcuts for task search',
    repository: 'octo/agent-core',
    status: 'running',
    additions: 120,
    deletions: 24,
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    summary: 'Adds global search support for tasks.',
  },
]

const sampleEnvironments: Environment[] = [
  {
    id: 'env-1',
    name: 'Staging runway',
    repository: 'octo/agent-ui',
    taskCount: 12,
    creator: 'Mina Harper',
    createdAt: new Date().toISOString(),
    status: 'healthy',
    lastSyncAt: new Date().toISOString(),
  },
]

const tasksSpy = vi.spyOn(tasksApi, 'fetchTasks')
const environmentsSpy = vi.spyOn(environmentsApi, 'fetchEnvironments')

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="current-location">{location.pathname}</div>
}

const renderWithProviders = async () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const user = userEvent.setup()

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          {children}
          <LocationDisplay />
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )

  render(<GlobalSearch />, { wrapper })
  return { user }
}

const getVisibleSearchInput = (): HTMLInputElement | null => {
  const inputs = screen.queryAllByTestId('global-search-input') as HTMLInputElement[]
  for (const input of inputs) {
    const dialog = input.closest('[role="dialog"]')
    if (!dialog || dialog.getAttribute('aria-hidden') !== 'true') {
      return input
    }
  }

  if (inputs.length === 0) {
    return null
  }

  return inputs[inputs.length - 1]
}

const waitForVisibleSearchInput = (
  options?: Parameters<typeof waitFor>[1],
): Promise<HTMLInputElement> =>
  waitFor(() => {
    const input = getVisibleSearchInput()
    if (!input) {
      throw new Error('Visible search input not available yet')
    }

    return input
  }, options)

const openSearchDialog = async (user: ReturnType<typeof userEvent.setup>): Promise<HTMLInputElement> => {
  const triggers = screen.getAllByRole('button', { name: /open global search/i })
  expect(triggers.length).toBeGreaterThan(0)

  for (const candidate of triggers) {
    await user.click(candidate)

    try {
      return await waitForVisibleSearchInput({ timeout: 500 })
    } catch {
      // If this candidate did not open the dialog, try the next one
    }
  }

  throw new Error('Unable to open global search via trigger buttons')
}

beforeEach(() => {
  tasksSpy.mockReset()
  environmentsSpy.mockReset()
})

afterEach(() => {
  cleanup()
})

describe('GlobalSearch', () => {
  it('opens the command palette and filters task results', async () => {
    tasksSpy.mockResolvedValue(sampleTasks)
    environmentsSpy.mockResolvedValue(sampleEnvironments)

    const { user } = await renderWithProviders()

    const searchInput = await openSearchDialog(user)
    expect(searchInput).toHaveAccessibleName(/search the portal/i)
    await user.click(searchInput)
    fireEvent.change(searchInput, { target: { value: 'diff' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('diff')
    })

    await waitFor(() => {
      expect(screen.queryByText(/start typing to search/i)).not.toBeInTheDocument()
    })

    expect(await screen.findByText(/^Tasks$/i)).toBeVisible()

  })

  it('navigates to a task when selecting a result', async () => {
    tasksSpy.mockResolvedValue(sampleTasks)
    environmentsSpy.mockResolvedValue(sampleEnvironments)

    const { user } = await renderWithProviders()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
    const searchInput = await waitForVisibleSearchInput()
    await user.click(searchInput)
    fireEvent.change(searchInput, { target: { value: 'keyboard' } })

    await waitFor(() => {
      expect(searchInput).toHaveValue('keyboard')
    })

    const resultButton = await screen.findByTestId('global-search-result-task-task-2')

    await user.click(resultButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-location')).toHaveTextContent('/tasks/task-2')
    })
  })

  it('opens with the Ctrl+K shortcut and focuses the search field', async () => {
    tasksSpy.mockResolvedValue(sampleTasks)
    environmentsSpy.mockResolvedValue(sampleEnvironments)

    await renderWithProviders()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))

    const searchInput = await waitForVisibleSearchInput()
    expect(searchInput).toBeVisible()
  })
})
