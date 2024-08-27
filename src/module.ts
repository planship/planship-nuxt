import { addPlugin, addServerHandler, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  productSlug: string
  clientId: string
  clientSecret: string
  debugLogging: boolean
}

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@planship/nuxt',
    configKey: 'planship',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    productSlug: process.env.PLANSHIP_PRODUCT_SLUG as string,
    clientId: process.env.PLANSHIP_API_CLIENT_ID as string,
    clientSecret: process.env.PLANSHIP_API_CLIENT_SECRET as string,
    debugLogging: false,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.planship = defu(nuxt.options.runtimeConfig.public.planship, {
      productSlug: options.productSlug,
      clientId: options.clientId,
      debugLogging: options.debugLogging,
    })

    nuxt.options.runtimeConfig.planship = defu(nuxt.options.runtimeConfig.planship, {
      clientSecret: options.clientSecret,
    })

    if (!nuxt.options.runtimeConfig.public.planship.productSlug) {
      console.error('Planship product slug is missing, set it in `nuxt.config.js` or via the PLANSHIP_PRODUCT_SLUG environment variable')
    }
    if (!nuxt.options.runtimeConfig.public.planship.clientId || !nuxt.options.runtimeConfig.planship.clientSecret) {
      console.error('Planship client credentials are missing, set them in `nuxt.config.js` or via the PLANSHIP_API_CLIENT_ID and PLANSHIP_API_CLIENT_SECRET environment variables')
    }

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

    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolver.resolve('./runtime/composables'))
    })

    nuxt.hook('nitro:config', (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias['#planship/server'] = resolver.resolve('./runtime/server/services')
    })

    addTemplate({
      filename: 'types/planship.d.ts',
      getContents: () =>
        [
          'declare module \'#planship/server\' {',
          `  const useServerApiClient: typeof import('${resolver.resolve('./runtime/server/services')}').useServerApiClient`,
          '}',
        ].join('\n'),
    })
  },
})
