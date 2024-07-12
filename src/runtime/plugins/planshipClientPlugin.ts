import { PlanshipPlugin } from '@planship/vue'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'

async function getAccessToken() {
  return fetch('/api/planship/token').then(response => response.text())
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    PlanshipPlugin,
    {
      slug: useRuntimeConfig().public.planshipProductSlug,
      auth: getAccessToken,
      useState,
    },
  )
})
