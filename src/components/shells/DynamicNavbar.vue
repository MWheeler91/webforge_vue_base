<template>
  <component
    :is="NavbarComponent"
    :brand="brand"
    :links="navbar.links"
    :actions="navbar.actions"
    :variant="navbar.variant"
    :size="navbar.size"
    :position="navbar.position"
    :collapsible="navbar.collapsible"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { resolveNavbarComponent } from '@mwheeler91/ui'

import type { Branding, Navbar, Site } from '@/types/SiteBootstrap'
import type { NavbarBrandData } from '@mwheeler91/ui'

const props = defineProps<{
  site: Site
  branding: Branding
  navbar: Navbar
}>()

const NavbarComponent = computed(() => {
  return resolveNavbarComponent(props.navbar.key)
})

const brand = computed<NavbarBrandData>(() => {
  const label = props.site.site_title || props.site.name

  return {
    label,
    href: '/',
    image: props.branding.logo_url ?? undefined,
    imageAlt: `${label} logo`,
    showLabel: true,
    imagePosition: 'left',
  }
})
</script>
