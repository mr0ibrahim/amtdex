export interface AmtdexRuntimeConfig {
  apiUrl?: string
  csrfToken?: string
  appName?: string
  basename?: string
  blogSubdomain?: string
  isBlogSubdomain?: boolean
  dashboardDomain?: string
  isDashboardHost?: boolean
  publicHost?: string
  host?: string
  scheme?: string
  googleSiteVerification?: string
}

export interface CmsVisibilityDocument {
  copy?: Record<string, string>
  pages?: { path: string; label: string; published: boolean; seoTitle: string; seoDescription: string }[]
  nav?: { id: string; label: string; to: string; visible: boolean }[]
  homeSections?: { id: string; label: string; visible: boolean; image?: string; fields: Record<string, string> }[]
}

declare global {
  interface Window {
    __AMTDEX_CONFIG__?: AmtdexRuntimeConfig
    __CMS_VISIBILITY__?: CmsVisibilityDocument
  }
}

