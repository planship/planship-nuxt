# planship-nuxt

Welcome to `@planship/nuxt`, a [Nuxt module](https://nuxt.com/modules) that makes [Planship](https://planship.io) intergration with [Nuxt](https://nuxt.com) apps a breeze. This module is based on the [`@planship/vue`](https://github.com/planship/planship-vue) plugin and [`@planship/fetch`](https://github.com/planship/planship-js/tree/master/packages/fetch) library.

A complete, working example of a Nuxt app that used the `@planship/nuxt` module can be found at https://github.com/planship/planship-nuxt-demo

# Getting started

Install `@planship/nuxt` with npm, yarn or pnpm:

```sh
npm install @planship/nuxt
# or
yarn add @planship/nuxt
# or
pnpm add @planship/nuxt
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
    productSlug: '<YOUR_PLANSHIP_PRODUCT_SLUG',
    clientId: '<YOUR_PLANSHIP_API_CLIENT_ID>',
    clientSecret: '<YOUR_PLANSHIP_API_CLIENT_SECRET>',
  }
}
```

### Configurtation options

***`productSlug`***

Your [Planship product slug](https://docs.planship.io/concepts/products/). The slug can be also defined via the `PLANSHIP_PRODUCT_SLUG` variable.

***`clientId`*** and ***`clientSecret`***

Your Planship [authentication credentials](https://docs.planship.io/integration/#authentication-and-security). They can be also defined via the `PLANSHIP_API_CLIENT_ID` and `PLANSHIP_API_CLIENT_SECRET` variables.

# Usage

## Composables

The `@planship/nuxt` module exports two composables implemented by the `@planship/vue` plugin: `usePlanshipCustomer` and `usePlanship`. The `@planship/vue` plugin is universal-mode friendly, meaning that these composables can be used for both server and client side rendering.

### Working with entitlements and other customer data - `usePlanshipCustomer`

In most rendering scenarios, your app will need to fetch and evaluate Planship entitlements for a specific customer. This can be accomplished with the Planship plugin and the `usePlanshipCustomer` function, which initializes a Planship API instance for a specific customer, continously fetches their `entitlements`, and exposes them in a reactive [Vue ref object](https://vuejs.org/api/reactivity-core.html#ref).

The example below shows how customer entitlements are retrieved, and a simple boolean feature called `advanced-analytics` is used to conditionally render a `<NuxtLink>` element inside a Vue component.

```vue
<script setup>
  import { usePlanshipCustomer } from '@planship/nuxt'

  const { entitlements } = await usePlanshipCustomer('<CURRENT_CUSTOMER_ID>')
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

When `usePlanshipCustomer` is used on the client-side, entitlements are automatically updated via a WebSocket connection every time they change.

When used in the universal rendering mode, the data is fetched in the following fashion:
1. The plugin is initialized on the server and Planship entitlements and subscription data are fetched so they can be used for server-side rendering.
2. The plugin is initialized on the client using the data already fetched on the server.
3. THe pluging re-hydrates itslef on the client, and initiates a websocket connection for continuous entitlements updates from Planship.

#### Composite return value for both `sync` and `async` operations

The `usePlanshipCustomer` function returns a composite result that is both a promise and a data object the promise resolves to. This means that the function can be called both as a synchronous function or an asynchronous one using `await` (or `then/catch` chain).

If you want to block code execution until customer entitlements are fetched from the Planship API, call the function with `await`:

```ts
const { entitlements } = await usePlanshipCustomer('<CURRENT_CUSTOMER_ID>')
```

If you want to return immediately and let entitlements be fetched asynchronously, call `usePlanshipCustomer` as a synchronous function:

```ts
const { entitlements } = usePlanshipCustomer('<CURRENT_CUSTOMER_ID>')
```

Since `entitlements` is a reactive Vue Ref object, you can use it in your component and page templates and let Nuxt automatically rerender once the entitlements are fetched.

#### Fetching additional data from Planship

Your app may need to fetch additional customer data from Planship (E.g. customer subscription or usage data). To accomplish any Planship API operation use an instance of the [Planship Customer API client](https://github.com/planship/planship-js/blob/master/packages/fetch/docs/interfaces/PlanshipCustomerApi.md) returned by the `usePlanshipCustomer` function.

Below is an example Nuxt setup script that retrieves a list of subscriptions for the current customer using Nuxt's `useAsyncData`.

```vue
<script setup>
  import { usePlanshipCustomer } from '@planship/nuxt'

  const { planshipCustomerApiClient } = await usePlanshipCustomer('<CURRENT_CUSTOMER_ID>')

  const { data: subscriptions } = await useAsyncData('subscriptions', async () => {
    return await planshipCustomerApiClient.listSubscriptions()
  })
</script>
```

#### Strongly typed entitlement object

When working with the entitlements dictionary returned by `usePlanshipCustomer`, it can be useful to wrap it in an object with getters for individual levers. This is especially advantageous in IDEs like VS Code where it enables autocomplete for `entitlements`.

To accomplish this, define an entitlements class for your product, and pass it to `usePlanshipCustomer`.

```vue
<script setup>
  import { usePlanshipCustomer, EntitlementsBase } from '@planship/nuxt'

  class MyEntitlements extends EntitlementsBase {
    get apiCallsPerMonth(): number {
      return this.entitlementsDict?.['api-calls-per-month'].valueOf()
    }

    get advancedAnalytics(): boolean {
      return this.entitlementsDict?.['advanced-analytics']
    }
  }

  // entitlements is of Ref<MyEntitlements> type
  const { entitlements } = await usePlanshipCustomer('<CURRENT_CUSTOMER_ID>', MyEntitlements)
</script>

<template>
  <NuxtLink
    v-if="entitlements.advancedAnalytics"
    to="/analytics"
  >
    Analytics
  </NuxtLink>
</template>
```

### Working with plans and other product data - `usePlanship`

If the current customer context is unknown, the `usePlanship` function can retrieve a [Planship API client](https://github.com/planship/planship-js/blob/master/packages/fetch/docs/interfaces/PlanshipApi.md). It exposes the same functionality as the Planship customer API client provided by `usePlanshipCustomer`, but all customer operations (E.g. fetching entitlements and subscriptions) require a Planship customer ID as an argument.

Below is an example Nuxt setup script that retrieves a list of Planship plans using Nuxt's `useAsyncData`.

```vue
<script setup>
  import { usePlanship } from '@planship/nuxt'

  const { planshipApiClient } = usePlanship('<CURRENT_CUSTOMER_ID>')

  const { data: plans } = await useAsyncData('plans', async () => {
    return await planshipApiClient.listPlans()
  })
</script>
```


## Server services

Since `usePlanshipCustomer` and `usePlanship` composables use the [Vue provide/inject mechanism](https://vuejs.org/guide/components/provide-inject), they can be used in application components only. To simplify consuming Planship data outside of component code (E.g. [server routes](https://nuxt.com/docs/guide/directory-structure/server#server-routes)), the `@planship/nuxt` module provides the `useServerApiClient` server service available within the `#planship/server` alias.

Below is the example of a Nuxt API endpoint that reports metered usage to the Planship API using a Planship API client retrieved via the `useServerApiClient` server service function.

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
