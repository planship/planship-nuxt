import type { TokenResponse } from '@planship/fetch'
import usePlanshipApiClient from '../../composables/usePlanshipApiClient'
import { defineEventHandler } from '#imports'

export default defineEventHandler(() => {
  const planship = usePlanshipApiClient()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
