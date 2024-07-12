import { PlanshipPlugin } from '@planship/vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PlanshipPlugin, {
    slug: 'clicker-demo',
    auth: {
      clientId: useRuntimeConfig().public.planshipApiClientId,
      clientSecret: useRuntimeConfig().planshipApiClientSecret,
    },
    useState,
  })
})
