import { goto } from '$app/navigation'
import { derived, get, writable } from 'svelte/store'

const initAuth = { token: null, exp: null, userInfo: {} }
export const auth = writable(initAuth)

export const isAuthenticated = derived(auth, ({ token, exp }) => (!token || !exp ? false : new Date() < new Date(exp)))

// *** Functions requiring async below ***

/** Fetch preset for querying your API, base URL defined in `.env`
 * Any method can be used as a property made possible through Proxy constructor e.g.
 * ```js
 * apiQ.get('/route', {body:{}})
 * ```
 * It's an axios/express-like API.
 *
 * To access raw fetch, use fetch prop. e.g. `apiQ.fetch()`
 */
export const apiReq = {
  __proto__: new Proxy(
    {},
    {
      get:
        (target, prop) =>
        (route, init = {}) =>
          apiReq.fetch(route, { method: prop.toUpperCase(), ...init }),
    }
  ),
  /**
   * Automatically takes care sending JSON if object, and parsing JSON responses.
   * @param {string} route Path after base route
   * @param {object} init
   * @returns {object|Response} Response, parsed if viable.
   */
  async fetch(route, { ...init } = {}) {
    if (init.body && typeof init.body == 'object') {
      init.body = JSON.stringify(init.body)
      init.headers ??= {}
      init.headers['Content-type'] = 'application/json'
    }

    const resp = await fetch(`/api${route}`, init)
    if (resp.headers.get('Content-type') == 'application/json') return await resp.json()

    return resp
  },
}

async function createMagic() {
  const [{ Magic }, { OAuthExtension }] = await Promise.all([import('magic-sdk'), import('@magic-ext/oauth')])
  return new Magic(import.meta.env.VITE_MAGIC_PUBLIC, { extensions: [new OAuthExtension()] })
}

/** Handles login verification+signup or refresh. Returns new auth state & no return on errors. Signup uses exact same logic.
 * @param {object} options
 * @param {?string} options.idToken If not passed in, refreshes access token.
 * @param {?object} options.magic client dynamic import override. Can be the client itself or a promise resolving into it.
 * @param {?string} options.email */
export async function verify({ email = get(auth).userInfo?.email, idToken = null, magic = createMagic() } = {}) {
  const m = await Promise.resolve(magic)
  idToken ||= await m.user.getIdToken()

  // probably some error if there's no tokens throughout this func
  if (!idToken) return

  // Validate the did token on the server
  const authPayload = await apiReq.post('/auth/login', {
    headers: { Authorization: `Bearer ${idToken}` },
    body: { email },
  })
  if (!authPayload?.token) return
  // Finish up login
  auth.set(authPayload)
  return authPayload
}

/** Remove token and log out of Magic, then go to login page */
export async function logout() {
  const mLogoutProm = createMagic().then((m) => m.user.logout())
  await apiReq.get('/auth/logout')
  auth.set(initAuth)
  await mLogoutProm
  goto('/login')
}
