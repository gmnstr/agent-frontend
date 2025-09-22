import { Body1, Button, Caption1, Title2, makeStyles, shorthands, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  hero: {
    borderRadius: '0.85rem',
    border: `1px solid ${tokens.colorNeutralStroke1}`,
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('2rem', '2.25rem'),
    boxShadow: tokens.shadow2,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
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

  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="settings-env-heading">
        <div>
          <Title2 id="settings-env-heading">Environment management coming soon</Title2>
          <Caption1>Control sandboxes, credentials, and deployment pipelines from a single cockpit.</Caption1>
        </div>
        <Body1>
          We&apos;re prioritizing the Codex task board this sprint. Environment provisioning, audit logs, and access controls will
          land in Phase 2.
        </Body1>
        <Button appearance="primary" disabled>
          Create environment
        </Button>
      </section>
      <section className={styles.tablePlaceholder} role="status" aria-live="polite">
        Environment inventory and access policies will render here once the settings module is unlocked.
      </section>
    </div>
  )
}
