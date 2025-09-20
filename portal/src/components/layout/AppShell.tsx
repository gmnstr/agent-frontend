import type { ReactNode } from 'react'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { LeftRail } from './LeftRail'
import { TopBar } from './TopBar'

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  content: {
    flex: 1,
    minHeight: 0,
    ...shorthands.padding('0', '2.5rem', '2.5rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
})

export const AppShell = ({
  children,
  toolbarContent,
}: {
  children: ReactNode
  toolbarContent: ReactNode
}) => {
  const styles = useStyles()

  return (
    <div className={styles.root}>
      <LeftRail />
      <div className={styles.main}>
        <TopBar>{toolbarContent}</TopBar>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
