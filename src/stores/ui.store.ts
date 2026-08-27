// Manages the active UI configuration for component-level styling.
//
// This store handles the non-color side of theming:
// - global UI defaults like pack, radius, density, font, and typography
// - element-level overrides like button/card/input settings
// - resolved theme attributes used by the UI CSS
//
// The raw config can come from the library defaults, local project config,
// Django bootstrap payload, or another configured source. Regardless of source,
// everything goes through applyConfig() so state and runtime config stay aligned.

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { projectUiConfig } from '@/config/uiConfig'
import { buildUiThemeAttrs } from '@mwheeler91/ui'
import { resolveUiConfig } from '@mwheeler91/ui'
import { setUiConfig } from '@mwheeler91/ui'

import type { PartialUiConfig, UiConfig, UiConfigSource } from '@mwheeler91/ui'

// Creates a safe copy of an incoming partial config.
//
// The store keeps the raw override config separate from the resolved config.
// Cloning prevents outside callers from mutating store state by holding onto
// the same object reference.
function cloneConfig(config: PartialUiConfig | null | undefined): PartialUiConfig | null {
  return config ? structuredClone(config) : null
}

export const useUiConfigStore = defineStore('uiConfig', () => {
  // Tracks where the active UI config came from.
  const source = ref<UiConfigSource>('library')

  // Raw UI config override. Null means no override has been provided,
  // so the UI library defaults should be used by the resolver.
  const activeConfig = ref<PartialUiConfig | null>(null)

  // Full UI config after defaults and inherit/fallback rules are applied.
  const resolvedConfig = computed<UiConfig>(() => {
    return resolveUiConfig(activeConfig.value)
  })

  // Data attributes used by the UI CSS.
  const themeAttrs = computed<Record<string, string>>(() => {
    return buildUiThemeAttrs(resolvedConfig.value)
  })

  // Shared apply path for every UI config source.
  function applyConfig(config: PartialUiConfig | null, nextSource: UiConfigSource) {
    source.value = nextSource
    activeConfig.value = cloneConfig(config)
    setUiConfig(activeConfig.value)
  }

  // Uses the built-in UI library defaults.
  function initLibraryDefaults() {
    applyConfig(null, 'library')
  }

  // Uses the local project UI config.  Used when not using the Django API
  function initProjectConfig(config: PartialUiConfig | null = projectUiConfig) {
    applyConfig(config, 'project')
  }

  // Uses config loaded from the Django/API bootstrap payload.
  function initFromApi(config: PartialUiConfig | null) {
    applyConfig(config, 'api')
  }


  return {
    source,
    activeConfig,
    resolvedConfig,
    themeAttrs,

    applyConfig,
    initLibraryDefaults,
    initProjectConfig,
    initFromApi,
  }
})
