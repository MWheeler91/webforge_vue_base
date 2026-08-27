// Manages the active color token set for the UI library.
//
// Colors can come from several places:
// - the UI library defaults
// - the local project config
// - the Django bootstrap API
// - a saved theme selected by the user/admin
//
// Every full theme replacement goes through setColors(). This keeps the
// Pinia state and the applied CSS variables using the same source of truth.

import { defineStore } from 'pinia'
import { ref, toRaw } from 'vue'

import { projectThemeColors } from '@/config/uiConfig'
import { defaultThemeColors } from '@mwheeler91/ui'
import { applyThemeColors, resolveThemeColors } from '@mwheeler91/ui'

import type { ColorThemeSource, PartialThemeColors, ThemeColors } from '@mwheeler91/ui'

export interface ApplyColorThemeOptions {
  source?: ColorThemeSource
  name?: string | null
}

// Creates a plain copy of the color token map.
//
// Pinia/Vue wraps state in proxies. toRaw() strips that wrapper before
// copying the object, which keeps the stored token map predictable.
function cloneColors(colors: ThemeColors): ThemeColors {
  return {
    ...toRaw(colors),
  }
}

export const useColorThemeStore = defineStore('colorTheme', () => {
  // Tracks where the active color theme came from.
  const source = ref<ColorThemeSource>('library')

  // Active color token map.
  const colors = ref<ThemeColors>(cloneColors(defaultThemeColors))

  // Display name for the active saved/API theme.
  const activeThemeName = ref<string | null>(null)

  // Shared apply path for all color theme sources.
  function setColors(config: PartialThemeColors | null, options: ApplyColorThemeOptions = {}) {
    source.value = options.source ?? 'api'
    activeThemeName.value = options.name ?? null

    colors.value = cloneColors(resolveThemeColors(config))
    applyThemeColors(colors.value)
  }

  // Loads the built-in UI library color defaults.
  function initLibraryColors() {
    setColors(defaultThemeColors, {
      source: 'library',
      name: null,
    })
  }

  // Loads the local project color config. Used when the app does not use a Django backend
  function initProjectColors(config: PartialThemeColors = projectThemeColors) {
    setColors(config, {
      source: 'project',
      name: null,
    })
  }

  // Loads colors from the Django/API bootstrap payload.
  function initFromApi(config: PartialThemeColors, themeName?: string | null) {
    setColors(config, {
      source: 'api',
      name: themeName ?? null,
    })
  }

  // Applies a saved color theme selected from a list.
  function applySavedTheme(config: PartialThemeColors, themeName: string) {
    setColors(config, {
      source: 'saved',
      name: themeName,
    })
  }

  // Updates only part of the active color theme.
  function patchColors(config: PartialThemeColors) {
    colors.value = {
      ...colors.value,
      ...toRaw(config),
    }

    applyThemeColors(colors.value)
  }

  return {
    source,
    colors,
    activeThemeName,

    setColors,
    initLibraryColors,
    initProjectColors,
    initFromApi,
    applySavedTheme,
    patchColors,
  }
})
