import type { ReactNode } from 'react'
import { makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { TopBar } from './TopBar'

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground1,
    color: tokens.colorNeutralForeground1,
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    ...shorthands.padding('2rem', '2.5rem', '3rem'),
    '@media (max-width: 900px)': {
      ...shorthands.padding('1.5rem', '1.25rem', '2.5rem'),
    },
  },
  contentInner: {
    width: '100%',
    maxWidth: '75rem',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
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
      <TopBar>{toolbarContent}</TopBar>
      <div className={styles.main}>
        <main className={styles.content} role="main" tabIndex={-1}>
          <div className={styles.contentInner}>{children}</div>
        </main>
      </div>
    </div>
  )
}
