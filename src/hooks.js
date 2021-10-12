import { decrypt } from './routes/api/auth/_utils'
import cookie from 'cookie'

export async function getSession(req) {
  // getSession runs server side so we're safe to parse cookies with our env encryption secret.
  const cookies = cookie.parse(req.headers.cookie || '')
  const authData = await decrypt(cookies.session)

  // The output of session will be available on both server and client load funcs.
  return authData || {} // creating this cookie is done by auth/login endpoint
}
