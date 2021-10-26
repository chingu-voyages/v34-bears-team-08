import ImageKit from 'imagekit'
import { v4 as uuidv4 } from 'uuid'

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  privateKey: import.meta.env.PROD ? process.env['IMAGEKIT_PRIVATE_KEY'] : import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_END_POINT,
})

export async function get({ query }) {
  const token = query.token || uuidv4()
  const expiration = query.expiration || parseInt(Date.now() / 1000) + 60 * 10
  const signatureObj = await imagekit.getAuthenticationParameters(token, expiration)
  return { body: signatureObj }
}
