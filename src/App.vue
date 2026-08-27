<template>
  <MaintenanceView v-if="maintenanceStore.active" :message="maintenanceStore.message" />

  <div
    v-else-if="siteStore.initStatus === 'idle' || siteStore.initStatus === 'loading'"
    class="min-h-screen flex items-center justify-center px-4"
    v-bind="uiConfigStore.themeAttrs"
  >
    <Loading />
  </div>

  <PageFallback
    v-else-if="siteStore.initStatus === 'failed'"
    v-bind="uiConfigStore.themeAttrs"
    title="We’re having a little trouble"
    message="This page is taking a moment to get ready. We’ll have you back on track soon."
    :onRetry="retry"
    homeHref="/"
  />

  <div v-else class="min-h-screen" v-bind="uiConfigStore.themeAttrs">
    <router-view />

    <ToastViewport position="top-center" />
  </div>
</template>

<script setup lang="ts">

import { useSiteStore } from '@/stores/site.store'
import { useMaintenanceStore } from '@/stores/maintenance.store'
import { useUiConfigStore } from '@/stores/ui.store'
import { ToastViewport } from '@mwheeler91/ui'
import PageFallback from '@/components/PageFallback.vue'
import Loading from '@/views/Loading.vue'
import MaintenanceView from '@/views/MaintenanceView.vue'

const siteStore = useSiteStore()
const maintenanceStore = useMaintenanceStore()
const uiConfigStore = useUiConfigStore()
siteStore.init({ standalone: false })

function retry() {
  maintenanceStore.clear()
  siteStore.initStatus = 'idle'
  siteStore.init({ standalone: false })
}
</script>
