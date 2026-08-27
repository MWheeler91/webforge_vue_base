<template>
  <div v-bind="themeAttrs" class="site-shell">
    <DynamicNavbar
      v-if="site && branding && navbar"
      :site="site"
      :branding="branding"
      :navbar="navbar"
    />

    <main class="site-shell__main">
      <slot />
    </main>

    <DynamicFooter
      v-if="footer"
      :footer="footer"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

import DynamicFooter from '@/components/shells/DynamicFooter.vue'
import DynamicNavbar from '@/components/shells/DynamicNavbar.vue'
import { useSiteStore } from '@/stores/site.store'
import { useUiConfigStore } from '@/stores/ui.store'

const siteStore = useSiteStore()
const uiConfigStore = useUiConfigStore()

const {
  site,
  branding,
  navbar,
  footer,
} = storeToRefs(siteStore)

const {
  themeAttrs,
} = storeToRefs(uiConfigStore)
</script>
