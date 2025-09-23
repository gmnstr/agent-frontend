import type { ReactNode } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  makeStyles,
  mergeClasses,
  shorthands,
  tokens,
} from '@fluentui/react-components'
import { Add12Filled, Dismiss24Regular, LineHorizontal3Regular } from '@fluentui/react-icons'
import { Link, NavLink } from 'react-router-dom'
import { GlobalSearch } from '../search/GlobalSearch'

type NavigationItem = {
  key: string
  label: string
  to: string
  end?: boolean
}

const navItems: NavigationItem[] = [
  { key: 'overview', label: 'Overview', to: '/', end: true },
  { key: 'tasks', label: 'Tasks', to: '/tasks' },
  { key: 'environments', label: 'Environments', to: '/settings/environments' },
]

const useStyles = makeStyles({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 5,
    backgroundColor: tokens.colorNeutralBackground2,
    borderBottom: `1px solid ${tokens.colorNeutralStroke1}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shorthands.padding('0', '2rem'),
    minHeight: '3.5rem',
    gap: '1.5rem',
    '@media (max-width: 900px)': {
      ...shorthands.padding('0', '1.25rem'),
    },
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.75rem',
    minWidth: 0,
    flex: 1,
  },
  menuButton: {
    display: 'none',
    '@media (max-width: 1023px)': {
      display: 'inline-flex',
    },
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    textDecoration: 'none',
    color: tokens.colorNeutralForeground1,
    fontWeight: 600,
  },
  brandIcon: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '6px',
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorBrandForegroundOnLight,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1rem',
    letterSpacing: '-0.05em',
    border: `1px solid ${tokens.colorBrandBackground2}`,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  brandTitle: {
    fontSize: '1.125rem',
    lineHeight: '1.25rem',
  },
  brandSubtitle: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: tokens.colorNeutralForeground3,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    '@media (max-width: 1023px)': {
      display: 'none',
    },
  },
  navLink: {
    fontSize: '0.95rem',
    color: tokens.colorNeutralForeground2,
    fontWeight: 600,
    textDecoration: 'none',
    transitionProperty: 'color',
    transitionDuration: '120ms',
    '&:hover': {
      color: tokens.colorBrandForeground1,
    },
    '&:focus-visible': {
      outline: `2px solid ${tokens.colorBrandBackground}`,
      outlineOffset: '3px',
    },
    '&[aria-current="page"]': {
      color: tokens.colorBrandForeground1,
    },
  },
  navLinkActive: {
    color: tokens.colorBrandForeground1,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: 0,
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    top: '-0.25rem',
    right: '-0.35rem',
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  mobileNavLink: {
    fontSize: '1rem',
    fontWeight: 600,
    color: tokens.colorNeutralForeground1,
    textDecoration: 'none',
    '&[aria-current="page"]': {
      color: tokens.colorBrandForeground1,
    },
  },
  mobileDialogContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
})

export const TopBar = ({ children }: { children?: ReactNode }) => {
  const styles = useStyles()

  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <Dialog modalType="non-modal">
          <DialogTrigger disableButtonEnhancement>
            <Button
              className={styles.menuButton}
              appearance="transparent"
              icon={<LineHorizontal3Regular />}
              aria-label="Open navigation"
            />
          </DialogTrigger>
          <DialogSurface aria-label="Navigation">
            <DialogBody>
              <DialogTitle
                action={
                  <DialogTrigger action="close" disableButtonEnhancement>
                    <Button appearance="transparent" icon={<Dismiss24Regular />} aria-label="Close" />
                  </DialogTrigger>
                }
              >
                Menu
              </DialogTitle>
              <DialogContent className={styles.mobileDialogContent}>
                <nav className={styles.mobileNav} aria-label="Primary navigation">
                  {navItems.map((item) => (
                    <DialogTrigger key={item.key} action="close" disableButtonEnhancement>
                      <NavLink to={item.to} end={item.end} className={styles.mobileNavLink}>
                        {item.label}
                      </NavLink>
                    </DialogTrigger>
                  ))}
                </nav>
              </DialogContent>
            </DialogBody>
          </DialogSurface>
        </Dialog>
        <Link to="/" className={styles.brandLink} aria-label="Codex portal home">
          <span className={styles.brandIcon} aria-hidden="true">
            {'{ }'}
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Codex</span>
            <span className={styles.brandSubtitle}>AI coding portal</span>
          </span>
        </Link>
        <nav className={styles.nav} aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) => mergeClasses(styles.navLink, isActive && styles.navLinkActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={styles.center}>
        <div className={styles.toolbar} role="toolbar" aria-label="Page actions">
          {children}
        </div>
      </div>
      <div className={styles.right}>
        <GlobalSearch />
        <a className={styles.navLink} href="#" onClick={(event) => event.preventDefault()} aria-disabled="true">
          Docs
        </a>
        <div className={styles.avatarWrapper}>
          <Avatar name="Ava" aria-label="Account" size={32} />
          <Badge
            className={styles.avatarBadge}
            appearance="filled"
            color="informative"
            shape="circular"
            size="extra-small"
            icon={<Add12Filled />}
            role="status"
            aria-label="New updates available"
          />
        </div>
      </div>
    </header>
  )
}
