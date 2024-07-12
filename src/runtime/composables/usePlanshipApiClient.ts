import { Planship } from '@planship/fetch'
import { useRuntimeConfig } from '#imports'

let planshipClient: Planship

async function getAccessToken() {
  return fetch('/api/planshipToken').then(response => response.text())
}

function getPlanshipClient() {
  if (!planshipClient) {
    if (import.meta.server) {
      planshipClient = new Planship(
        useRuntimeConfig().public.planshipProductSlug,
        {
          clientId: useRuntimeConfig().public.planshipApiClientId,
          clientSecret: useRuntimeConfig().planshipApiClientSecret,
        },
      )
    }
    else {
      planshipClient = new Planship(
        useRuntimeConfig().public.planshipProductSlug,
        getAccessToken,
      )
    }
  }

  return planshipClient
}

export default function () {
  return getPlanshipClient()
}
