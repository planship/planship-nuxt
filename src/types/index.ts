declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    planship: {
      productSlug: string
      clientId: string
      debugLogging?: boolean
    }
  }

  interface RuntimeConfig {
    planship: {
      clientSecret: string
    }
  }
}
