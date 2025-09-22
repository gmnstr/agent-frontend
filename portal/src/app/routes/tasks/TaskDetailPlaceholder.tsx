import { useCallback, useMemo, useState } from 'react'
import { Badge, Button, Tab, TabList, Text, Textarea, Title2, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components'
import { Archive24Regular, ArrowLeft24Regular, Share24Regular } from '@fluentui/react-icons'
import { useParams } from 'react-router-dom'
import { trackEvent } from '../../../lib/telemetry'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.5rem', '2rem'),
    boxShadow: tokens.shadow2,
  },
  headerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: tokens.colorNeutralForeground3,
    fontSize: '0.875rem',
  },
  headerActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
  metaRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    alignItems: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '0.875rem',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: 'minmax(260px, 320px) minmax(0, 1fr)',
    gap: '1.5rem',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.5rem'),
    boxShadow: tokens.shadow2,
  },
  sidebarSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
  },
  list: {
    margin: 0,
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    color: tokens.colorNeutralForeground2,
  },
  fileItem: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '0.75rem',
    fontFamily: tokens.fontFamilyMonospace,
    fontSize: '0.875rem',
  },
  mainPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow4,
  },
  tabs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    ...shorthands.padding('1.25rem', '1.5rem'),
  },
  tabPanel: {
    flex: 1,
    minHeight: '22rem',
    ...shorthands.padding('1.5rem'),
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: '0.75rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    display: 'grid',
    placeItems: 'center',
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  bottomBar: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1rem', '1.5rem'),
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    boxShadow: tokens.shadow2,
  },
  input: {
    flex: 1,
  },
  bottomActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
})

const summaryBullets = [
  'Summaries from the AI assistant will highlight code decisions.',
  'Testing and verification signals surface risky changes immediately.',
  'Each section is fully collapsible for focused reviews.',
]

const filesMock = [
  { path: 'src/components/DiffViewer.tsx', additions: 124, deletions: 33 },
  { path: 'src/styles/theme/tokens.ts', additions: 42, deletions: 12 },
  { path: 'package.json', additions: 5, deletions: 1 },
]

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

  const headerMeta = useMemo(
    () => [
      `Task ID: ${taskId ?? 'unknown'}`,
      'Repository: codex/portal',
      'Branch: feature/ai-collab',
      'Last updated: moments ago',
    ],
    [taskId],
  )

  return (
    <div className={styles.page}>
      <section className={styles.header} aria-labelledby="task-detail-heading">
        <div className={styles.headerRow}>
          <div>
            <Button appearance="transparent" icon={<ArrowLeft24Regular />} aria-label="Back to tasks" disabled>
              Back
            </Button>
            <Title2 id="task-detail-heading">Task detail experience coming soon</Title2>
          </div>
          <div className={styles.headerActions}>
            <Button appearance="secondary" icon={<Share24Regular />} disabled>
              Share
            </Button>
            <Button appearance="secondary" icon={<Archive24Regular />} disabled>
              Archive
            </Button>
            <Button appearance="primary" onClick={handleViewPrClick} aria-label="View pull request">
              View PR
            </Button>
          </div>
        </div>
        <div className={styles.metaRow} role="list">
          {headerMeta.map((item) => (
            <span key={item} role="listitem">
              {item}
            </span>
          ))}
          <Badge appearance="tint" color="informative">
            Agent run ready
          </Badge>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Task sidebar">
          <div className={styles.sidebarSection}>
            <div className={styles.sectionHeader}>Summary</div>
            <ul className={styles.list}>
              {summaryBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sectionHeader}>Testing</div>
            <Text weight="semibold" style={{ color: '#3FB950' }}>
              All suites passing
            </Text>
            <Text size={200}>
              Automated checks and manual verification notes will appear here to guide your review.
            </Text>
          </div>
          <div className={styles.sidebarSection}>
            <div className={styles.sectionHeader}>Files (preview)</div>
            <div className={styles.list}>
              {filesMock.map((file) => (
                <div key={file.path} className={styles.fileItem}>
                  <span>{file.path}</span>
                  <span>
                    +{file.additions} / -{file.deletions}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className={styles.mainPanel} aria-label="Task content">
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
              Diff review tools, minimap navigation, and annotations will land in Phase 3.
            </div>
            <div
              role="tabpanel"
              id={logsPanelId}
              aria-labelledby={logsTabId}
              hidden={activeTab !== 'logs'}
              className={styles.tabPanel}
            >
              Live build and agent execution logs will stream here for contextual debugging.
            </div>
          </div>
        </section>
      </div>

      <footer className={styles.bottomBar} aria-label="Agent composer">
        <Textarea
          className={styles.input}
          placeholder="Ask the agent for clarification or request new code updates..."
          disabled
          resize="vertical"
          aria-disabled="true"
        />
        <div className={styles.bottomActions}>
          <Button appearance="secondary" disabled>
            Ask
          </Button>
          <Button appearance="primary" disabled>
            Ship code
          </Button>
        </div>
      </footer>
    </div>
  )
}
