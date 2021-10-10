import { auth, isAuthenticated, login, logout } from '$lib/stores/auth'
import { authExchange } from '@urql/exchange-auth'
import {
  initClient as urqlInit,
  dedupExchange,
  makeOperation,
  fetchExchange,
  operationStore,
  query,
  mutation,
} from '@urql/svelte'
import { cacheExchange } from '@urql/exchange-graphcache'
import { get } from 'svelte/store'
// import { devtoolsExchange } from '@urql/devtools' // ⚙ for dev only

/** Fauna & Magic Link preconfigured urql client */
export const initClient = () =>
  urqlInit({
    url: 'https://graphql.fauna.com/graphql',
    exchanges: [
      // devtoolsExchange, // ⚙ for dev only
      dedupExchange,
      // TODO: Discuss persistence
      // ? Consider using offline exchange for persistence, w/ request policy exchange for clearing stale data.
      cacheExchange({}),
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
          if ((authState = await login({ refresh: true }))) return authState // return new auth state
          // otherwise refresh failed
          // ***===***

          // Your app logout logic should trigger here
          await logout()

          return null
        },
      }),
      fetchExchange,
    ],
  })

// Utils

/** Generates operation store function combo creation functions */
const opFn =
  (queryFn) =>
  /** @typedef {import('@urql/svelte/dist/types').OperationStore} OperationStore
   * @returns {OperationStore} Query func operation store combo. You can subscribe to it or call to query,  */
  (
    gql // intentionally omit taking variables into the opStore b/c there doesn't seem to be a use case
    // ? but if you think of one you can add it in later
  ) =>
    Object.defineProperties(function q(variables) {
      return queryFn(q, variables)
    }, Object.getOwnPropertyDescriptors(operationStore(gql)))

/** Query Operation Store: Creates a query function store from a gql query.
 *
 * usage detailed in https://waa.ai/gist-urql-patterns */
export const queryOp = opFn(query)
/** Mutation Operation Store: Creates a mutation function store from a gql query */
export const mutationOp = opFn(mutation)
