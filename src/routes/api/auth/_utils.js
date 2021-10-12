import { createClient, fetchExchange } from '@urql/svelte'
import { serialize } from 'cookie'
import Iron from '@hapi/iron'
import { Magic } from '@magic-sdk/admin'

// ===== urql server client
const client = createClient({
  url: 'https://graphql.fauna.com/graphql',
  exchanges: [fetchExchange], // we never send duplicate queries, we also do not need caching
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${import.meta.env.PROD ? process.env.FAUNA_SERVER : import.meta.env.VITE_FAUNA_SERVER}`,
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

// ==== sessions and cookies
const ENCRYPTION_SECRET = import.meta.env.PROD ? process.env.ENCRYPTION_SECRET : import.meta.env.VITE_ENCRYPTION_SECRET

async function encrypt(data) {
  return data && Iron.seal(data, ENCRYPTION_SECRET, Iron.defaults)
}

export async function decrypt(data) {
  return data && Iron.unseal(data, ENCRYPTION_SECRET, Iron.defaults)
}

export async function createSessionCookie(authData) {
  const encrypted_data = await encrypt(authData)

  return serialize('session', encrypted_data, {
    maxAge: new Date(authData.exp).getTime() / 1000,
    httpOnly: true,
    secure: import.meta.env.PROD,
    path: '/',
    sameSite: 'lax',
  })
}

export function removeSessionCookie() {
  return serialize('session', '', {
    maxAge: -1,
    path: '/',
  })
}

// Server magic client
export const magic = new Magic(import.meta.env.PROD ? process.env.MAGIC_SECRET : import.meta.env.VITE_MAGIC_SECRET)
