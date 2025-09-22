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
    backgroundColor: tokens.colorNeutralBackground1,
  },
  content: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.padding('2rem', '2.5rem', '3rem'),
    gap: '2.5rem',
  },
  contentInner: {
    width: '100%',
    maxWidth: '75rem',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    flex: 1,
    minWidth: 0,
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
        <main className={styles.content} role="main" tabIndex={-1}>
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  )
}
