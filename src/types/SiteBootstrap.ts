import type { ThemeColors } from '@mwheeler91/ui'
import type {
  ButtonAs,
  ButtonHtmlType,
  ButtonSize,
  ButtonVariant,
  ButtonWidth,
  NavbarActionVariant,
  NavbarPosition,
  NavbarSize,
  NavbarVariant,
  SharedFooterProps,
} from '@mwheeler91/ui'

export type Site = {
  name: string
  site_title: string | null
  tagline: string | null
  template_key: string | null
}

export type Branding = {
  logo_url: string | null
  favicon_url: string | null
  brand_mark: string | null
}

export type SeoDefaults = {
  meta_title: string
  meta_description: string
  title_suffix: string
  is_indexable: boolean
}

export type OgDefaults = {
  og_type: string | null
  og_image: string | null
  og_title: string | null
  og_description: string | null
  twitter_card: string | null
}

export type BusinessHours = {
  weekday: string
  open_time: string | null
  close_time: string | null
  text: string | null
  is_closed: boolean
  is_after_hours: boolean
  is_emergency_only: boolean
  is_appointment_only: boolean
}

export type Social = {
  name: string
  icon: string | null
  url: string
  username: string | null
  is_active: boolean
}

export type ApiComponentConfig = Record<string, string | number | boolean | null>

export type ApiNavbarButton = {
  href: string | null
  text: string
  config: ApiComponentConfig & {
    as: ButtonAs
    size: ButtonSize
    width: ButtonWidth
    variant: ButtonVariant
    html_type: ButtonHtmlType
  }
  meta_data: Record<string, unknown>
  vue_route: string | null
}

export type ApiNavbarImage = {
  image_url: string | null
  alt_text: string
  caption: string | null
  animation: number
}

export type ApiNavbarElements = {
  buttons: Record<string, ApiNavbarButton[]>
  images: Record<string, ApiNavbarImage[]>
}

export type ApiNavbar = {
  key: string
  config: ApiComponentConfig
  elements: ApiNavbarElements
}

export type ApiFooterText = {
  text: string
  config: ApiComponentConfig
  has_html: boolean
  meta_data: Record<string, unknown>
}

export type ApiFooterButton = ApiNavbarButton

export type ApiFooterElements = {
  text: Record<string, ApiFooterText[]>
  badges: Record<string, unknown[]>
  buttons: Record<string, ApiFooterButton[]>
  images: Record<string, ApiNavbarImage[]>
}

export type ApiFooter = {
  key: string | null
  config: ApiComponentConfig
  elements: ApiFooterElements
}

export type Footer = SharedFooterProps & {
  key: string
}

export type ApiUiConfig = {
  global: {
    font: string
    pack: string
    radius: string
    density: string
    typography: string
  }
}

export type ApiColorTheme = {
  name: string
  colors: ThemeColors
}

export type NavbarLink = {
  label: string
  href?: string
  to?: string
  external?: boolean
  disabled?: boolean
}

export type NavbarAction = NavbarLink & {
  variant?: NavbarActionVariant
}

export type Navbar = {
  key: string
  variant?: NavbarVariant
  size?: NavbarSize
  position?: NavbarPosition
  collapsible: boolean
  links: NavbarLink[]
  actions: NavbarAction[]
  elements: ApiNavbarElements
}

export type SiteBootstrapPayload = {
  site: Site
  branding: Branding
  seo_defaults: SeoDefaults
  og: OgDefaults
  color_theme: ApiColorTheme
  ui_config: ApiUiConfig
  navbar: ApiNavbar
  footer?: ApiFooter | Record<string, never>
  hours: BusinessHours[]
  socials: Social[]
}
