import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { USER_FIELDS } from './fragments/USER_FIELDS'
/** Gets followers if followers true, else following for a username. */
export const GetFollowUsers = queryOp(
  gql`
    ${USER_FIELDS}
    query GetFollowUsers($username: String!, $followers: Boolean = false) {
      result: getFollowUserByUsername(username: $username, followers: $followers) {
        data {
          ...USER_FIELDS
        }
      }
    }
  `
)
