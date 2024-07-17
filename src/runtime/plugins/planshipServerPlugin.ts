import { PlanshipPlugin } from '@planship/vue'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PlanshipPlugin, {
    slug: useRuntimeConfig().public.planship.productSlug,
    auth: {
      clientId: useRuntimeConfig().public.planship.clientId,
      clientSecret: useRuntimeConfig().planship.clientSecret,
    },
    useState,
  })
})
