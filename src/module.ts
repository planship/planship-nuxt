import { addPlugin, addServerHandler, createResolver, defineNuxtModule, addImports } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@planship/nuxt',
    configKey: 'planship-nuxt',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)
    addServerHandler({
      route: '/api/planship/token',
      handler: resolver.resolve('./runtime/server/api/tokenHandler'),
    })
    addPlugin({
      src: resolver.resolve('./runtime/plugins/planshipClientPlugin'),
      mode: 'client',
    })
    addPlugin({
      src: resolver.resolve('./runtime/plugins/planshipServerPlugin'),
      mode: 'server',
    })
    addImports({
      from: resolver.resolve('./runtime/composables/usePlanshipApiClient'),
      name: 'usePlanshipApiClient',
      as: 'usePlanshipApiClient',
    })
  },
})
