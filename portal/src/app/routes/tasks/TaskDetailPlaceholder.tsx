import { useCallback, useState } from 'react'
import {
  Body1,
  Button,
  Caption1,
  Tab,
  TabList,
  Title2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components'
import { useParams } from 'react-router-dom'
import { trackEvent } from '../../../lib/telemetry'

const useStyles = makeStyles({
  container: {
    ...shorthands.padding('2rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
  },
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  tabPanel: {
    borderRadius: tokens.borderRadiusLarge,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('1.5rem'),
  },
})

export const TaskDetailPlaceholder = () => {
  const styles = useStyles()
  const { taskId } = useParams()
  const [activeTab, setActiveTab] = useState<TabValue>('diff')
  const diffTabId = 'task-detail-tab-diff'
  const logsTabId = 'task-detail-tab-logs'
  const diffPanelId = 'task-detail-panel-diff'
  const logsPanelId = 'task-detail-panel-logs'

  const handleTabSelect = useCallback(
    (_event: SelectTabEvent, data: SelectTabData) => {
      setActiveTab(data.value)
      trackEvent({ type: 'tab_changed', tab: String(data.value), taskId })
    },
    [taskId],
  )

  const handleViewPrClick = useCallback(() => {
    trackEvent({ type: 'pr_clicked', taskId: taskId ?? 'unknown', url: '#' })
    console.info('View PR clicked (placeholder).')
  }, [taskId])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Title2 id="task-detail-heading">Task detail coming soon</Title2>
          <Caption1 aria-live="polite">Selected task: {taskId}</Caption1>
        </div>
        <Button appearance="primary" onClick={handleViewPrClick} aria-label="View pull request">
          View PR
        </Button>
      </div>
      <div className={styles.tabs}>
        <TabList
          selectedValue={activeTab}
          onTabSelect={handleTabSelect}
          aria-label="Task detail tabs"
          aria-labelledby="task-detail-heading"
        >
          <Tab value="diff" id={diffTabId} aria-controls={diffPanelId}>
            Diff
          </Tab>
          <Tab value="logs" id={logsTabId} aria-controls={logsPanelId}>
            Logs
          </Tab>
        </TabList>
        <div
          role="tabpanel"
          id={diffPanelId}
          aria-labelledby={diffTabId}
          hidden={activeTab !== 'diff'}
          className={styles.tabPanel}
        >
          <Body1 role="status" aria-live="polite">
            Diff review experience will appear here.
          </Body1>
        </div>
        <div
          role="tabpanel"
          id={logsPanelId}
          aria-labelledby={logsTabId}
          hidden={activeTab !== 'logs'}
          className={styles.tabPanel}
        >
          <Body1 role="status" aria-live="polite">
            Logs streaming view will appear here.
          </Body1>
        </div>
      </div>
    </div>
  )
}
