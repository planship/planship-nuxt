import { Planship } from '@planship/fetch'
import { useRuntimeConfig } from '#imports'

let planshipClient: Planship

export function useServerApiClient() {
  if (!planshipClient) {
    planshipClient = new Planship(
      useRuntimeConfig().public.planship.productSlug,
      {
        clientId: useRuntimeConfig().public.planship.clientId,
        clientSecret: useRuntimeConfig().planship.clientSecret,
      },
      {
        debugLogging: useRuntimeConfig().public.planship.debugLogging,
        baseUrl: useRuntimeConfig().public.planship.baseUrl,
        webSocketUrl: useRuntimeConfig().public.planship.webSocketUrl,
      },
    )
  }

  return planshipClient
}
