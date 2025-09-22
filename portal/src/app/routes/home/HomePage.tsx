import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import type { SelectTabData, SelectTabEvent } from '@fluentui/react-components'
import {
  Body1,
  Button,
  Caption1,
  Input,
  Tab,
  TabList,
  TabValue,
  Title1,
  Title3,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { useNavigate } from 'react-router-dom'
import { fetchTasks } from '../../../api/tasks'
import { MainInputComponent } from '../../../components/input/MainInputComponent'
import { TaskListSimplified } from '../../../components/task-list/TaskListSimplified'
import type { Task, TaskStatus } from '../../../types/task'
import { Search24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    paddingBottom: '3rem',
    alignItems: 'center',
  },
  hero: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: '60rem',
  },
  heroTitle: {
    maxWidth: '46rem',
    fontSize: '2.75rem',
    lineHeight: '1.1',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  heroSubtitle: {
    maxWidth: '40rem',
    color: tokens.colorNeutralForeground2,
    fontSize: '1.1rem',
  },
  heroInput: {
    width: '100%',
    maxWidth: '50rem',
  },
  taskManagement: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '60rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tabList: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  tabPanels: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.5rem'),
    boxShadow: tokens.shadow2,
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  searchField: {
    width: '100%',
    maxWidth: '24rem',
  },
  filterRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  resultsMeta: {
    color: tokens.colorNeutralForeground3,
  },
  archivePlaceholder: {
    borderRadius: '0.75rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('2.25rem', '1.5rem'),
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
  },
})

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'open', label: 'Open' },
  { value: 'running', label: 'Running' },
  { value: 'merged', label: 'Merged' },
  { value: 'failed', label: 'Failed' },
  { value: 'archived', label: 'Archived' },
]

export const HomePage = () => {
  const styles = useStyles()
  const navigate = useNavigate()
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 30,
  })

  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState<TabValue>('tasks')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilters, setStatusFilters] = useState<TaskStatus[]>([])

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesStatus = statusFilters.length === 0 || statusFilters.includes(task.status)
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [task.title, task.repository, task.summary ?? ''].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        )

      return matchesStatus && matchesQuery
    })
  }, [searchQuery, statusFilters, tasks])

  const visibleTasks = useMemo(() => filteredTasks.slice(0, 8), [filteredTasks])
  const isFiltering = searchQuery.trim().length > 0 || statusFilters.length > 0
  const emptyStateMessage = isFiltering
    ? 'No tasks match your filters. Adjust your search or clear the filters to see more results.'
    : 'No active tasks yet. Describe a mission above to get started.'

  const handleSubmit = useCallback(
    (action: 'ask' | 'code') => {
      console.info(`Home input submit: ${action}`, inputValue)
    },
    [inputValue],
  )

  const handleTaskClick = useCallback(
    (task: Task) => {
      navigate(`/tasks/${task.id}`)
    },
    [navigate],
  )

  const handleSearchChange = useCallback((_, data: { value: string }) => {
    setSearchQuery(data.value)
    setActiveTab('tasks')
  }, [])

  const handleStatusToggle = useCallback((status: TaskStatus) => {
    setStatusFilters((previous) =>
      previous.includes(status)
        ? previous.filter((item) => item !== status)
        : [...previous, status],
    )
    setActiveTab('tasks')
  }, [])

  const handleClearFilters = useCallback(() => {
    setStatusFilters([])
    setActiveTab('tasks')
  }, [])

  const handleTabSelect = useCallback((_event: SelectTabEvent, data: SelectTabData) => {
    setActiveTab(data.value)
  }, [])

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-hero-heading">
        <Title1 id="home-hero-heading" className={styles.heroTitle}>
          What should we code next?
        </Title1>
        <Body1 className={styles.heroSubtitle}>
          Describe the mission you have in mind and the Codex agent will help you plan, code, and ship it.
        </Body1>
        <div className={styles.heroInput}>
          <MainInputComponent
            placeholder="Describe a task"
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
          />
        </div>
      </section>

      <section className={styles.taskManagement} aria-labelledby="home-task-heading">
        <div className={styles.sectionHeader}>
          <div>
            <Title3 id="home-task-heading">Recent tasks</Title3>
            <Caption1>Keep an eye on the missions the agent is actively shaping.</Caption1>
          </div>
        </div>
        <div className={styles.tabList}>
          <TabList selectedValue={activeTab} onTabSelect={handleTabSelect} aria-label="Task lists">
            <Tab value="tasks">Tasks</Tab>
            <Tab value="archive">Archive</Tab>
          </TabList>
        </div>
        <div className={styles.filters} aria-label="Task search and filters">
          <Input
            className={styles.searchField}
            type="search"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search tasks by title, repository, or summary"
            contentBefore={<Search24Regular aria-hidden />}
            aria-label="Search tasks"
          />
          <div className={styles.filterRow}>
            <Caption1>Filter by status</Caption1>
            <div className={styles.filterButtons} role="group" aria-label="Task status filters">
              {statusOptions.map((option) => {
                const isActive = statusFilters.includes(option.value)
                return (
                  <Button
                    key={option.value}
                    appearance={isActive ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handleStatusToggle(option.value)}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </Button>
                )
              })}
              {statusFilters.length > 0 ? (
                <Button appearance="transparent" size="small" onClick={handleClearFilters}>
                  Clear filters
                </Button>
              ) : null}
            </div>
          </div>
          <Caption1 className={styles.resultsMeta} role="status" aria-live="polite">
            Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
          </Caption1>
        </div>
        <div className={styles.tabPanels}>
          {activeTab === 'tasks' ? (
            <TaskListSimplified
              tasks={visibleTasks}
              isLoading={isLoading}
              onTaskClick={handleTaskClick}
              emptyStateMessage={emptyStateMessage}
              highlightQuery={searchQuery}
            />
          ) : (
            <div className={styles.archivePlaceholder} role="status" aria-live="polite">
              Archived work will appear here once tasks have been marked complete.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
