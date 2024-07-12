import { PlanshipPlugin } from '@planship/vue'

async function getAccessToken() {
  return fetch('/api/planship/token').then(response => response.text())
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(
    PlanshipPlugin,
    {
      slug: 'clicker-demo',
      auth: getAccessToken,
      useState,
    },
  )
})
