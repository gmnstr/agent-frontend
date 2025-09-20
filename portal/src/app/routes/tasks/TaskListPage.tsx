import { useQuery } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { fetchTasks } from '../../../api/tasks'
import { TaskList } from '../../../components/task-list/TaskList'
import { TaskListToolbar } from '../../../components/task-list/TaskListToolbar'
import type { RootOutletContext } from '../RootLayout'
import { useHotkey } from '../../../hooks/useHotkey'
import { defaultSortState, filterTasks, sortTasks } from './taskListUtils'
import type { TaskListSortState } from './taskListUtils'

export const TaskListPage = () => {
  const { setToolbar } = useOutletContext<RootOutletContext>()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const [searchValue, setSearchValue] = useState('')
  const [sortState, setSortState] = useState<TaskListSortState>(defaultSortState)

  const { data: tasks = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 30,
  })

  const filteredTasks = useMemo(() => {
    const filtered = filterTasks(tasks, searchValue)
    return sortTasks(filtered, sortState)
  }, [tasks, searchValue, sortState])

  const handleRefresh = useCallback(() => {
    void refetch()
  }, [refetch])

  const handleCreateTask = useCallback(() => {
    // Placeholder action for Phase 1 – surfaces future intent without blocking tests.
    console.info('Task creation flow is coming soon.')
  }, [])

  const toolbar = useMemo(
    () => (
      <TaskListToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onRefresh={handleRefresh}
        onCreateTask={handleCreateTask}
        searchInputRef={searchInputRef}
      />
    ),
    [searchValue, handleRefresh, handleCreateTask],
  )

  useEffect(() => {
    setToolbar(toolbar)
    return () => setToolbar(null)
  }, [setToolbar, toolbar])

  useHotkey('/', (event) => {
    event.preventDefault()
    const input = searchInputRef.current
    if (input) {
      input.focus()
      input.select()
    }
  })

  return (
    <TaskList
      tasks={filteredTasks}
      sortState={sortState}
      onSortChange={setSortState}
      onOpenTask={(task) => navigate(`/tasks/${task.id}`)}
      isLoading={isLoading}
      isError={isError}
    />
  )
}
