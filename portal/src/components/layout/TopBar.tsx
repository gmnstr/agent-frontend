import type { ReactNode } from 'react'
import { Avatar, Badge, Button, makeStyles, shorthands, tokens } from '@fluentui/react-components'
import { Add12Filled, LineHorizontal3Regular } from '@fluentui/react-icons'
import { Link, NavLink } from 'react-router-dom'

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
    ...shorthands.padding('0', '2.5rem'),
    minHeight: '4rem',
    boxShadow: tokens.shadow2,
    gap: '2rem',
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
    width: '2rem',
    height: '2rem',
    borderRadius: tokens.borderRadiusCircular,
    backgroundColor: tokens.colorBrandBackground,
    color: tokens.colorBrandForegroundOnLight,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.125rem',
    boxShadow: tokens.shadow4,
    letterSpacing: '-0.05em',
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
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    minWidth: 0,
    flex: 1,
    '@media (max-width: 900px)': {
      display: 'none',
    },
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
  },
  navLink: {
    fontSize: '0.875rem',
    color: tokens.colorNeutralForeground2,
    fontWeight: 500,
    textDecoration: 'none',
    transitionProperty: 'color, transform',
    transitionDuration: '120ms',
    selectors: {
      '&:hover': {
        color: tokens.colorBrandForeground1,
      },
      '&:focus-visible': {
        outline: `2px solid ${tokens.colorBrandBackground}`,
        outlineOffset: 3,
      },
      '&[aria-current="page"]': {
        color: tokens.colorBrandForeground1,
      },
    },
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    top: '-0.25rem',
    right: '-0.35rem',
    boxShadow: tokens.shadow4,
  },
})

export const TopBar = ({ children }: { children?: ReactNode }) => {
  const styles = useStyles()

  return (
    <header className={styles.root}>
      <div className={styles.left}>
        <Button
          className={styles.menuButton}
          appearance="transparent"
          icon={<LineHorizontal3Regular />}
          aria-label="Open navigation"
          onClick={() => console.info('Navigation drawer coming soon')}
        />
        <Link to="/" className={styles.brandLink} aria-label="Codex portal home">
          <span className={styles.brandIcon} aria-hidden="true">
            {'{ }'}
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandTitle}>Codex</span>
            <span className={styles.brandSubtitle}>AI coding portal</span>
          </span>
        </Link>
        <div className={styles.toolbar} role="toolbar" aria-label="Page actions">
          {children}
        </div>
      </div>
      <div className={styles.right}>
        <NavLink to="/settings/environments" className={styles.navLink}>
          Settings
        </NavLink>
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
