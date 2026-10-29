export interface AmtdexRuntimeConfig {
  apiUrl?: string
  csrfToken?: string
  appName?: string
  basename?: string
}

declare global {
  interface Window {
    __AMTDEX_CONFIG__?: AmtdexRuntimeConfig
  }
}

