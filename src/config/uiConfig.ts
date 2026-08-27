// =========================================================
// Project UI + Color Config
// =========================================================
//
// This file is the host project's standalone configuration.
//
// It is used when this site/app is running without Django-driven
// UI settings.
//
// The reusable UI package still owns its own library defaults.
// This file is only a project-level override source.
//
// Runtime source rules:
//
// 1. Library mode:
//    - No project config supplied.
//    - UI package defaults are used.
//
// 2. Standalone/project mode:
//    - This file initializes the UI/color stores.
//
// 3. Django/API mode:
//    - Django payload initializes the UI/color stores.
//    - This file is not used as an API fallback.
//
// Do not mutate these exported objects at runtime.
// Stores should clone these values into active state.

import type { PartialUiConfig } from '@mwheeler91/ui'
import type { ThemeColors } from '@mwheeler91/ui'

export const projectUiConfig: PartialUiConfig = {
  global: {
    pack: 'default', // default | lux | classic | minimal | block | soft
    radius: 'square', // square | soft | rounded | pill
    density: 'comfortable', // compact | comfortable | spacious
    font: 'system', // classic_sans | classic_serif | condensed_sans | display_serif | editorial_serif | industrial_mono
    // luxury_display | modern_sans | playful_display | rounded_sans | system | technical_mono
    typography: 'default', // classic | compact | default | display | editorial | luxury | modern | playful | technical
  },

  // Component sections below are optional.
  // Individual values may be omitted, null, or undefined.
  // The resolver will fall back to the relevant global value or library default.

  // Values are left here as a reference for available options.
  button: {
    pack: null, // default | lux | classic | minimal | block | soft | null
    radius: 'square', // square | soft | rounded | pill | null
    density: null, // compact | comfortable | spacious | null
    motion: null, // none | reduced | normal | expressive | null
  },

  badge: {
    pack: null, // default | lux | classic | minimal | block | soft | null
    radius: null, // square | soft | rounded | pill | null
    density: null, // compact | comfortable | spacious | null
  },

  input: {
    pack: null, // default | lux | classic | minimal | block | soft | null
    radius: null, // square | soft | rounded | pill | null
    density: null, // compact | comfortable | spacious | null
  },

  card: {
    pack: null, // default | lux | classic | minimal | block | soft | null
    radius: null, // square | soft | rounded | pill | null
    density: null, // compact | comfortable | spacious | null
    motion: null, // none | reduced | normal | expressive | null
  },

  accordion: {
    pack: null,
    radius: null,
    density: null,
    motion: null,
  },

  section: {
    pack: null, // default | lux | classic | minimal | block | soft | null
    density: null, // compact | comfortable | spacious | null
  },

  navbar: {
    pack: null, // default | lux | classic | minimal | block | soft | null
  },

  footer: {
    pack: null, // default | lux | classic | minimal | block | soft | null
  },

  toast: {
    pack: null, // default | lux | classic | minimal | block | soft | null
  },
}
// All these tokens are required.
export const projectThemeColors: ThemeColors = {
  // Brand
  brand: '#0ea5e9',
  brand_hover: '#0284c7',
  brand_active: '#0369a1',
  brand_soft: '#e0f2fe',
  brand_contrast: '#000000',
  brand_ring: '#0ea5e9',
  text_on_brand: '#000000',

  // Accent
  secondary: '#a855f7',

  // Semantic
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Backgrounds
  bg_canvas: '#f8fafc',
  bg_surface: '#ffffff',
  bg_elevated: '#ffffff',
  bg_field: '#ffffff',
  bg_muted: '#f1f5f9',
  bg_inverse: '#0f172a',
  bg_disabled: '#f1f5f9',

  // Text
  text_primary: '#0f172a',
  text_secondary: '#475569',
  text_muted: '#64748b',
  text_inverse: '#ffffff',
  text_disabled: '#94a3b8',

  // Borders
  border_default: '#e2e8f0',
  border_muted: '#cbd5e1',
  border_focus: '#0ea5e9',

  // Effects
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow_rgba: 'rgba(0, 0, 0, 0.35)',
}
