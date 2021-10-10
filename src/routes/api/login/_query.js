import { createClient, fetchExchange } from '@urql/svelte'

const client = createClient({
  url: 'https://graphql.fauna.com/graphql',
  exchanges: [fetchExchange], // we never send duplicate queries, we also do not need caching
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.FAUNA}`,
      'X-Schema-Preview': 'partial-update-mutation',
    },
  },
})

/**
 * @type {client.query}
 */
export function query(query, variables, ctx) {
  return client.query(query, variables, ctx).toPromise()
}

export function mutation(query, variables, ctx) {
  return client.mutation(query, variables, ctx).toPromise()
}
