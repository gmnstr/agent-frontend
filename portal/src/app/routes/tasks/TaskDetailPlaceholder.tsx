import { Caption1, Title2 } from '@fluentui/react-components'
import { useParams } from 'react-router-dom'
import { makeStyles, shorthands } from '@fluentui/react-components'

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('2rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
})

export const TaskDetailPlaceholder = () => {
  const styles = useStyles()
  const { taskId } = useParams()

  return (
    <div className={styles.container}>
      <Title2>Task detail coming soon</Title2>
      <Caption1>Selected task: {taskId}</Caption1>
    </div>
  )
}
