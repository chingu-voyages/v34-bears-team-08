import { auth, isAuthenticated, verify, logout } from '$lib/stores/auth'
import { authExchange } from '@urql/exchange-auth'
import { dedupExchange, makeOperation, fetchExchange, ssrExchange, createClient, setClient } from '@urql/svelte'
import { cacheExchange } from '@urql/exchange-graphcache'
// import schema from './generated-introspection.json'
import { get } from 'svelte/store'
// import { devtoolsExchange } from '@urql/devtools' // ⚙ for dev only
import { browser } from '$app/env'
import { onMount } from 'svelte'

export * from './utils'
import { DeleteComment } from '../DeleteComment'
import { GetUserInfo } from '../GetUserInfo'

// Used to track if the client has been initialized, which will only happen when components are mounting, after all load functions have run.
// If it is initialized, it'll be used as the client for `loadQueries()` to query with.
let curClient = null
export const getCurClient = () => curClient
const ssrData = {}
/** indicates whether it's safe to run client queries in load func */
let serializedLoad = true

const getClient = (ssrExchange, fetch) =>
  createClient({
    url: 'https://graphql.fauna.com/graphql',
    fetch,
    exchanges: [
      //devtoolsExchange, // ⚙ for dev only
      dedupExchange,
      // TODO: Discuss persistence
      // ? Consider using offline exchange for persistence, w/ request policy exchange for clearing stale data.
      cacheExchange({
        // schema,
        updates: {
          Mutation: {
            createComment({ result }, args, cache, _info) {
              const entity = { __typename: 'Photo', _id: args.data.photo.connect }, // the exact Photo entity we need
                commentsLink = cache.resolve(entity, 'comments'),
                comments = cache.resolve(commentsLink, 'data') // get comments from cache
              comments.push(result)
              cache.link(commentsLink, 'data', comments)
            },
            deleteComment(_result, args, cache, _info) {
              const entity = { __typename: 'Photo', _id: DeleteComment.variables.photoID }, // the exact Photo entity we need
                commentsLink = cache.resolve(entity, 'comments'),
                comments = cache.resolve(commentsLink, 'data') // get comments from cache
              comments.splice(
                comments.findIndex((comment) => comment == 'Comment:' + args.id),
                1
              )
              cache.link(commentsLink, 'data', comments)
            },
            followUser(_result, { input: { value } }, cache, _info) {
              // update followingCount for logged in user, if it's already in cache
              cache.updateQuery(
                { query: GetUserInfo.query, variables: { username: get(auth).userInfo?.username } },
                (data) => {
                  if (data) {
                    data.result.followingCount ||= 0
                    data.result.followingCount += value ? 1 : -1
                  }
                  return data
                }
              )
              // Invalidate homepage timeline because user un/followed someone so the timeline should change
              const key = 'Query'
              cache
                .inspectFields(key)
                .filter((field) => field.fieldName == 'getTimeline')
                .forEach(
                  (field) => field.arguments.username == null && cache.invalidate(key, field.fieldName, field.arguments)
                )
            },
          },
        },
        optimistic: {
          likePhoto: (_vars, _cache, { variables: { value, photo } }) => ({
            ...photo,
            __typename: 'Photo',
            likeCount: photo.likeCount + (value ? 1 : -1),
            likedByUser: value,
          }),
          followUser: (_vars, _cache, { variables: { value, user } }) => ({
            ...user,
            __typename: 'User',
            followerCount: user.followerCount + (value != false ? 1 : -1),
            followedByUser: value != false ? true : value,
          }),
        },
        // Any Page types (usually for lists) in your schema should be nulled to silence warnings as they don't have an ID.
        keys: {
          UserPage: () => null,
          PhotoPage: () => null,
          FollowPage: () => null,
          CommentPage: () => null,
          QueryGetTimelinePage: () => null,
          QuerySearchUserPage: () => null,
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
      ssrExchange,
      fetchExchange,
    ],
  })

const clientSsr = ssrExchange({ isClient: true })
/** Fauna & Magic Link preconfigured urql client */
export const initClient = () => {
  setClient((curClient = getClient(clientSsr)))
  // restore data
  serializedLoad && browser && clientSsr.restoreData(ssrData)
  onMount(() => {
    serializedLoad = false
  })
  return curClient
}

/** For loading urql queries, carrying over data obtained from SSR.
 * Returns extracted data if SSR, and pre-queries using current client if not.
 *
 * * NOTE: THIS SSR FUNC IS TESTED FULLY WORKING FOR LOAD FUNC. But in Kit dev, any HMR update will cause cache to be buggy!
 * * Only the dev server launch is accurate!
 * ! Disabled, enable only if specifically working on loading code, to prevent excess API reqs. CSR-only also causes excess reqs.
 * TODO: Test SSR network reqs in prod!
 * @param {object} opts
 * @param {?Boolean} opts.dev Enables testing in dev. Disabled by default to prevent excess reqs on HMR updates. Only tests accuratly on initial dev server launch!
 * @param {function (RequestInfo, RequestInit): Promise<Response>} opts.fetch Kit load func provided fetch
 */
export async function loadQueries({ fetch, dev }, ...queryOperationStores) {
  if (!dev && import.meta.env.DEV) return
  // TODO: We may consider public clients for usage with public routes. That should be adjusted in the auth exchange for SSR.
  const ssr = ssrExchange({ isClient: false })

  if (serializedLoad) var loadClient = getClient(ssr, fetch)
  else var loadClient = curClient

  try {
    await Promise.all(
      queryOperationStores.map((opStore) => loadClient.query(opStore.query, opStore.variables).toPromise())
    )
  } catch (error) {
    return {}
  }

  return serializedLoad && Object.assign(ssrData, ssr.extractData())
}
