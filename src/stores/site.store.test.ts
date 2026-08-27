import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { defaultThemeColors } from '@mwheeler91/ui'
import type { SiteBootstrapPayload } from '@/types/SiteBootstrap'

const getSiteBootstrap = vi.hoisted(() => vi.fn())
const reportClientError = vi.hoisted(() => vi.fn())

vi.mock('@mwheeler91/site-core', () => ({ getSiteBootstrap, reportClientError }))

import { useSiteStore } from './site.store'
import { useColorThemeStore } from './theme.store'
import { useUiConfigStore } from './ui.store'

function makeButton(overrides: Record<string, unknown> = {}) {
  return {
    href: '#contact',
    text: 'Contact',
    config: {
      as: 'a',
      size: 'md',
      width: 'auto',
      variant: 'primary',
      html_type: 'button',
    },
    meta_data: {},
    vue_route: null,
    ...overrides,
  }
}

function makePayload(overrides: Record<string, unknown> = {}): SiteBootstrapPayload {
  return {
    site: {
      name: 'Example site',
      site_title: null,
      tagline: 'A useful tagline',
      template_key: 'default',
    },
    branding: {
      logo_url: null,
      favicon_url: null,
      brand_mark: 'EX',
    },
    seo_defaults: {
      meta_title: '',
      meta_description: '',
      title_suffix: '',
      is_indexable: true,
    },
    og: {
      og_type: null,
      og_image: null,
      og_title: null,
      og_description: null,
      twitter_card: null,
    },
    color_theme: {
      name: 'Default',
      colors: { ...defaultThemeColors },
    },
    ui_config: {
      global: {
        font: 'classic_sans',
        pack: 'default',
        radius: 'rounded',
        density: 'comfortable',
        typography: 'classic',
      },
    },
    navbar: {
      key: 'standard-navbar',
      config: { variant: 'standard', size: 'md', position: 'static', collapsible: true },
      elements: {
        buttons: {
          'nav-link': [makeButton()],
          'nav-action': [makeButton({ href: null, vue_route: '/contact', text: 'Discuss' })],
        },
        images: {},
      },
    },
    footer: {},
    hours: [],
    socials: [],
    ...overrides,
  } as SiteBootstrapPayload
}

function envelope(data: SiteBootstrapPayload, status = 200) {
  return { status, data }
}

describe('site store bootstrap', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    getSiteBootstrap.mockReset()
    reportClientError.mockReset()
  })

  it('normalizes a complete bootstrap payload and derives documented fallbacks', async () => {
    getSiteBootstrap.mockResolvedValue(envelope(makePayload({
      site: {
        name: 'Example site',
        site_title: 'Example title',
        tagline: 'Tagline',
        template_key: 'default',
      },
      hours: [
        { weekday: 'Monday', open_time: '09:00', close_time: '17:00', text: null, is_closed: false, is_after_hours: false, is_emergency_only: false, is_appointment_only: false },
        { weekday: 'Sunday', open_time: null, close_time: null, text: null, is_closed: true, is_after_hours: false, is_emergency_only: false, is_appointment_only: false },
      ],
      socials: [
        { name: 'Active', icon: null, url: 'https://example.com/active', username: null, is_active: true },
        { name: 'Inactive', icon: null, url: 'https://example.com/inactive', username: null, is_active: false },
      ],
    })))

    const store = useSiteStore()
    await store.init()

    expect(store.initStatus).toBe('ready')
    expect(store.displayTitle).toBe('Example title')
    expect(store.seoDefaults?.meta_title).toBe('Example title')
    expect(store.og?.og_title).toBe('Example title')
    expect(store.og?.og_type).toBe('website')
    expect(store.navbar?.links).toEqual([{ label: 'Contact', href: '#contact', external: false, disabled: false }])
    expect(store.navbar?.actions[0]).toMatchObject({ label: 'Discuss', to: '/contact' })
    expect(store.footer).toBeNull()
    expect(store.hours[0]).toMatchObject({ weekday: 'Monday' })
    expect(store.socials).toHaveLength(2)
  })

  it('does not partially apply malformed bootstrap data', async () => {
    getSiteBootstrap.mockResolvedValue(envelope(makePayload({
      ui_config: { global: { font: 'classic_sans' } },
    })))

    const store = useSiteStore()
    await store.init()

    expect(store.initStatus).toBe('failed')
    expect(store.site).toBeNull()
    expect(store.navbar).toBeNull()
    expect(useUiConfigStore().source).toBe('library')
    expect(useColorThemeStore().source).toBe('library')
    expect(reportClientError).toHaveBeenCalledOnce()
  })

  it('records API failure envelopes and can retry after failure', async () => {
    getSiteBootstrap
      .mockResolvedValueOnce({ status: 503, title: 'Unavailable', errors: ['Try again later'] })
      .mockResolvedValueOnce(envelope(makePayload()))

    const store = useSiteStore()
    await store.init()

    expect(store.initStatus).toBe('failed')
    expect(store.initTitle).toBe('Unavailable')
    expect(store.initMessages).toEqual(['Try again later'])

    await store.init()

    expect(store.initStatus).toBe('ready')
    expect(getSiteBootstrap).toHaveBeenCalledTimes(2)
  })

  it('transitions a rejected bootstrap request to failed without retaining partial state', async () => {
    getSiteBootstrap.mockRejectedValue(new Error('Network unavailable'))

    const store = useSiteStore()
    await store.init()

    expect(store.isLoading).toBe(false)
    expect(store.hasError).toBe(true)
    expect(store.initMessages).toEqual(['Network unavailable'])
    expect(store.site).toBeNull()
    expect(store.navbar).toBeNull()
  })

  it('deduplicates concurrent initialization and does not reload a ready store', async () => {
    let resolveRequest!: (value: unknown) => void
    getSiteBootstrap.mockReturnValue(new Promise((resolve) => { resolveRequest = resolve }))

    const store = useSiteStore()
    const first = store.init()
    const second = store.init()

    expect(store.isLoading).toBe(true)
    expect(getSiteBootstrap).toHaveBeenCalledOnce()

    resolveRequest(envelope(makePayload()))
    await Promise.all([first, second])
    await store.init()

    expect(store.initDone).toBe(true)
    expect(getSiteBootstrap).toHaveBeenCalledOnce()
  })

  it('loads project UI and theme configuration without calling bootstrap in standalone mode', async () => {
    const store = useSiteStore()
    await store.init({ standalone: true })

    expect(store.initDone).toBe(true)
    expect(store.initTitle).toBe('Standalone site loaded')
    expect(useUiConfigStore().source).toBe('project')
    expect(useColorThemeStore().source).toBe('project')
    expect(getSiteBootstrap).not.toHaveBeenCalled()
  })
})
