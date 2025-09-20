import type { ReactNode } from 'react'
import {
  Avatar,
  Button,
  Tooltip,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import {
  Alert24Regular,
  Search24Regular,
} from '@fluentui/react-icons'

const useStyles = makeStyles({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('1.25rem', '2.5rem'),
    gap: '1.5rem',
    minHeight: '4.5rem',
  },
  toolbar: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
})

export const TopBar = ({ children }: { children?: ReactNode }) => {
  const styles = useStyles()

  return (
    <header className={styles.root}>
      <div className={styles.toolbar} role="toolbar" aria-label="Page actions">
        {children}
      </div>
      <div className={styles.actions}>
        <Tooltip relationship="label" content="Search (⌘K)">
          <Button appearance="transparent" icon={<Search24Regular />} aria-label="Search" />
        </Tooltip>
        <Tooltip relationship="label" content="Notifications">
          <Button appearance="transparent" icon={<Alert24Regular />} aria-label="Notifications" />
        </Tooltip>
        <Avatar name="Ava" aria-label="Account" size={32} />
      </div>
    </header>
  )
}
