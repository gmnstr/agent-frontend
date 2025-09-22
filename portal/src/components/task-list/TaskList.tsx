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
    gap: '0.75rem',
  },
  gridWrapper: {
    flex: 1,
    minHeight: 0,
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    overflow: 'hidden',
    position: 'relative',
  },
  grid: {
    height: '100%',
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
  },
  additions: {
    color: tokens.colorPaletteLightGreenForeground1,
  },
  deletions: {
    color: tokens.colorPaletteRedForeground1,
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

  const liveRegionMessage = tasks.length
    ? `Showing ${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} with +${totals.additions} additions and −${totals.deletions} deletions.`
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
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <VirtualizedDataGridBody<Task> itemSize={64} aria-live="polite">
                {({ item, rowId }, style) => {
                  const rowStyle: CSSProperties = style ?? {}

                  return (
                    <DataGridRow
                      key={rowId}
                      style={rowStyle}
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
                <DataGridRow>
                  {({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}
                </DataGridRow>
              </DataGridHeader>
              <DataGridBody<Task> aria-live="polite">
                {({ item, rowId }) => (
                  <DataGridRow
                    key={rowId}
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
