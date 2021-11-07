import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { USER_FIELDS } from './fragments/USER_FIELDS'

export const GetUserInfo = queryOp(
  gql`
    ${USER_FIELDS}
    query GetUserInfo($username: String!) {
      result: getUserByUsername(username: $username) {
        ...USER_FIELDS
      }
    }
  `
)
