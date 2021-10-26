import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const DeleteComment = mutationOp(gql`
  mutation DeleteComment($id: ID!) {
    result: deleteComment(id: $id) {
      _id
    }
  }
`)


