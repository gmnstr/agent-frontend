import {
  Button,
  Caption1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridProps,
  DataGridRow,
  Input,
  Menu,
  MenuItem,
  MenuList,
  MenuPopover,
  MenuTrigger,
  Spinner,
  Text,
  createTableColumn,
  makeStyles,
  shorthands,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { MoreHorizontal24Regular, Search24Regular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { formatRelativeTime } from '../../lib/formatRelativeTime'
import type { Environment, EnvironmentStatus } from '../../types/environment'

const statusLabel: Record<EnvironmentStatus, string> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  offline: 'Offline',
}

const statusTone: Record<EnvironmentStatus, { background: string; dot: string }> = {
  healthy: { background: 'rgba(63, 185, 80, 0.12)', dot: '#3FB950' },
  degraded: { background: 'rgba(240, 136, 62, 0.12)', dot: '#F0883E' },
  offline: { background: 'rgba(248, 81, 73, 0.14)', dot: '#F85149' },
}

type SortState = NonNullable<DataGridProps['sortState']>

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  searchField: {
    width: '20rem',
    maxWidth: '100%',
  },
  summary: {
    color: tokens.colorNeutralForeground3,
  },
  gridWrapper: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    boxShadow: tokens.shadow4,
    overflow: 'hidden',
  },
  headerRow: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
  row: {
    transitionProperty: 'background-color, transform',
    transitionDuration: '120ms',
    selectors: {
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground3,
      },
      '&:focus-within': {
        outline: `2px solid ${tokens.colorBrandStroke1}`,
        outlineOffset: '-2px',
      },
    },
  },
  nameCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  nameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: '999px',
    ...shorthands.padding('0.2rem', '0.65rem'),
  },
  statusDot: {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
  },
  tasksCell: {
    fontFamily: tokens.fontFamilyMonospace,
  },
  actionsCell: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  emptyState: {
    ...shorthands.padding('3rem', '1.5rem'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  liveRegion: {
    position: 'absolute',
    width: 1,
    height: 1,
    margin: -1,
    border: 0,
    padding: 0,
    clip: 'rect(0 0 0 0)',
    overflow: 'hidden',
  },
  content: {
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    insetBlockStart: '50%',
    insetInlineStart: '50%',
    transform: 'translate(-50%, -50%)',
  },
})

type EnvironmentTableProps = {
  environments: Environment[]
  isLoading?: boolean
}

export const EnvironmentTable = ({ environments, isLoading = false }: EnvironmentTableProps) => {
  const styles = useStyles()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortState, setSortState] = useState<SortState>({ sortColumn: 'name', sortDirection: 'ascending' })

  const filteredEnvironments = useMemo(() => {
    if (!searchQuery) {
      return environments
    }

    const normalized = searchQuery.trim().toLowerCase()
    if (!normalized) {
      return environments
    }

    return environments.filter((environment) => {
      return (
        environment.name.toLowerCase().includes(normalized) ||
        environment.repository.toLowerCase().includes(normalized) ||
        environment.creator.toLowerCase().includes(normalized)
      )
    })
  }, [environments, searchQuery])

  const sortedEnvironments = useMemo(() => {
    if (!sortState?.sortColumn) {
      return filteredEnvironments
    }

    const sorted = [...filteredEnvironments]
    const direction = sortState.sortDirection === 'ascending' ? 1 : -1

    sorted.sort((a, b) => {
      const { sortColumn } = sortState

      switch (sortColumn) {
        case 'name':
          return a.name.localeCompare(b.name) * direction
        case 'repository':
          return a.repository.localeCompare(b.repository) * direction
        case 'taskCount':
          return (a.taskCount - b.taskCount) * direction
        case 'createdAt': {
          const aTime = new Date(a.createdAt).getTime()
          const bTime = new Date(b.createdAt).getTime()
          return (aTime - bTime) * direction
        }
        default:
          return 0
      }
    })

    return sorted
  }, [filteredEnvironments, sortState])

  const columns = useMemo<TableColumnDefinition<Environment>[]>(
    () => [
      createTableColumn<Environment>({
        columnId: 'name',
        compare: (a, b) => a.name.localeCompare(b.name),
        renderHeaderCell: () => 'Name',
        renderCell: (item) => {
          const tone = statusTone[item.status]

          return (
            <div className={styles.nameCell}>
              <div className={styles.nameRow}>
                <Text weight="semibold">{item.name}</Text>
                <span
                  className={styles.statusBadge}
                  style={{ backgroundColor: tone.background, color: tone.dot }}
                >
                  <span className={styles.statusDot} style={{ backgroundColor: tone.dot }} aria-hidden />
                  {statusLabel[item.status]}
                </span>
              </div>
              <Caption1 as="p">Last sync {formatRelativeTime(item.lastSyncAt)}</Caption1>
            </div>
          )
        },
      }),
      createTableColumn<Environment>({
        columnId: 'repository',
        compare: (a, b) => a.repository.localeCompare(b.repository),
        renderHeaderCell: () => 'Repository',
        renderCell: (item) => <Text>{item.repository}</Text>,
      }),
      createTableColumn<Environment>({
        columnId: 'taskCount',
        compare: (a, b) => a.taskCount - b.taskCount,
        renderHeaderCell: () => 'Active tasks',
        renderCell: (item) => <Text className={styles.tasksCell}>{item.taskCount}</Text>,
      }),
      createTableColumn<Environment>({
        columnId: 'creator',
        compare: (a, b) => a.creator.localeCompare(b.creator),
        renderHeaderCell: () => 'Owner',
        renderCell: (item) => <Text>{item.creator}</Text>,
      }),
      createTableColumn<Environment>({
        columnId: 'createdAt',
        compare: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        renderHeaderCell: () => 'Created',
        renderCell: (item) => <Text>{formatRelativeTime(item.createdAt)}</Text>,
      }),
      createTableColumn<Environment>({
        columnId: 'actions',
        renderHeaderCell: () => <span className="sr-only">Actions</span>,
        renderCell: (item) => (
          <div className={styles.actionsCell}>
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="transparent"
                  icon={<MoreHorizontal24Regular />}
                  aria-label={`Open actions for ${item.name}`}
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem onClick={() => console.info(`Edit environment ${item.id}`)}>Edit</MenuItem>
                  <MenuItem onClick={() => console.info(`View logs for ${item.id}`)}>View logs</MenuItem>
                  <MenuItem onClick={() => console.info(`Archive environment ${item.id}`)}>Archive</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        ),
      }),
    ],
    [styles.actionsCell, styles.nameCell, styles.nameRow, styles.statusBadge, styles.statusDot, styles.tasksCell],
  )

  const summaryText = useMemo(() => {
    if (searchQuery) {
      return `${sortedEnvironments.length} environment${sortedEnvironments.length === 1 ? '' : 's'} match "${searchQuery}"`
    }
    return `${sortedEnvironments.length} connected environment${sortedEnvironments.length === 1 ? '' : 's'}`
  }, [searchQuery, sortedEnvironments.length])

  return (
    <section className={styles.root} aria-label="Environment inventory">
      <header className={styles.header}>
        <Input
          className={styles.searchField}
          type="search"
          placeholder="Search by name, repo, or owner"
          value={searchQuery}
          onChange={(_, data) => setSearchQuery(data.value)}
          contentBefore={<Search24Regular aria-hidden />}
          aria-label="Search environments"
        />
        <div>
          <Caption1 className={styles.summary}>{summaryText}</Caption1>
        </div>
      </header>
      <div className={styles.content}>
        <div className={styles.liveRegion} role="status" aria-live="polite">
          {isLoading ? 'Loading environments' : summaryText}
        </div>
        <div className={styles.gridWrapper}>
          <DataGrid
            items={sortedEnvironments}
            columns={columns}
            sortable
            sortState={sortState}
            onSortChange={(_, next) => setSortState(next)}
            focusMode="cell"
            getRowId={(item) => item.id}
          >
            <DataGridHeader>
              <DataGridRow className={styles.headerRow}>
                {({ renderHeaderCell }) => (
                  <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                )}
              </DataGridRow>
            </DataGridHeader>
            <DataGridBody<Environment>>
              {({ item }) => (
                <DataGridRow key={item.id} className={styles.row}>
                  {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                </DataGridRow>
              )}
            </DataGridBody>
          </DataGrid>
          {!isLoading && sortedEnvironments.length === 0 ? (
            <div className={styles.emptyState} role="status" aria-live="polite">
              No environments match your filters yet.
            </div>
          ) : null}
          {isLoading ? <Spinner className={styles.spinner} size="large" /> : null}
        </div>
      </div>
    </section>
  )
}
