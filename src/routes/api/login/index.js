import { Magic } from '@magic-sdk/admin'
import { gql } from '@urql/svelte'
import { mutation } from './utils/_query'

// TODO: Modify for Oauth and SSR. Might need cookies
export async function post({ body, headers: { authorization } }) {
  const m = new Magic(process.env.MAGIC)
  const { email } = body
  const didToken = m.utils.parseAuthorizationHeader(authorization)

  if (email && didToken) {
    try {
      const validation = m.token.validate(didToken)
      const [
        metadata,
        {
          data: {
            result: { token, exp, userInfo },
          },
        },
      ] = await Promise.all([
        m.users.getMetadataByToken(didToken),
        mutation(
          gql`
            mutation Login($email: String!) {
              result: loginUser(input: { email: $email }) {
                token
                exp
                userInfo {
                  email
                }
              }
            }
          `,
          { email }
        ),
      ])

      await validation // throws error if failed

      // confirm details align
      if (userInfo.email == metadata.email)
        return {
          body: { token, exp, userInfo },
          status: 200,
        }
    } catch (error) {
      console.log(error)
    }
  }
  return { status: 400, body: 'Unable to validate email.' }
}
