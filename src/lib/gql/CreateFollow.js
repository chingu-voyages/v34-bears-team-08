import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const CreateFollow = mutationOp(gql`
  mutation CreateFollow($currentUserId: ID!, $_id: ID!) {
    result: createFollow(data: { user: { connect: $currentUserId }, follows: { connect: $_id } }) {
      _id
    }
  }
`)
