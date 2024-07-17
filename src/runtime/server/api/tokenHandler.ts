import type { TokenResponse } from '@planship/fetch'
import { useServerApiClient } from '../services'
import { defineEventHandler } from '#imports'

export default defineEventHandler(() => {
  const planship = useServerApiClient()
  return planship.getAccessToken().then((tokenData: TokenResponse) => tokenData.accessToken)
})
