# planship-nuxt

Welcome to `@planship/nuxt`, a [Nuxt module](https://nuxt.com/modules) that makes [Planship](https://planship.io) intergration with [Nuxt](https://nuxt.com) apps a breeze. This module is based on the [`@planship/vue`](https://github.com/planship/planship-vue) plugin and `@planship/fetch` library.

A complete, working example of a Nuxt app using the `@planship/nuxt` module can be found at https://github.com/planship/planship-nuxt-demo

## Getting started

Install `@planship/nuxt` with npm, yarn or pnpm:

```sh
npm install @planship/vue
# or
yarn add @planship/vue
# or
pnpm add @planship/vue
```

Then, add `@planship/nuxt` to the `modules` section of your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@planship/nuxt'],
})
```

Finally, configure your Planship product slug and authentication credentials inside `defineNuxtConfig` or via the environmental variables.

```ts
export default defineNuxtConfig({
  // ...
  planship: {
    // options
  }
}
```

### Options

#### `productSlug`

Your [Planship product slug](https://docs.planship.io/concepts/products/). The slug can be also defined via the `PLANSHIP_PRODUCT_SLUG` variable.

#### `clientId` and `clientSecret`

Your Planship [authentication credentials](https://docs.planship.io/integration/#authentication-and-security). They can be also defined via the `PLANSHIP_API_CLIENT_ID` and `PLANSHIP_API_CLIENT_SECRET` variables.

## Usage

### Composables

The `@planship/nuxt` module exports two composables implemented by the `@planship/vue` plugin: `usePlanshipCustomer` and `usePlanship`.

#### `usePlanshipCustomer`

Returns an instance of the [Planship Customer API client class](https://github.com/planship/planship-js/blob/master/packages/fetch/docs/interfaces/PlanshipCustomerApi.md) and customer entitlements.

```vue
<script setup>
import { usePlanshipCustomer } from '@planship/vue'

const { entitlements } = await usePlanshipCustomer('<CURRENT_USTOMER_ID>')

</script>

<template>
  <NuxtLink
    v-if="entitlements['advanced-analytics']"
    to="/analytics"
  >
    Analytics
  </NuxtLink>
</template>
```

For more details and usage example see the [`@planship/vue` README](https://github.com/planship/planship-vue).


#### `usePlanship`

Returns an intance of the [Planship API client class](https://github.com/planship/planship-js/blob/master/packages/fetch/docs/classes/Planship.md).

```vue
<script setup>
import { usePlanship } from '@planship/vue'

const { planshipApiClient } = usePlanship('<CURRENT_USTOMER_ID>')

const { data: plans } = await useAsyncData('plans', async () => {
  return await planshipApiClient.listPlans()
})

</script>
```

For more details and usage example see the [`@planship/vue` README](https://github.com/planship/planship-vue).

### Server services

All `@planship/nuxt` server services are available under `#planship/server` alias.

#### `useServerApiClient`

Returns an intance of the [Planship API client](https://github.com/planship/planship-js/blob/master/packages/fetch/docs/interfaces/PlanshipApi.md) that can be used in [server routes](https://nuxt.com/docs/guide/directory-structure/server#server-routes).

```ts
import { useServerApiClient } from '#planship/server'

export default defineEventHandler(async (event) => {
  const planship = useServerApiClient()
  const body = await readBody(event)

  // Report usage for api-call metering ID to Planship
  return planship.reportUsage(body.userId, 'api-call', body.count)
})
```

## Links

- [Planship Nuxt demo app](https://github.com/planship/planship-nuxt-demo)
- [Planship documentation](https://docs.planship.io)
- [Planship console](https://app.planship.io)
