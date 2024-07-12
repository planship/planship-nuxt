import { addPlugin, addServerHandler, createResolver, defineNuxtModule } from '@nuxt/kit'

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
      handler: resolver.resolve('./runtime/tokenHandler'),
    })
    addPlugin({
      src: resolver.resolve('./runtime/planshipClientPlugin'),
      mode: 'client',
    })
    addPlugin({
      src: resolver.resolve('./runtime/planshipServerPlugin'),
      mode: 'server',
    })
  },
})
