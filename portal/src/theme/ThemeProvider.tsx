import '../polyfills/nodeFilter'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  FluentProvider,
  makeStyles,
  shorthands,
  webDarkTheme,
  webLightTheme,
} from '@fluentui/react-components'
import type { Theme } from '@fluentui/react-components'

type ColorMode = 'dark' | 'light'

const prefersDarkMode = () => {
  if (typeof window === 'undefined') {
    return true
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

const getInitialMode = (): ColorMode => {
  if (typeof document !== 'undefined') {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light' || attr === 'dark') {
      return attr
    }
  }

  return prefersDarkMode() ? 'dark' : 'light'
}

const createTheme = (mode: ColorMode): Theme => {
  const base = mode === 'dark' ? webDarkTheme : webLightTheme

  return {
    ...base,
    colorNeutralBackground1: mode === 'dark' ? '#101017' : '#f5f6fb',
    colorNeutralBackground2: mode === 'dark' ? '#13131d' : '#ffffff',
    colorNeutralBackground3: mode === 'dark' ? '#1b1b29' : '#edeff6',
  }
}

const useStyles = makeStyles({
  provider: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'transparent',
    ...shorthands.overflow('hidden'),
  },
})

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const styles = useStyles()
  const [mode, setMode] = useState<ColorMode>(() => getInitialMode())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      setMode(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const root = document.documentElement
    root.setAttribute('data-theme', mode)
    root.style.colorScheme = mode
  }, [mode])

  const theme = useMemo(() => createTheme(mode), [mode])

  return (
    <FluentProvider className={styles.provider} theme={theme} applyStylesToPortals>
      {children}
    </FluentProvider>
  )
}
