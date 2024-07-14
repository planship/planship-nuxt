import { Planship, type TokenResponse } from '@planship/fetch'
import { defineEventHandler, useRuntimeConfig } from '#imports'

let planshipClient: Planship

function getPlanshipClient() {
  if (!planshipClient) {
    planshipClient = new Planship(
      useRuntimeConfig().public.planship.productSlug,
      {
        clientId: useRuntimeConfig().public.planship.clientId,
        clientSecret: useRuntimeConfig().planship.clientSecret,
      },
    )
  }

  return planshipClient
}

export default defineEventHandler(() => {
  const planship = getPlanshipClient()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
