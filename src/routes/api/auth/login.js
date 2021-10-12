import { gql } from '@urql/svelte'
import { createSessionCookie, magic, mutation } from './_utils'

// Also acts as refresh endpoint
export async function post({ body, headers: { authorization } }) {
  const { email } = body
  console.log(process.env.MAGIC_SECRET)
  const didToken = magic.utils.parseAuthorizationHeader(authorization)

  if (email && didToken) {
    try {
      const validation = magic.token.validate(didToken)
      const [
        metadata,
        {
          data: {
            result: { token, exp, userInfo },
          },
        },
      ] = await Promise.all([
        magic.users.getMetadataByToken(didToken),
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

      const authData = { token, exp, userInfo }
      // confirm details align with what client sent
      if (userInfo.email == metadata.email)
        return {
          headers: {
            'set-cookie': await createSessionCookie(authData),
          },
          body: authData,
        }
    } catch (error) {
      console.log(error)
    }
  }
  return { status: 400, body: 'Unable to validate email.' }
}
