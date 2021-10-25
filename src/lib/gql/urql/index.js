import { auth, isAuthenticated, verify, logout } from '$lib/stores/auth'
import { authExchange } from '@urql/exchange-auth'
import {
  initClient as urqlInit,
  dedupExchange,
  makeOperation,
  fetchExchange,
  ssrExchange,
  createClient,
} from '@urql/svelte'
import { cacheExchange } from '@urql/exchange-graphcache'
import { get } from 'svelte/store'
// import { devtoolsExchange } from '@urql/devtools' // ⚙ for dev only

export * from './utils'

import { GetTimeline } from '../GetTimeline'

// Used to track if the client has been initialized, which will only happen when components are mounting, after all load functions have run.
// If it is initialized, it'll be used as the client for `loadQueries()` to query with.
let curClient = null
export const getCurClient = () => curClient

const clientSsr = ssrExchange({ isClient: true })
// TODO: See other TODO about extractData. We need this to make sure that we're not calling restoreData after initial restore
export const restoreData = (data) => data && clientSsr.restoreData(data)

/** Fauna & Magic Link preconfigured urql client */
export const initClient = () =>
  (curClient = urqlInit({
    url: 'https://graphql.fauna.com/graphql',
    exchanges: [
      // devtoolsExchange, // ⚙ for dev only
      dedupExchange,
      // TODO: Discuss persistence
      // ? Consider using offline exchange for persistence, w/ request policy exchange for clearing stale data.
      cacheExchange({
        updates: {
          Mutation: {
            // TODO: Implement createComment manual cache update
            createComment(result, _args, cache, _info) {
              console.log(result)
              const query = GetTimeline.query // In this case, obtained from a func+op store
              // TODO: May need to use multiple updateQuery depending on where the comment is being posted by user. That might be in timeline, explore, profile photos, anywhere that is getting the photos and their respective comments.
              cache.updateQuery({ query }, (data) => {
                // data.result is named after the gql query's root op name, in this case aliased to result
                data.result.data.comments.data.push(result.createComment)
                return data
              })
            },
          },
        },
        // Any Page types (usually for lists) in your schema should be nulled to silence warnings as they don't have an ID.
        keys: {
          UserPage: () => null,
        },
      }),
      // [async] auth-exchange: https://waa.ai/auth-exchange
      authExchange({
        addAuthToOperation: ({ authState, operation }) => {
          // Nothing to change, return the operation without changes
          if (
            !authState ||
            !authState?.token
            // && !import.meta.env.VITE_FAUNA_PUBLIC // ⚙ For fauna public role
          )
            return operation

          // FetchOptions can be a function (See Client API) but you can simplify this based on usage
          const fetchOptions =
            typeof operation.context.fetchOptions == 'function'
              ? operation.context.fetchOptions()
              : operation.context.fetchOptions || {}

          return makeOperation(operation.kind, operation, {
            ...operation.context,
            fetchOptions: {
              ...fetchOptions,
              headers: {
                ...fetchOptions.headers,
                Authorization: `Bearer ${
                  authState?.token // || import.meta.env.VITE_FAUNA_PUBLIC// ⚙ for if you have a Fauna public role key
                }`,
                'X-Schema-Preview': 'partial-update-mutation',
              },
            },
          })
        },
        willAuthError: ({ authState }) => {
          // e.g. check for expiration, existence of auth etc
          if (!authState || !get(isAuthenticated)) return true
          return false
        },
        didAuthError: ({ error }) => {
          // Check if error was an auth error (can be implemented in various ways, e.g. 401 or a special error code)
          switch (error.message) {
            case '[GraphQL] Invalid database secret.': // Secret invalid, possibly b/c of expired or forced logout
            case '[GraphQL] Missing authorization header.': // Queried while not logged in / localStorage cleared / no public key
              return true
            default:
              return false
          }
        },
        getAuth: async ({ authState }) => {
          // No refresh token, refer to auth exchange quickstart for that

          // For initial launch, fetch the auth state from storage (local storage, async storage, in-memory etc)
          if (!authState) {
            if ((authState = get(auth)) && authState.token) return authState
            // Can also implement redirect logic here if desired, but it's better to place that logic at the component
            // level, which can even be dynamically imported.
            return null
          }

          // The following code gets executed when an auth error has occurred

          // ***===***
          // Refresh Logic
          // refresh if possible & return new auth state
          // ⚙ Uncomment block and update ttl of login FQL func in setup.fql to disable refreshing access tokens
          //   To get more security with refresh (no localStorage), check out the README
          if ((authState = await verify())) return authState // return new auth state
          // otherwise refresh failed
          // ***===***

          // Your app logout logic should trigger here
          await logout()

          return null
        },
      }),
      fetchExchange,
    ],
  }))

/** Meant to be used for load function. Uses a minimal client specifically for load function, carrying over data obtained from SSR.
 * Returns extracted data if SSR, and pre-queries using current client if not.
 */
export async function loadQueries(fetch, ...queryOperationStores) {
  // TODO: We may consider public clients for usage with public routes. That will end up being a different function for SSR.
  if (!get(auth)?.token) return

  let loadClient

  if (!curClient) {
    const ssr = ssrExchange({ isClient: false })
    loadClient = createClient({
      url: 'https://graphql.fauna.com/graphql',
      fetchOptions: () => {
        const token = get(auth)?.token
        return {
          headers: { authorization: token ? `Bearer ${token}` : '' },
        }
      },
      fetch,
      exchanges: [ssr, fetchExchange],
    })
  } else loadClient = curClient

  try {
    await Promise.all(queryOperationStores.map((opStore) => loadClient.query(opStore.query).toPromise()))
  } catch (error) {
    return {}
  }

  // TODO: We need to observe what comes out of extractData() when there's nothing inside. Likely a falsey value.
  return ssr.extractData()
}