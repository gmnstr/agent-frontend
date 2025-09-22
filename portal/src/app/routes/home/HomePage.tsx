import { useQuery } from '@tanstack/react-query'
import {
  Body1,
  Button,
  Caption1,
  Card,
  CardHeader,
  CardPreview,
  Divider,
  Skeleton,
  Title1,
  Title3,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { ArrowCircleRight24Regular, Code24Regular, PersonSupport24Regular } from '@fluentui/react-icons'
import { Link } from 'react-router-dom'
import { fetchTasks } from '../../../api/tasks'
import { TaskStatusPill } from '../../../components/task-list/TaskStatusPill'
import { formatRelativeTime } from '../../../lib/formatRelativeTime'
import type { Task } from '../../../types/task'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    paddingBottom: '3rem',
  },
  hero: {
    borderRadius: '1rem',
    backgroundImage:
      'radial-gradient(circle at top left, rgba(88,166,255,0.35), transparent 45%), radial-gradient(circle at bottom right, rgba(188,140,255,0.25), transparent 55%)',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('3.5rem', '3rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: tokens.shadow4,
  },
  heroTitle: {
    maxWidth: '40rem',
    fontSize: '2.5rem',
    lineHeight: '1.15',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  heroSubtitle: {
    maxWidth: '38rem',
    color: tokens.colorNeutralForeground2,
    fontSize: '1.05rem',
  },
  heroActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  highlights: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(16rem, 1fr))',
    gap: '1.25rem',
  },
  highlightCard: {
    backgroundColor: tokens.colorNeutralBackground2,
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '0.75rem',
    boxShadow: tokens.shadow2,
  },
  previewSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  previewHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '1rem',
    alignItems: 'center',
  },
  previewList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
    gap: '1.25rem',
  },
  taskCard: {
    height: '100%',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    borderRadius: '0.85rem',
    backgroundColor: tokens.colorNeutralBackground2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: tokens.shadow2,
  },
  taskCardPreview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    ...shorthands.padding('1.25rem'),
  },
  taskMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    color: tokens.colorNeutralForeground3,
    fontSize: '0.85rem',
  },
  taskDiff: {
    display: 'flex',
    gap: '0.75rem',
    fontFamily: tokens.fontFamilyMonospace,
  },
  additions: {
    color: '#3FB950',
  },
  deletions: {
    color: '#F85149',
  },
  skeletonCard: {
    height: '100%',
    borderRadius: '0.85rem',
    ...shorthands.padding('1.25rem'),
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
  },
})

const highlightItems = [
  {
    title: 'Ship code with confidence',
    description: 'Review diffs, validate tests, and hand-off PRs without leaving the portal.',
    icon: <Code24Regular />,
  },
  {
    title: 'Guide the AI pair',
    description: 'Steer conversations, share context, and track decision history for every task.',
    icon: <PersonSupport24Regular />,
  },
  {
    title: 'Stay production ready',
    description: 'Automated environment health checks keep every workspace deployment-ready.',
    icon: <ArrowCircleRight24Regular />,
  },
] as const

export const HomePage = () => {
  const styles = useStyles()
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    staleTime: 1000 * 30,
  })

  const previewTasks = tasks.slice(0, 3)

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="home-hero-heading">
        <Title1 id="home-hero-heading" className={styles.heroTitle}>
          A command center for every AI-assisted coding mission
        </Title1>
        <Body1 className={styles.heroSubtitle}>
          Coordinate tasks, review diffs, and deploy confidently with a workspace designed for human + AI teams.
        </Body1>
        <div className={styles.heroActions}>
          <Button as={Link} to="/tasks" appearance="primary" size="large">
            View active tasks
          </Button>
          <Button as={Link} to="/settings/environments" appearance="secondary" size="large">
            Configure environments
          </Button>
        </div>
      </section>

      <section className={styles.highlights} aria-label="Portal capabilities">
        {highlightItems.map((item) => (
          <Card key={item.title} className={styles.highlightCard} aria-label={item.title}>
            <CardHeader
              header={<Title3>{item.title}</Title3>}
              description={<Body1>{item.description}</Body1>}
              image={item.icon}
            />
          </Card>
        ))}
      </section>

      <section className={styles.previewSection} aria-labelledby="home-preview-heading">
        <div className={styles.previewHeader}>
          <div>
            <Title3 id="home-preview-heading">In-flight tasks</Title3>
            <Caption1>Recent missions assigned to Codex.</Caption1>
          </div>
          <Button as={Link} to="/tasks" appearance="transparent">
            Open task board
          </Button>
        </div>
        <div className={styles.previewList}>
          {isLoading
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={index} className={styles.skeletonCard}>
                  <Skeleton shape="rectangle" appearance="translucent" height={28} />
                  <Skeleton shape="rectangle" appearance="translucent" height={20} />
                  <Skeleton shape="rectangle" appearance="translucent" height={20} />
                </div>
              ))
            : previewTasks.map((task: Task) => (
                <Card
                  key={task.id}
                  className={styles.taskCard}
                  aria-label={`Task ${task.title}`}
                  as={Link}
                  to={`/tasks/${task.id}`}
                >
                  <CardPreview className={styles.taskCardPreview}>
                    <TaskStatusPill status={task.status} />
                    <Title3>{task.title}</Title3>
                    <div className={styles.taskMeta}>
                      <span>{task.repository}</span>
                      <span>Updated {formatRelativeTime(task.createdAt)}</span>
                    </div>
                    <Divider appearance="subtle" />
                    <div className={styles.taskDiff}>
                      <span className={styles.additions}>+{task.additions}</span>
                      <span className={styles.deletions}>-{task.deletions}</span>
                    </div>
                  </CardPreview>
                </Card>
              ))}
        </div>
      </section>
    </div>
  )
}
