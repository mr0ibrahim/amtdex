export interface AmtdexRuntimeConfig {
  apiUrl?: string
  csrfToken?: string
  appName?: string
  basename?: string
  blogSubdomain?: string
  isBlogSubdomain?: boolean
  host?: string
  scheme?: string
}

declare global {
  interface Window {
    __AMTDEX_CONFIG__?: AmtdexRuntimeConfig
  }
}

