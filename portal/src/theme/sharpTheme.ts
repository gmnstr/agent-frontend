// portal/src/theme/sharpTheme.ts
import type { Theme } from '@fluentui/react-components'
import {
  webDarkTheme as baseDark,
  webLightTheme as baseLight,
} from '@fluentui/react-components'

const noShadow = '0 0 0 0 rgba(0,0,0,0)'

function makeSharp(base: Theme): Theme {
  return {
    ...base,

    // Corners: small and consistent
    borderRadiusSmall: '4px',
    borderRadiusMedium: '6px',
    borderRadiusLarge: '8px',
    // Keep circular for avatars only
    borderRadiusCircular: '9999px',

    // Remove soft shadows in favor of crisp keylines
    shadow2: noShadow,
    shadow4: noShadow,
    shadow8: noShadow,
    shadow16: noShadow,
    shadow28: noShadow,
    shadow64: noShadow,

    // Slightly higher-contrast neutrals carried from base
    colorNeutralStroke1: base.colorNeutralStroke1,
    colorNeutralStroke2: base.colorNeutralStroke2,
    colorNeutralStrokeAccessible: base.colorNeutralStrokeAccessible,

    colorNeutralForeground2: base.colorNeutralForeground2,
    colorNeutralForeground3: base.colorNeutralForeground3,

    // Reserve brand for focus/hover/active states
    colorBrandForeground1: base.colorBrandForeground1,
    colorBrandBackground: base.colorBrandBackground,
    colorBrandBackground2: base.colorBrandBackground2,
  }
}

export const sharpDarkTheme: Theme = makeSharp(baseDark)
export const sharpLightTheme: Theme = makeSharp(baseLight)
