import { PlanshipPlugin } from '@planship/vue'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PlanshipPlugin, {
    slug: useRuntimeConfig().public.planshipProductSlug,
    auth: {
      clientId: useRuntimeConfig().public.planshipApiClientId,
      clientSecret: useRuntimeConfig().planshipApiClientSecret,
    },
    useState,
  })
})
