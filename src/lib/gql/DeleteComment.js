import { gql } from '@urql/svelte'
import { mutationOp } from './urql'
/** add photoID variable to clear cache when possible */
export const DeleteComment = mutationOp(gql`
  mutation DeleteComment($id: ID!) {
    result: deleteComment(id: $id) {
      _id
    }
  }
`)
