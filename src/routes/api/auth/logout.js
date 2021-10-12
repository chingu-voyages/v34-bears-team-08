import { removeSessionCookie } from './_utils'

export async function get() {
  const cookie = removeSessionCookie()

  return {
    headers: {
      'set-cookie': cookie,
    },
  }
}
