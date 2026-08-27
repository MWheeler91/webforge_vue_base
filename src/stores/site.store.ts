import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { getSiteBootstrap } from '@mwheeler91/site-core'
import { defaultThemeColors } from '@mwheeler91/ui'
import { reportClientError } from '@mwheeler91/site-core'
import { useColorThemeStore } from '@/stores/theme.store'
import { useUiConfigStore } from '@/stores/ui.store'

import type { ThemeColors } from '@mwheeler91/ui'
import type { PartialUiConfig } from '@mwheeler91/ui'
import type {
  ApiNavbar,
  ApiNavbarButton,
  ApiNavbarElements,
  ApiFooter,
  ApiFooterButton,
  ApiUiConfig,
  Branding,
  BusinessHours,
  Footer,
  Navbar,
  NavbarAction,
  NavbarLink,
  OgDefaults,
  SeoDefaults,
  Site,
  SiteBootstrapPayload,
  Social,
} from '@/types/SiteBootstrap'

type InitStatus = 'idle' | 'loading' | 'ready' | 'failed'

const USE_DJANGO_BOOTSTRAP = true
const REQUIRED_UI_GLOBAL_FIELDS = ['font', 'pack', 'radius', 'density', 'typography'] as const
const REQUIRED_COLOR_FIELDS = Object.keys(defaultThemeColors) as (keyof ThemeColors)[]

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function hasValue(value: unknown): boolean {
  return typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined
}

function hasOwn(value: unknown, key: string): boolean {
  return isObject(value) && Object.prototype.hasOwnProperty.call(value, key)
}

function requireKeys(value: unknown, path: string, keys: string[], missing: string[]) {
  if (!isObject(value)) {
    missing.push(path)
    return
  }

  for (const key of keys) {
    if (!hasOwn(value, key)) missing.push(`${path}.${key}`)
  }
}

function validateElementMap(value: unknown, path: string, missing: string[]) {
  if (!isObject(value)) return

  for (const [key, elements] of Object.entries(value)) {
    if (!Array.isArray(elements)) missing.push(`${path}.${key}`)
  }
}

function validateNavbarButtons(value: unknown, missing: string[]) {
  if (!isObject(value)) return

  const buttons = [
    ...(Array.isArray(value['nav-link']) ? value['nav-link'] : []),
    ...(Array.isArray(value['nav-action']) ? value['nav-action'] : []),
  ]

  buttons.forEach((button, index) => {
    const path = `navbar.elements.buttons[${index}]`
    requireKeys(
      button,
      path,
      ['config', 'href', 'text', 'meta_data', 'vue_route'],
      missing,
    )

    if (!isObject(button)) return
    if (!hasValue(button.text)) missing.push(`${path}.text`)
    requireKeys(
      button.config,
      `${path}.config`,
      ['as', 'size', 'width', 'variant', 'html_type'],
      missing,
    )

    const hasHref = hasValue(button.href)
    const hasVueRoute = hasValue(button.vue_route)
    if (hasHref === hasVueRoute) missing.push(`${path}.href/vue_route`)
  })
}

function validateBootstrapPayload(payload: SiteBootstrapPayload): string[] {
  const missing: string[] = []

  requireKeys(
    payload,
    'payload',
    ['site', 'branding', 'seo_defaults', 'og', 'color_theme', 'ui_config', 'navbar', 'hours', 'socials'],
    missing,
  )
  requireKeys(
    payload.site,
    'site',
    ['name', 'site_title', 'tagline', 'template_key'],
    missing,
  )
  requireKeys(payload.branding, 'branding', ['logo_url', 'favicon_url', 'brand_mark'], missing)
  requireKeys(payload.seo_defaults, 'seo_defaults', ['meta_title', 'meta_description', 'title_suffix', 'is_indexable'], missing)
  requireKeys(payload.og, 'og', ['og_type', 'og_image', 'og_title', 'og_description', 'twitter_card'], missing)
  requireKeys(payload.navbar, 'navbar', ['key', 'config', 'elements'], missing)

  if (!isObject(payload.site) || !hasValue(payload.site.name)) missing.push('site.name')
  if (!isObject(payload.navbar) || !hasValue(payload.navbar.key)) missing.push('navbar.key')
  if (!isObject(payload.ui_config?.global)) missing.push('ui_config.global')

  const elements = payload.navbar?.elements
  if (!isObject(payload.navbar?.config)) missing.push('navbar.config')
  requireKeys(elements, 'navbar.elements', ['buttons', 'images'], missing)
  validateElementMap(elements?.buttons, 'navbar.elements.buttons', missing)
  validateElementMap(elements?.images, 'navbar.elements.images', missing)
  validateNavbarButtons(elements?.buttons, missing)

  const footer = payload.footer
  if (isObject(footer) && Object.keys(footer).length > 0) {
    requireKeys(footer, 'footer', ['key', 'config', 'elements'], missing)
    requireKeys(footer.elements, 'footer.elements', ['text', 'badges', 'buttons', 'images'], missing)
    validateElementMap(footer.elements?.text, 'footer.elements.text', missing)
    validateElementMap(footer.elements?.badges, 'footer.elements.badges', missing)
    validateElementMap(footer.elements?.buttons, 'footer.elements.buttons', missing)
    validateElementMap(footer.elements?.images, 'footer.elements.images', missing)
  }

  for (const field of REQUIRED_UI_GLOBAL_FIELDS) {
    if (!hasValue(payload.ui_config?.global?.[field])) missing.push(`ui_config.global.${field}`)
  }

  if (!isObject(payload.color_theme)) missing.push('color_theme')
  if (!hasValue(payload.color_theme?.name)) missing.push('color_theme.name')

  for (const field of REQUIRED_COLOR_FIELDS) {
    if (!hasValue(payload.color_theme?.colors?.[field])) missing.push(`color_theme.colors.${field}`)
  }

  return missing
}

function normalizeUiConfig(config: ApiUiConfig): PartialUiConfig {
  const global = Object.fromEntries(
    Object.entries(config.global).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.replace(/-/g, '_') : value,
    ]),
  )

  return { ...config, global } as PartialUiConfig
}

function navButtonToLink(button: ApiNavbarButton): NavbarLink | null {
  const label = button.text?.trim()
  if (!label) return null

  const link: NavbarLink = {
    label,
    disabled: false,
  }

  if (button.vue_route?.trim()) {
    link.to = button.vue_route.trim()
  } else if (button.href?.trim()) {
    link.href = button.href.trim()
    link.external = !button.href.trim().startsWith('#')
  } else {
    return null
  }

  return link
}

function navButtonToAction(button: ApiNavbarButton): NavbarAction | null {
  const link = navButtonToLink(button)
  if (!link) return null

  const action: NavbarAction = { ...link }
  const variant = button.config.variant?.replace(/-/g, '_')
  if (['primary', 'secondary', 'ghost', 'danger', 'success', 'warning'].includes(variant ?? '')) {
    action.variant = variant as NavbarAction['variant']
  }

  return action
}

function normalizeNavbar(apiNavbar: ApiNavbar): Navbar {
  const elements: ApiNavbarElements = apiNavbar.elements
  const config = apiNavbar.config
  const buttons = elements.buttons
  const links = (buttons['nav-link'] ?? [])
    .map(navButtonToLink)
    .filter((link): link is NavbarLink => link !== null)
  const actions = (buttons['nav-action'] ?? [])
    .map(navButtonToAction)
    .filter((action): action is NavbarAction => action !== null)

  return {
    key: apiNavbar.key,
    variant: config.variant as Navbar['variant'],
    size: config.size as Navbar['size'],
    position: config.position as Navbar['position'],
    collapsible: Boolean(config.collapsible),
    links,
    actions,
    elements,
  }
}

function footerButtonToLink(button: ApiFooterButton) {
  const label = button.text?.trim()
  if (!label) return null

  const href = button.vue_route?.trim() || button.href?.trim()
  if (!href) return null

  return {
    label,
    href,
    external: Boolean(button.href?.trim() && !button.href.trim().startsWith('#')),
  }
}

function footerLinks(elements: ApiFooter['elements']) {
  return Object.values(elements.buttons)
    .flat()
    .map(footerButtonToLink)
    .filter((link): link is NonNullable<ReturnType<typeof footerButtonToLink>> => link !== null)
}

function footerColumns(elements: ApiFooter['elements'], links: ReturnType<typeof footerLinks>) {
  const headers = elements.text.headers ?? elements.text.header ?? []

  if (!headers.length) {
    return links.length ? [{ links: { items: links } }] : []
  }

  const buttonGroups = Object.entries(elements.buttons)

  return headers.map((header, index) => {
    const headerText = header.text.trim()
    const matchingGroup =
      elements.buttons[headerText] ??
      elements.buttons[`column-${index + 1}`] ??
      buttonGroups[index]?.[1] ??
      []

    return {
      heading: { text: headerText, as: 'h3' as const },
      links: {
        items: matchingGroup
          .map(footerButtonToLink)
          .filter((link): link is NonNullable<ReturnType<typeof footerButtonToLink>> => link !== null),
      },
    }
  })
}

function footerHours(hours: BusinessHours[]) {
  const text = hours
    .filter((hour) => hour.text || hour.is_closed || hour.open_time || hour.close_time)
    .map((hour) => {
      if (hour.text) return `${hour.weekday}: ${hour.text}`
      if (hour.is_closed) return `${hour.weekday}: Closed`
      return `${hour.weekday}: ${hour.open_time ?? ''}-${hour.close_time ?? ''}`
    })
    .join(' · ')

  return text ? { text } : null
}

function normalizeFooter(
  apiFooter: ApiFooter | Record<string, never> | undefined,
  site: Site,
  branding: Branding,
  hours: BusinessHours[],
  socials: Social[],
): Footer | null {
  if (!isObject(apiFooter) || !isObject(apiFooter.elements)) return null

  const footerConfig = isObject(apiFooter.config) ? apiFooter.config : {}
  const elements = apiFooter.elements as ApiFooter['elements']
  const links = footerLinks(elements)
  const siteLabel = site.site_title?.trim() || site.name
  const hasLegal = footerConfig.has_legal !== false
  const hasCreated = footerConfig.has_created !== false

  return {
    key: hasValue(apiFooter.key) ? String(apiFooter.key) : 'minimal-footer',
    variant: footerConfig.variant as Footer['variant'],
    layout: footerConfig.layout as Footer['layout'],
    size: footerConfig.size as Footer['size'],
    brand: {
      label: siteLabel,
      href: '/',
      image: branding.logo_url ?? undefined,
      imageAlt: `${siteLabel} logo`,
      description: site.tagline?.trim() || undefined,
      showLabel: true,
    },
    links,
    columns: footerColumns(elements, links),
    socialLinks: socials
      .filter((social) => social.is_active && social.url)
      .map((social) => ({
        label: social.name,
        href: social.url,
        icon: social.icon ?? undefined,
        external: true,
      })),
    hours: footerHours(hours),
    legalText: hasLegal
      ? `© ${new Date().getFullYear()} ${siteLabel}. All rights reserved.`
      : null,
    created: hasCreated ? 'Created by your team' : null,
    divider: hasLegal,
  }
}

function normalizeSeoDefaults(site: Site, seo: SeoDefaults): SeoDefaults {
  const title = site.site_title?.trim() || site.name
  return {
    ...seo,
    meta_title: seo.meta_title?.trim() || title,
    meta_description: seo.meta_description?.trim() || '',
    title_suffix: seo.title_suffix?.trim() || '',
  }
}

function normalizeOgDefaults(site: Site, og: OgDefaults): OgDefaults {
  const title = site.site_title?.trim() || site.name
  return {
    og_type: og.og_type?.trim() || 'website',
    og_title: og.og_title?.trim() || title,
    og_description: og.og_description?.trim() || site.tagline?.trim() || '',
    og_image: og.og_image || null,
    twitter_card: og.twitter_card?.trim() || 'summary_large_image',
  }
}

export const useSiteStore = defineStore('site', () => {
  const initStatus = ref<InitStatus>('idle')
  const initTitle = ref('')
  const initMessages = ref<string[]>([])

  const site = ref<Site | null>(null)
  const branding = ref<Branding | null>(null)
  const seoDefaults = ref<SeoDefaults | null>(null)
  const og = ref<OgDefaults | null>(null)
  const navbar = ref<Navbar | null>(null)
  const footer = ref<Footer | null>(null)
  const hours = ref<BusinessHours[]>([])
  const socials = ref<Social[]>([])

  const initDone = computed(() => initStatus.value === 'ready')
  const isLoading = computed(() => initStatus.value === 'loading')
  const hasError = computed(() => initStatus.value === 'failed')

  const displayTitle = computed(() => site.value?.site_title?.trim() || site.value?.name || '')
  const tagline = computed(() => site.value?.tagline?.trim() || '')
  const logoUrl = computed(() => branding.value?.logo_url || null)
  const faviconUrl = computed(() => branding.value?.favicon_url || null)
  const public_key = computed(() => '')
  const template_key = computed(() => site.value?.template_key || '')

  async function init(options: { standalone?: boolean } = {}) {
    if (initStatus.value === 'loading' || initStatus.value === 'ready') return

    initStatus.value = 'loading'
    initTitle.value = ''
    initMessages.value = []

    if (options.standalone || !USE_DJANGO_BOOTSTRAP) {
      initStandalone()
      return
    }

    await initFromDjango()
  }

  function initStandalone() {
    useUiConfigStore().initProjectConfig()
    useColorThemeStore().initProjectColors()

    site.value = null
    branding.value = null
    seoDefaults.value = null
    og.value = null
    navbar.value = null
    footer.value = null
    hours.value = []
    socials.value = []

    initStatus.value = 'ready'
    initTitle.value = 'Standalone site loaded'
  }

  async function initFromDjango() {
    const uiConfigStore = useUiConfigStore()
    const colorThemeStore = useColorThemeStore()

    try {
      const apiEnvelope = await getSiteBootstrap()

      if (apiEnvelope.status !== 200 || !apiEnvelope.data) {
        initStatus.value = 'failed'
        initTitle.value = apiEnvelope.title || 'Site failed to load'
        initMessages.value = apiEnvelope.errors?.length
          ? apiEnvelope.errors
          : apiEnvelope.messages?.length
            ? apiEnvelope.messages
            : ['Unable to load site configuration.']
        return
      }

      const payload = apiEnvelope.data
      const missing = validateBootstrapPayload(payload)
      if (missing.length) {
        const error = new Error(`Invalid bootstrap configuration: ${missing.join(', ')}`)
        void reportClientError(error, 'bootstrap.validation', { missingFields: missing })
        throw error
      }

      const normalizedUiConfig = normalizeUiConfig(payload.ui_config)
      colorThemeStore.initFromApi(payload.color_theme.colors, payload.color_theme.name)
      uiConfigStore.initFromApi(normalizedUiConfig)

      site.value = payload.site
      branding.value = {
        logo_url: payload.branding.logo_url || null,
        favicon_url: payload.branding.favicon_url || null,
        brand_mark: payload.branding.brand_mark || null,
      }
      seoDefaults.value = normalizeSeoDefaults(payload.site, payload.seo_defaults)
      og.value = normalizeOgDefaults(payload.site, payload.og)
      hours.value = payload.hours
      socials.value = payload.socials
      navbar.value = normalizeNavbar(payload.navbar)
      footer.value = normalizeFooter(
        payload.footer,
        payload.site,
        branding.value,
        payload.hours,
        payload.socials,
      )

      initStatus.value = 'ready'
      initTitle.value = 'Site loaded successfully'
    } catch (error) {
      initStatus.value = 'failed'
      initTitle.value = 'Site failed to load'
      initMessages.value = [error instanceof Error ? error.message : 'Unable to load site configuration.']
    }
  }

  function resetInit() {
    initStatus.value = 'idle'
    initTitle.value = ''
    initMessages.value = []
  }

  function reset() {
    resetInit()
    site.value = null
    branding.value = null
    seoDefaults.value = null
    og.value = null
    navbar.value = null
    footer.value = null
    hours.value = []
    socials.value = []
  }

  return {
    initStatus,
    initTitle,
    initMessages,
    site,
    branding,
    seoDefaults,
    og,
    navbar,
    footer,
    hours,
    socials,
    initDone,
    isLoading,
    hasError,
    displayTitle,
    tagline,
    logoUrl,
    faviconUrl,
    public_key,
    template_key,
    init,
    initStandalone,
    initFromDjango,
    resetInit,
    reset,
  }
})
