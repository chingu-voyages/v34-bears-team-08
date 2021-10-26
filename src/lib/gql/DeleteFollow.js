import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const DeleteFollow = mutationOp(gql`
  mutation DeleteFollow($followId: ID!) {
    deleteFollow(id: $followId) {
      user {
        username
        _id
      }
      follows {
        username
        _id
      }
    }
  }
`)
