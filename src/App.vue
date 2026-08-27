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

import { watch } from 'vue'
import { useSiteStore } from '@/stores/site.store'
import { useMaintenanceStore } from '@/stores/maintenance.store'
import { useUiConfigStore } from '@/stores/ui.store'
import { ToastViewport } from '@mwheeler91/ui'
import PageFallback from '@/components/PageFallback.vue'
import Loading from '@/views/Loading.vue'
import MaintenanceView from '@/views/MaintenanceView.vue'

const siteStore = useSiteStore()

function setFavicon(href: string | null) {
  if (!href) return
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = href
  link.type = href.endsWith('.svg') ? 'image/svg+xml' : 'image/*'
}

function updateDocumentMetadata() {
  const title = siteStore.seoDefaults?.meta_title?.trim() || siteStore.displayTitle?.trim() || 'Client Site'
  const suffix = siteStore.seoDefaults?.title_suffix?.trim()
  document.title = suffix && !title.endsWith(suffix) ? title + ' | ' + suffix : title
  const description = siteStore.seoDefaults?.meta_description?.trim()
  if (description) {
    let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }
  setFavicon(siteStore.faviconUrl)
}

watch([() => siteStore.displayTitle, () => siteStore.seoDefaults, () => siteStore.faviconUrl], updateDocumentMetadata, { immediate: true })
const maintenanceStore = useMaintenanceStore()
const uiConfigStore = useUiConfigStore()
siteStore.init({ standalone: false })

function retry() {
  maintenanceStore.clear()
  siteStore.initStatus = 'idle'
  siteStore.init({ standalone: false })
}
</script>
