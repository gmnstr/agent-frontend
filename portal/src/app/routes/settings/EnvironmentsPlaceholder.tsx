import { Body1, Title2 } from '@fluentui/react-components'
import { makeStyles, shorthands } from '@fluentui/react-components'

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('2rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
})

export const EnvironmentsPlaceholder = () => {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <Title2>Environments</Title2>
      <Body1>Phase 1 focuses on the task list. Settings will arrive in a later phase.</Body1>
    </div>
  )
}
