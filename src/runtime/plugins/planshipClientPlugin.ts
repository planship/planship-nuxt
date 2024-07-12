import { PlanshipPlugin } from '@planship/vue'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'
import type { NuxtApp } from '#app'

async function getAccessToken() {
  return fetch('/api/planship/token').then(response => response.text())
}

export default defineNuxtPlugin((nuxtApp: NuxtApp) => {
  nuxtApp.vueApp.use(
    PlanshipPlugin,
    {
      slug: useRuntimeConfig().public.planship.productSlug,
      auth: getAccessToken,
      useState,
      debugLogging: useRuntimeConfig().public.planship.debugLogging,
    },
  )
})