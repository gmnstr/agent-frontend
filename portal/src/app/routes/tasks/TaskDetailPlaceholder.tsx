import { useCallback, useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Tab,
  TabList,
  Text,
  Textarea,
  Title2,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components'
import { Archive24Regular, ArrowLeft24Regular, Share24Regular } from '@fluentui/react-icons'
import { useParams } from 'react-router-dom'
import { CodeDiffViewer } from '../../../components/diff/CodeDiffViewer'
import type { DiffFile } from '../../../components/diff/CodeDiffViewer'
import { trackEvent } from '../../../lib/telemetry'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    paddingBottom: '3rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderRadius: '0.9rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.75rem', '2rem'),
    boxShadow: tokens.shadow4,
  },
  headerTop: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  headerTitle: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  meta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    alignItems: 'center',
    color: tokens.colorNeutralForeground3,
    fontSize: '0.9rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.5rem'),
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    color: tokens.colorNeutralForeground3,
  },
  tabContainer: {
    borderRadius: '0.9rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.5rem'),
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  tabPanel: {
    borderRadius: '0.75rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('1.5rem'),
  },
  logsPlaceholder: {
    borderRadius: '0.75rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('2.5rem', '1.5rem'),
    textAlign: 'center',
    color: tokens.colorNeutralForeground3,
  },
  composer: {
    borderRadius: '0.9rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('1.25rem', '1.5rem'),
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    boxShadow: tokens.shadow2,
    flexWrap: 'wrap',
  },
  composerInput: {
    flex: 1,
    minWidth: '16rem',
  },
  composerActions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap',
  },
})

const summaryBullets = [
  'Summaries from the AI assistant will highlight code decisions.',
  'Testing and verification signals surface risky changes immediately.',
  'Each section is fully collapsible for focused reviews.',
]

const diffFiles: DiffFile[] = [
  {
    path: 'src/components/MainInputComponent.tsx',
    additions: 124,
    deletions: 33,
    content: `diff --git a/src/components/MainInputComponent.tsx b/src/components/MainInputComponent.tsx
+// Input redesign coming soon\n+export const MainInputComponent = () => null`,
  },
  {
    path: 'src/styles/theme/tokens.ts',
    additions: 42,
    deletions: 12,
    content: `diff --git a/src/styles/theme/tokens.ts b/src/styles/theme/tokens.ts
+// Theme updates placeholder`,
  },
  {
    path: 'package.json',
    additions: 5,
    deletions: 1,
    content: `diff --git a/package.json b/package.json
+  "codex": "0.1.0"`,
  },
]

export const TaskDetailPlaceholder = () => {
  const styles = useStyles()
  const { taskId } = useParams()
  const [activeTab, setActiveTab] = useState<TabValue>('diff')
  const [selectedFile, setSelectedFile] = useState<string | undefined>(diffFiles[0]?.path)
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

  const handleFileSelect = useCallback((filePath: string) => {
    setSelectedFile(filePath)
  }, [])

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
        <div className={styles.headerTop}>
          <div className={styles.headerTitle}>
            <Button appearance="transparent" icon={<ArrowLeft24Regular />} aria-label="Back to tasks" disabled>
              Back
            </Button>
            <Title2 id="task-detail-heading">Task detail experience coming soon</Title2>
          </div>
          <div className={styles.actions}>
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
        <div className={styles.meta} role="list">
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

      <section className={styles.infoGrid} aria-label="Task signals">
        <div className={styles.infoCard}>
          <Text weight="semibold">Summary</Text>
          <ul className={styles.infoList}>
            {summaryBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className={styles.infoCard}>
          <Text weight="semibold" style={{ color: '#3FB950' }}>
            All suites passing
          </Text>
          <Text size={200}>
            Automated checks and manual verification notes will appear here to guide your review.
          </Text>
          <Badge appearance="ghost" color="success">
            CI signal synced
          </Badge>
        </div>
      </section>

      <section className={styles.tabContainer} aria-label="Task review workspace">
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
          <CodeDiffViewer files={diffFiles} selectedFile={selectedFile} onFileSelect={handleFileSelect} />
        </div>
        <div
          role="tabpanel"
          id={logsPanelId}
          aria-labelledby={logsTabId}
          hidden={activeTab !== 'logs'}
          className={styles.tabPanel}
        >
          <div className={styles.logsPlaceholder}>
            Live build and agent execution logs will stream here for contextual debugging.
          </div>
        </div>
      </section>

      <footer className={styles.composer} aria-label="Agent composer">
        <Textarea
          className={styles.composerInput}
          placeholder="Ask the agent for clarification or request new code updates..."
          disabled
          resize="vertical"
          aria-disabled="true"
        />
        <div className={styles.composerActions}>
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
