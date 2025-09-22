import '../../polyfills/nodeFilter'
import {
  Avatar,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridRow,
  Spinner,
  TableCellLayout,
  Text,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import type { DataGridBodyProps, DataGridProps } from '@fluentui/react-components'
import { VirtualizerScrollViewDynamic } from '@fluentui/react-components/unstable'
import { useMemo } from 'react'
import type { CSSProperties, KeyboardEvent, ReactNode } from 'react'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import type { Task } from '../../types/task'
import { TaskStatusPill } from './TaskStatusPill'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const shouldVirtualize =
  typeof window !== 'undefined' && !window.navigator.userAgent.toLowerCase().includes('jsdom')

const useStyles = makeStyles({
  container: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  summaryCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(12rem, 1fr))',
    gap: '1rem',
    ...shorthands.padding('1.25rem', '1.5rem'),
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow2,
  },
  summaryStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  summaryLabel: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.colorNeutralForeground3,
  },
  summaryValue: {
    fontSize: '1.75rem',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  summaryDiff: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontSize: '0.875rem',
    color: tokens.colorNeutralForeground2,
    fontFamily: tokens.fontFamilyMonospace,
  },
  statusGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.45rem',
    ...shorthands.padding('0.35rem', '0.6rem'),
    borderRadius: '999px',
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground2,
    fontSize: '0.75rem',
    fontWeight: 500,
  },
  statusDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: tokens.borderRadiusCircular,
  },
  gridWrapper: {
    flex: 1,
    minHeight: 0,
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    overflow: 'hidden',
    position: 'relative',
    boxShadow: tokens.shadow4,
  },
  grid: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  headerRow: {
    backgroundColor: tokens.colorNeutralBackground3,
  },
  headerCell: {
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    fontSize: '0.75rem',
  },
  row: {
    cursor: 'pointer',
    transitionProperty: 'background-color, transform',
    transitionDuration: '120ms',
    '&:hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
    '&:focus-within': {
      outline: `2px solid ${tokens.colorBrandBackground}`,
      outlineOffset: '-2px',
    },
  },
  liveRegion: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    border: 0,
    whiteSpace: 'nowrap',
    clipPath: 'inset(50%)',
    overflow: 'hidden',
  },
  loadingState: {
    position: 'absolute',
    inset: 0,
    display: 'grid',
    placeItems: 'center',
    backgroundColor: tokens.colorTransparentBackground,
    backdropFilter: 'blur(6px)',
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('4rem', '1rem'),
    color: tokens.colorNeutralForeground3,
  },
  changeCell: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.25rem',
  },
  changeVisual: {
    display: 'inline-flex',
    alignItems: 'baseline',
    gap: '0.25rem',
    fontFamily: tokens.fontFamilyMonospace,
  },
  additions: {
    color: '#3FB950',
  },
  deletions: {
    color: '#F85149',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    margin: '-1px',
    padding: 0,
    border: 0,
    whiteSpace: 'nowrap',
    clipPath: 'inset(50%)',
    overflow: 'hidden',
  },
})

type SortState = NonNullable<DataGridProps['sortState']>

type RowRenderFunction<TItem> = NonNullable<DataGridBodyProps<TItem>['children']>

type VirtualizedRowRenderFunction<TItem> = (
  row: Parameters<RowRenderFunction<TItem>>[0],
  style: CSSProperties | undefined,
) => ReturnType<RowRenderFunction<TItem>>

type VirtualizedDataGridBodyProps<TItem> = Omit<DataGridBodyProps<TItem>, 'children'> & {
  itemSize: number
  children: VirtualizedRowRenderFunction<TItem>
}

const VirtualizedDataGridBody = DataGridBody as <TItem>(
  props: VirtualizedDataGridBodyProps<TItem>,
) => JSX.Element

type VirtualizedScrollViewProps = {
  children: ReactNode
  style?: CSSProperties
}

const VirtualizedScrollView = VirtualizerScrollViewDynamic as unknown as (
  props: VirtualizedScrollViewProps,
) => JSX.Element

type TaskListProps = {
  tasks: Task[]
  sortState: SortState
  onSortChange: (state: SortState) => void
  onOpenTask: (task: Task) => void
  isLoading?: boolean
  isError?: boolean
}

const statusOrder: Record<Task['status'], number> = {
  open: 0,
  running: 1,
  merged: 2,
  failed: 3,
  archived: 4,
}

const statusAccent: Record<Task['status'], string> = {
  open: '#3FB950',
  running: '#D29922',
  merged: '#BC8CFF',
  failed: '#F85149',
  archived: '#6E7681',
}

const statusLabelMap: Record<Task['status'], string> = {
  open: 'Open',
  running: 'Running',
  merged: 'Merged',
  failed: 'Failed',
  archived: 'Archived',
}

export const TaskList = ({
  tasks,
  sortState,
  onSortChange,
  onOpenTask,
  isLoading,
  isError,
}: TaskListProps) => {
  const styles = useStyles()
  const prefersReducedMotion = usePrefersReducedMotion()

  const totals = useMemo(() => {
    let additions = 0
    let deletions = 0

    for (const task of tasks) {
      additions += task.additions
      deletions += task.deletions
    }

    return { additions, deletions }
  }, [tasks])

  const statusCounts = useMemo(() => {
    const counts: Record<Task['status'], number> = {
      open: 0,
      running: 0,
      merged: 0,
      failed: 0,
      archived: 0,
    }

    for (const task of tasks) {
      counts[task.status] += 1
    }

    return counts
  }, [tasks])

  const activeStatuses = useMemo(
    () => (Object.keys(statusCounts) as Task['status'][]).filter((statusKey) => statusCounts[statusKey] > 0),
    [statusCounts],
  )

  const liveRegionMessage = tasks.length
    ? `Showing ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} with +${totals.additions} additions and -${totals.deletions} deletions.`
    : 'No tasks to display.'

  const columns = useMemo(
    () => [
      createTableColumn<Task>({
        columnId: 'title',
        compare: (a, b) => a.title.localeCompare(b.title),
        renderHeaderCell: () => 'Title',
        renderCell: (item) => (
          <TableCellLayout media={<Avatar name={item.title} color="colorful" />} truncate>
            <Text weight="semibold">{item.title}</Text>
            {item.summary && (
              <Text role="note" size={200} wrap>
                {item.summary}
              </Text>
            )}
          </TableCellLayout>
        ),
      }),
      createTableColumn<Task>({
        columnId: 'repository',
        compare: (a, b) => a.repository.localeCompare(b.repository),
        renderHeaderCell: () => 'Repository',
        renderCell: (item) => <Text>{item.repository}</Text>,
      }),
      createTableColumn<Task>({
        columnId: 'status',
        compare: (a, b) => statusOrder[a.status] - statusOrder[b.status],
        renderHeaderCell: () => 'Status',
        renderCell: (item) => <TaskStatusPill status={item.status} />, 
      }),
      createTableColumn<Task>({
        columnId: 'changes',
        compare: (a, b) => a.additions - a.deletions - (b.additions - b.deletions),
        renderHeaderCell: () => '+/-',
        renderCell: (item) => (
          <span className={styles.changeCell}>
            <span aria-hidden="true" className={styles.changeVisual}>
              <Text weight="semibold" as="span" className={styles.additions}>
                +{item.additions}
              </Text>
              <Text weight="semibold" as="span" className={styles.deletions}>
                −{item.deletions}
              </Text>
            </span>
            <span className={styles.srOnly}>{`+${item.additions} additions, -${item.deletions} deletions`}</span>
          </span>
        ),
      }),
      createTableColumn<Task>({
        columnId: 'createdAt',
        compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        renderHeaderCell: () => 'Created',
        renderCell: (item) => <Text>{formatRelativeTime(item.createdAt)}</Text>,
      }),
    ],
    [styles],
  )

  return (
    <section className={styles.container} aria-label="Tasks list" role="region">
      <div className={styles.summaryCard} role="status" aria-live="polite">
        <div className={styles.summaryStat}>
          <span className={styles.summaryLabel}>Active tasks</span>
          <span className={styles.summaryValue}>{tasks.length}</span>
          <span className={styles.summaryDiff}>
            <span className={styles.additions}>+{totals.additions}</span>
            <span className={styles.deletions}>-{totals.deletions}</span>
          </span>
        </div>
        <div className={styles.summaryStat}>
          <span className={styles.summaryLabel}>Status mix</span>
          <div className={styles.statusGroup}>
            {activeStatuses.length > 0 ? (
              activeStatuses.map((statusKey) => (
                <span key={statusKey} className={styles.statusPill}>
                  <span
                    className={styles.statusDot}
                    style={{ backgroundColor: statusAccent[statusKey] }}
                    aria-hidden="true"
                  />
                  {statusLabelMap[statusKey]} • {statusCounts[statusKey]}
                </span>
              ))
            ) : (
              <span>No activity yet</span>
            )}
          </div>
        </div>
      </div>
      <div className={styles.gridWrapper}>
        <div
          className={styles.liveRegion}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {liveRegionMessage}
        </div>
        <DataGrid
          className={styles.grid}
          items={tasks}
          columns={columns}
          sortable
          sortState={sortState}
          onSortChange={(_, next) => onSortChange(next)}
          getRowId={(item) => item.id}
          selectionMode="single"
          focusMode="row_unstable"
        >
          {shouldVirtualize ? (
            <VirtualizedScrollView style={{ height: '100%' }}>
              <DataGridHeader>
                <DataGridRow className={styles.headerRow}>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell className={styles.headerCell}>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <VirtualizedDataGridBody<Task> itemSize={64} aria-live="polite">
                {({ item, rowId }, style) => {
                  const rowStyle: CSSProperties = style ?? {}

                  return (
                    <DataGridRow
                      key={rowId}
                      style={rowStyle}
                      className={styles.row}
                      onDoubleClick={() => onOpenTask(item)}
                      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          onOpenTask(item)
                        }
                      }}
                    >
                      {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                  )
                }}
              </VirtualizedDataGridBody>
            </VirtualizedScrollView>
          ) : (
            <>
              <DataGridHeader>
                <DataGridRow className={styles.headerRow}>
                  {({ renderHeaderCell }) => (
                    <DataGridHeaderCell className={styles.headerCell}>{renderHeaderCell()}</DataGridHeaderCell>
                  )}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Task> aria-live="polite">
                {({ item, rowId }) => (
                  <DataGridRow
                    key={rowId}
                    className={styles.row}
                    onDoubleClick={() => onOpenTask(item)}
                    onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        onOpenTask(item)
                      }
                    }}
                  >
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </>
          )}
        </DataGrid>
        {isLoading && (
          <div className={styles.loadingState} role="status" aria-live="polite" aria-busy="true">
            {prefersReducedMotion ? (
              <Text weight="semibold">Loading tasks…</Text>
            ) : (
              <Spinner label="Loading tasks" />
            )}
          </div>
        )}
        {!isLoading && tasks.length === 0 && (
          <div className={styles.emptyState} role="status">
            <Text weight="semibold">No tasks match your search.</Text>
            <Text size={200}>Try a different query or clear filters.</Text>
          </div>
        )}
      </div>
      {isError && (
        <Text role="alert" color={tokens.colorPaletteRedForeground1}>
          Unable to load tasks. Please try again.
        </Text>
      )}
    </section>
  )
}
