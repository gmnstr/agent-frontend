import '../../polyfills/nodeFilter'
import type { ChangeEvent, MutableRefObject } from 'react'
import { Button, Input, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import type { InputOnChangeData } from '@fluentui/react-components'
import { Add24Regular, ArrowClockwise24Regular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    ...shorthands.padding('0.9rem', '1rem'),
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow2,
  },
  input: {
    flex: 1,
    minWidth: 0,
  },
})

type TaskListToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  onRefresh: () => void
  onCreateTask: () => void
  searchInputRef: MutableRefObject<HTMLInputElement | null>
}

export const TaskListToolbar = ({
  searchValue,
  onSearchChange,
  onRefresh,
  onCreateTask,
  searchInputRef,
}: TaskListToolbarProps) => {
  const styles = useStyles()

  const handleSearchChange = (_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => {
    onSearchChange(data.value)
  }

  return (
    <div className={styles.root}>
      <Input
        appearance="filled-darker"
        placeholder="Search tasks"
        aria-label="Search tasks"
        value={searchValue}
        onChange={handleSearchChange}
        className={styles.input}
        contentAfter="/"
        ref={searchInputRef}
        type="search"
      />
      <Tooltip relationship="label" content="Refresh task data">
        <Button
          appearance="subtle"
          icon={<ArrowClockwise24Regular />}
          onClick={onRefresh}
          aria-label="Refresh"
        />
      </Tooltip>
      <Button appearance="primary" icon={<Add24Regular />} onClick={onCreateTask}>
        New Task
      </Button>
    </div>
  )
}
