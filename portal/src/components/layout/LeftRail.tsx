import { Badge, Text, Tooltip, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import {
  BookInformation24Regular,
  ClipboardTaskListLtr24Regular,
  Home24Regular,
  Settings24Regular,
} from '@fluentui/react-icons'
import { NavLink } from 'react-router-dom'

type NavigationItem =
  | {
      key: string
      label: string
      description: string
      icon: JSX.Element
      to: string
      end?: boolean
    }
  | {
      key: string
      label: string
      description: string
      icon: JSX.Element
      href: string
      tooltip: string
    }

const useStyles = makeStyles({
  root: {
    width: '15rem',
    backgroundColor: tokens.colorNeutralBackground2,
    borderRight: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.padding('2rem', '1.5rem'),
    gap: '2rem',
    position: 'sticky',
    top: 0,
    maxHeight: '100vh',
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    boxShadow: tokens.shadow2,
    '@media (max-width: 1023px)': {
      display: 'none',
    },
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logo: {
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorBrandForegroundOnLight,
    display: 'grid',
    placeItems: 'center',
    fontWeight: 700,
    letterSpacing: '-0.05em',
    fontSize: '1.125rem',
    boxShadow: tokens.shadow4,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  brandTitle: {
    fontWeight: 600,
    fontSize: '1.0625rem',
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    color: tokens.colorNeutralForeground3,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  link: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    ...shorthands.padding('0.85rem', '1rem'),
    borderRadius: '0.75rem',
    color: tokens.colorNeutralForeground2,
    transitionProperty: 'background-color, color, box-shadow',
    transitionDuration: '160ms',
    textDecoration: 'none',
    selectors: {
      '&:hover': {
        backgroundColor: tokens.colorNeutralBackground3,
        color: tokens.colorNeutralForeground1,
      },
      '&:focus-visible': {
        outline: `2px solid ${tokens.colorBrandBackground}`,
        outlineOffset: 2,
      },
    },
  },
  linkActive: {
    backgroundColor: tokens.colorNeutralBackground3,
    color: tokens.colorNeutralForeground1,
    boxShadow: tokens.shadow4,
  },
  linkHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    fontWeight: 600,
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
  },
  description: {
    fontSize: '0.75rem',
    color: tokens.colorNeutralForeground3,
  },
  docsBadge: {
    alignSelf: 'flex-start',
    marginTop: '-0.35rem',
  },
})

const navItems: NavigationItem[] = [
  {
    key: 'home',
    label: 'Overview',
    description: 'Daily briefing & activity',
    icon: <Home24Regular />,
    to: '/',
    end: true,
  },
  {
    key: 'tasks',
    label: 'Task board',
    description: 'Track every coding mission',
    icon: <ClipboardTaskListLtr24Regular />,
    to: '/tasks',
  },
  {
    key: 'docs',
    label: 'Docs & spec',
    description: 'Reference the build playbook',
    icon: <BookInformation24Regular />,
    href: '#',
    tooltip: 'Portal documentation coming soon',
  },
  {
    key: 'settings',
    label: 'Environments',
    description: 'Manage sandboxes and access',
    icon: <Settings24Regular />,
    to: '/settings/environments',
  },
]

export const LeftRail = () => {
  const styles = useStyles()

  return (
    <aside className={styles.root}>
      <div className={styles.brand}>
        <div className={styles.logo} aria-hidden="true">
          {'{ }'}
        </div>
        <div className={styles.brandText}>
          <Text className={styles.brandTitle} weight="semibold">
            Codex Portal
          </Text>
          <Text className={styles.brandSubtitle}>AI development HQ</Text>
        </div>
      </div>
      <nav className={styles.nav} aria-label="Primary navigation">
        {navItems.map((item) => {
          const content = (
            <>
              <span className={styles.linkHeader}>
                <span className={styles.icon} aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </span>
              <span className={styles.description}>{item.description}</span>
              {'href' in item ? (
                <Badge
                  className={styles.docsBadge}
                  appearance="filled"
                  color="informative"
                  size="extra-small"
                  role="presentation"
                >
                  Soon
                </Badge>
              ) : null}
            </>
          )

          if ('href' in item) {
            return (
              <Tooltip key={item.key} content={item.tooltip} relationship="label">
                <a
                  className={styles.link}
                  href={item.href}
                  onClick={(event) => event.preventDefault()}
                  role="link"
                  aria-disabled="true"
                >
                  {content}
                </a>
              </Tooltip>
            )
          }

          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                [styles.link, isActive ? styles.linkActive : undefined].filter(Boolean).join(' ')
              }
            >
              {content}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
