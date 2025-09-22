import '../polyfills/nodeFilter'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  FluentProvider,
  makeStyles,
  shorthands,
} from '@fluentui/react-components'
import { sharpDarkTheme, sharpLightTheme } from './sharpTheme'

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

const brandFontStack = "'Inter', 'Segoe UI Variable', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
const monoFontStack = "'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', monospace"

const createTheme = (mode: ColorMode) => {
  const base = mode === 'dark' ? sharpDarkTheme : sharpLightTheme

  // Apply custom brand colors on top of sharp theme
  const isDark = mode === 'dark'

  if (isDark) {
    return {
      ...base,
      fontFamilyBase: brandFontStack,
      fontFamilyNumeric: brandFontStack,
      fontFamilyMonospace: monoFontStack,
      colorNeutralBackground1: '#0D1117',
      colorNeutralBackground2: '#161B22',
      colorNeutralBackground3: '#21262D',
      colorNeutralBackground4: '#1C2128',
      colorNeutralForeground1: '#F0F6FC',
      colorNeutralForeground2: '#C9D1D9',
      colorNeutralForeground3: '#8B949E',
      colorNeutralForeground4: '#6E7681',
      colorNeutralForegroundDisabled: '#4C525A',
      colorNeutralStroke1: '#30363D',
      colorNeutralStroke2: '#21262D',
      colorNeutralStrokeAccessible: '#58A6FF',
      colorBrandBackground: '#58A6FF',
      colorBrandBackgroundHover: '#79C0FF',
      colorBrandBackgroundPressed: '#1F6FEB',
      colorBrandBackgroundSelected: '#58A6FF',
      colorBrandForeground1: '#58A6FF',
      colorBrandForeground2: '#79C0FF',
      colorBrandForegroundLink: '#58A6FF',
      colorBrandForegroundLinkHover: '#79C0FF',
      colorBrandForegroundOnLight: '#0D1117',
      colorBrandForegroundInverted: '#0D1117',
      colorPaletteGreenForeground2: '#3FB950',
      colorPaletteYellowForeground2: '#D29922',
      colorPaletteRedForeground2: '#F85149',
      colorPalettePurpleForeground2: '#BC8CFF',
    }
  }

  return {
    ...base,
    fontFamilyBase: brandFontStack,
    fontFamilyNumeric: brandFontStack,
    fontFamilyMonospace: monoFontStack,
    colorNeutralBackground1: '#F6F8FA',
    colorNeutralBackground2: '#FFFFFF',
    colorNeutralBackground3: '#EAEFF5',
    colorNeutralBackground4: '#D0D7DE',
    colorNeutralForeground1: '#0D1117',
    colorNeutralForeground2: '#4B5563',
    colorNeutralForeground3: '#6B7280',
    colorNeutralForeground4: '#9CA3AF',
    colorNeutralForegroundDisabled: '#A0AEC0',
    colorNeutralStroke1: '#D0D7DE',
    colorNeutralStroke2: '#E2E8F0',
    colorNeutralStrokeAccessible: '#1F6FEB',
    colorBrandBackground: '#1F6FEB',
    colorBrandBackgroundHover: '#316DCA',
    colorBrandBackgroundPressed: '#1B4F9C',
    colorBrandBackgroundSelected: '#316DCA',
    colorBrandForeground1: '#1F6FEB',
    colorBrandForeground2: '#316DCA',
    colorBrandForegroundLink: '#1F6FEB',
    colorBrandForegroundLinkHover: '#316DCA',
    colorBrandForegroundOnLight: '#FFFFFF',
    colorBrandForegroundInverted: '#FFFFFF',
    colorPaletteGreenForeground2: '#238636',
    colorPaletteYellowForeground2: '#B08800',
    colorPaletteRedForeground2: '#D93025',
    colorPalettePurpleForeground2: '#6F42C1',
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
