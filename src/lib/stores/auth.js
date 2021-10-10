import { browser } from '$app/env'
import { goto } from '$app/navigation'
import { derived, get, writable } from 'svelte/store'

const initAuth = { token: null, exp: null, userInfo: {} }
function createAuth() {
  if (browser) {
    var userInfo = localStorage.getItem('userInfo')
    return writable({
      token: localStorage.getItem('token'),
      exp: localStorage.getItem('exp'),
      userInfo: userInfo ? JSON.parse(userInfo) : {},
    })
  }
  return writable(initAuth)
}

export const auth = createAuth()

export function setAuthState({ token, userInfo, exp }) {
  localStorage.setItem('token', token)
  localStorage.setItem('exp', exp)
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  auth.set({ token, userInfo, exp })
}

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

async function magic() {
  const { Magic } = await import('magic-sdk')
  return new Magic(import.meta.env.VITE_MAGIC_PUBLIC)
}

/** Handles login+signup or refresh. Returns new auth state & no return on errors. Signup uses exact same logic.
 *
 * Token refresh and login are basically equivalent, only difference being how Magic gets the didToken again.
 * @param {LoginOptions?}
 * @typedef {Object} LoginOptions
 * @property {object} magic client dynamic import override. Can be the client itself or a promise resolving into it.
 * @property {boolean} refresh Enable `refresh` mode. Default `false`
 * @property {string} email
 */
export async function login({ email = get(auth).userInfo?.email, refresh = false, magic = magic() }) {
  const m = await Promise.resolve(magic)
  try {
    const didToken = await (refresh
      ? m.user.getIdToken()
      : m.auth.loginWithMagicLink({
          email,
        }))
    // Validate the did token on the server
    if (didToken) {
      const authPayload = await apiReq.post('/login', {
        headers: { Authorization: `Bearer ${didToken}` },
        body: { email },
      })
      // Finish up login
      if (authPayload?.token) {
        setAuthState(authPayload)
        return authPayload
      }
    }
  } catch (error) {
    if (error.message.includes('-32602')) return false // invalid email error
  }
}

/** Remove token and log out of Magic, then go to login page */
export async function logout() {
  const mLogoutProm = magic().then((m) => m.user.logout())
  localStorage.removeItem('token')
  localStorage.removeItem('exp')
  localStorage.removeItem('userInfo')
  auth.set(initAuth)
  await mLogoutProm
  goto('/login')
}
