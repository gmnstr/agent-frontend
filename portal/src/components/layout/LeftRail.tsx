import { Button, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import {
  Archive24Regular,
  ClipboardTaskListLtr24Regular,
  Settings24Regular,
} from '@fluentui/react-icons'
import { NavLink } from 'react-router-dom'

const useStyles = makeStyles({
  root: {
    width: '4.5rem',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRight: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.padding('1.5rem', '0'),
    gap: '1.5rem',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.65rem',
    background: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
    fontSize: '1.5rem',
    fontWeight: 700,
    display: 'grid',
    placeItems: 'center',
    letterSpacing: '-0.05em',
  },
  navButton: {
    width: '3rem',
    height: '3rem',
    borderRadius: tokens.borderRadiusCircular,
    justifyContent: 'center',
  },
  active: {
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorNeutralForegroundOnBrand,
  },
})

const navItems = [
  {
    key: 'tasks',
    label: 'Tasks',
    icon: <ClipboardTaskListLtr24Regular />,
    to: '/tasks',
    disabled: false,
  },
  {
    key: 'archive',
    label: 'Archive',
    icon: <Archive24Regular />,
    to: '/tasks?status=archived',
    disabled: true,
  },
  {
    key: 'settings',
    label: 'Settings',
    icon: <Settings24Regular />,
    to: '/settings/environments',
    disabled: false,
  },
] as const

export const LeftRail = () => {
  const styles = useStyles()

  return (
    <aside className={styles.root}>
      <div className={styles.logo} aria-label="Portal home">
        λ
      </div>
      <nav className={styles.nav} aria-label="Primary navigation">
        {navItems.map((item) => {
          const button = (
            <Button
              icon={item.icon}
              appearance="transparent"
              className={styles.navButton}
              aria-label={item.label}
              disabled={item.disabled}
            />
          )

          if (item.disabled) {
            return (
              <Tooltip key={item.key} content="Coming soon" relationship="label">
                {button}
              </Tooltip>
            )
          }

          return (
            <NavLink key={item.key} to={item.to} aria-label={item.label} title={item.label}>
              {({ isActive }) => (
                <Button
                  icon={item.icon}
                  appearance={isActive ? 'primary' : 'transparent'}
                  className={styles.navButton}
                  aria-current={isActive ? 'page' : undefined}
                />
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
