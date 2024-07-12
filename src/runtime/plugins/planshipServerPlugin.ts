import { PlanshipPlugin } from '@planship/vue'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'
import type { NuxtApp } from '#app'

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.use(PlanshipPlugin, {
    slug: useRuntimeConfig().public.planship.productSlug,
    auth: {
      clientId: useRuntimeConfig().public.planship.clientId,
      clientSecret: useRuntimeConfig().planship.clientSecret,
    },
    useState,
    debugLogging: useRuntimeConfig().public.planship.debugLogging,
  })
})