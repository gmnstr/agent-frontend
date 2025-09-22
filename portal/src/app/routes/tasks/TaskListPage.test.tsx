import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TaskList } from '../../../components/task-list/TaskList'
import { TaskListToolbar } from '../../../components/task-list/TaskListToolbar'
import { ThemeProvider } from '../../../theme/ThemeProvider'
import { filterTasks, sortTasks } from './taskListUtils'
import { useHotkey } from '../../../hooks/useHotkey'
import type { Task } from '../../../types/task'
import type { TaskListSortState } from './taskListUtils'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { TaskDetailPlaceholder } from './TaskDetailPlaceholder'
import * as telemetry from '../../../lib/telemetry'

const sampleTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Improve diff rendering performance',
    repository: 'octo/agent-ui',
    status: 'open',
    additions: 200,
    deletions: 40,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Add keyboard shortcuts for task search',
    repository: 'octo/agent-ui',
    status: 'running',
    additions: 80,
    deletions: 10,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
]

const renderWithinTheme = (ui: ReactNode) => {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('filterTasks', () => {
  it('matches title, repository and status', () => {
    const result = filterTasks(sampleTasks, 'keyboard')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('task-2')

    const repoResult = filterTasks(sampleTasks, 'agent-ui')
    expect(repoResult).toHaveLength(2)

    const statusResult = filterTasks(sampleTasks, 'open')
    expect(statusResult).toHaveLength(1)
    expect(statusResult[0].id).toBe('task-1')
  })
})

describe('sortTasks', () => {
  it('sorts by createdAt descending by default', () => {
    const sortState: TaskListSortState = { sortColumn: 'createdAt', sortDirection: 'descending' }
    const result = sortTasks(sampleTasks, sortState)
    expect(result[0].id).toBe('task-1')
  })

  it('sorts by status weight', () => {
    const sortState: TaskListSortState = { sortColumn: 'status', sortDirection: 'ascending' }
    const result = sortTasks(sampleTasks, sortState)
    expect(result[0].status).toBe('open')
  })
})

describe('TaskList interactions', () => {
  it('invokes onOpenTask when pressing Enter on a row', async () => {
    const handleOpen = vi.fn()
    const sortState: TaskListSortState = { sortColumn: 'createdAt', sortDirection: 'descending' }

    renderWithinTheme(
      <TaskList
        tasks={sampleTasks}
        sortState={sortState}
        onSortChange={() => undefined}
        onOpenTask={handleOpen}
        isLoading={false}
      />,
    )

    const firstRow = await screen.findByText('Improve diff rendering performance')
    const row = firstRow.closest('[role="row"]') as HTMLElement

    row.focus()
    fireEvent.keyDown(row, { key: 'Enter', code: 'Enter' })

    expect(handleOpen).toHaveBeenCalledWith(sampleTasks[0])
  })

  it('announces total change counts via live region', () => {
    const sortState: TaskListSortState = { sortColumn: 'createdAt', sortDirection: 'descending' }

    renderWithinTheme(
      <TaskList
        tasks={sampleTasks}
        sortState={sortState}
        onSortChange={() => undefined}
        onOpenTask={() => undefined}
        isLoading={false}
      />,
    )

    const liveRegion = screen
      .getAllByRole('status', { hidden: true })
      .find((element) => element.textContent?.includes('Showing 2 tasks with +280 additions'))

    if (!liveRegion) {
      throw new Error('Live region not found')
    }

    expect(liveRegion.getAttribute('aria-live')).toBe('polite')

    const srTextNodes = screen.getAllByText('+200 additions, -40 deletions')
    expect(srTextNodes.length).toBeGreaterThan(0)
  })
})

describe('TaskListToolbar', () => {
  it('calls onSearchChange when typing', async () => {
    const handleSearchChange = vi.fn()
    const handleRefresh = vi.fn()
    const handleCreate = vi.fn()

    renderWithinTheme(
      <TaskListToolbar
        searchValue=""
        onSearchChange={handleSearchChange}
        onRefresh={handleRefresh}
        onCreateTask={handleCreate}
        searchInputRef={{ current: null }}
      />,
    )

    const searchInput = screen.getByRole('searchbox', { name: /search tasks/i })
    await userEvent.type(searchInput, 'diff')

    expect(handleSearchChange).toHaveBeenCalled()
  })
})

describe('useHotkey', () => {
  it('fires handler when the key is pressed', async () => {
    const handler = vi.fn()

    const HotkeyComponent = () => {
      useHotkey('/', handler)
      return <div>hotkey</div>
    }

    renderWithinTheme(<HotkeyComponent />)

    fireEvent.keyDown(window, { key: '/', code: 'Slash' })

    expect(handler).toHaveBeenCalled()
  })
})

describe('TaskDetailPlaceholder instrumentation', () => {
  it('tracks tab changes and PR clicks', async () => {
    const telemetrySpy = vi.spyOn(telemetry, 'trackEvent')
    const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    renderWithinTheme(
      <MemoryRouter initialEntries={['/tasks/task-123']}>
        <Routes>
          <Route path="/tasks/:taskId" element={<TaskDetailPlaceholder />} />
        </Routes>
      </MemoryRouter>,
    )

    const logsTab = await screen.findByRole('tab', { name: 'Logs' })
    await userEvent.click(logsTab)

    const viewPrButton = screen.getByRole('button', { name: /view pull request/i })
    await userEvent.click(viewPrButton)

    expect(telemetrySpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'tab_changed', tab: 'logs', taskId: 'task-123' }),
    )
    expect(telemetrySpy).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'pr_clicked', taskId: 'task-123' }),
    )

    telemetrySpy.mockRestore()
    consoleSpy.mockRestore()
  })
})
