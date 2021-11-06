import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { USER_FIELDS } from './fragments/USER_FIELDS'

export const FollowUser = mutationOp(gql`
  ${USER_FIELDS}
  mutation FollowUser($id: ID!, $value: Boolean = true) {
    result: followUser(input: { userID: $id, value: $value }) {
      ...USER_FIELDS
    }
  }
`)
