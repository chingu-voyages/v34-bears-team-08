import { Magic } from 'magic-sdk'
import { OAuthExtension } from '@magic-ext/oauth'
import { browser } from '$app/env'

export const magic = browser && new Magic(import.meta.env.VITE_MAGIC_PUBLIC, { extensions: [new OAuthExtension()] })

export function oAuthLogin(provider) {
  return magic.oauth.loginWithRedirect({
    provider,
    redirectURI: `${origin}/oauth2`,
  })
}
