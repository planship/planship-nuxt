import type { TokenResponse } from '@planship/fetch'
import usePlanshipApiClient from '~/composables/usePlanshipApiClient.ts'

export default defineEventHandler(() => {
  const planship = usePlanshipApiClient()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
