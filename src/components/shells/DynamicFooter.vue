<template>
  <component
    :is="FooterComponent"
    v-bind="footerProps"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { resolveFooterComponent } from '@mwheeler91/ui'

import type { Footer } from '@/types/SiteBootstrap'

const props = defineProps<{
  footer: Footer
}>()

const FooterComponent = computed(() => {
  return resolveFooterComponent(props.footer.key)
})

const footerProps = computed(() => {
  const { key: _key, ...footerProps } = props.footer
  return footerProps
})
</script>
