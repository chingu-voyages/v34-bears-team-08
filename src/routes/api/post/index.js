import ImageKit from 'imagekit';
import { v4 as uuidv4 } from 'uuid'

const imagekit = new ImageKit({
  publicKey: process.env['ImageKit_PUBLIC_KEY'],
  privateKey: process.env['ImageKit_PRIVATE_KEY'],
  urlEndpoint: process.env['ImageKit_URL_END_POINT'],
})

export async function post() {
  const token = uuidv4() // req.query.token
  const expiration = parseInt(Date.now() / 1000) + 60 * 10 // or req.query.expiration
  const signatureObj = await imagekit.getAuthenticationParameters()
  return { status: 200, signatureObj }
}
