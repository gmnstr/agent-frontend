import { Body1, Button, Caption1, Tab, TabList, Title2, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import type { SelectTabData, SelectTabEvent, TabValue } from '@fluentui/react-components'
import { useCallback, useState } from 'react'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.75rem',
    paddingBottom: '3rem',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  tabSurface: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    boxShadow: tokens.shadow4,
    display: 'flex',
    flexDirection: 'column',
  },
  tabHeader: {
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    ...shorthands.padding('1.5rem', '2rem', '1rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  tabListWrapper: {
    ...shorthands.padding('0', '2rem'),
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  tabContent: {
    ...shorthands.padding('2rem'),
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  tablePlaceholder: {
    borderRadius: '0.85rem',
    border: `1px dashed ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('2.5rem'),
    color: tokens.colorNeutralForeground3,
    textAlign: 'center',
    boxShadow: tokens.shadow2,
  },
})

export const EnvironmentsPlaceholder = () => {
  const styles = useStyles()
  const [activeTab, setActiveTab] = useState<TabValue>('environments')

  const handleTabSelect = useCallback(
    (_event: SelectTabEvent, data: SelectTabData) => {
      setActiveTab(data.value)
    },
    [],
  )

  return (
    <div className={styles.page}>
      <div className={styles.tabSurface}>
        <div className={styles.tabHeader}>
          <div className={styles.header}>
            <Title2 id="settings-env-heading">Workspace settings</Title2>
            <Caption1>Configure Codex for your organization&apos;s repositories and environments.</Caption1>
          </div>
        </div>
        <div className={styles.tabListWrapper}>
          <TabList selectedValue={activeTab} onTabSelect={handleTabSelect} aria-label="Settings sections">
            <Tab value="general">General</Tab>
            <Tab value="environments">Environments</Tab>
            <Tab value="data">Data controls</Tab>
            <Tab value="reviews">Code review</Tab>
          </TabList>
          <Button appearance="primary" disabled>
            Create environment
          </Button>
        </div>
        <div className={styles.tabContent} role="tabpanel" aria-labelledby="settings-env-heading">
          {activeTab === 'environments' ? (
            <>
              <Body1>
                We&apos;re prioritizing the Codex task board this sprint. Environment provisioning, audit logs, and access controls
                will land in Phase 2.
              </Body1>
              <section className={styles.tablePlaceholder} role="status" aria-live="polite">
                Environment inventory and access policies will render here once the settings module is unlocked.
              </section>
            </>
          ) : (
            <Body1>
              This section is coming soon. Stay tuned for new configuration options as the portal evolves.
            </Body1>
          )}
        </div>
      </div>
    </div>
  )
}
