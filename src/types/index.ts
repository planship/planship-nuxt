declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    planship: {
      productSlug: string
      clientId: string
      debugLogging?: boolean
      baseUrl?: string
      webSocketUrl?: string
    }
  }

  interface RuntimeConfig {
    planship: {
      clientSecret: string
    }
  }
}
