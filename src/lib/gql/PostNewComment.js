import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const PostNewComment = mutationOp(gql`
  mutation PostNewComment(
      $author: ID!
      $photo: ID!
      $text: String!
      $posted: Time!
  ) {
    result: createComment(
      data: {
        author: { connect: $author }
        photo: { connect: $photo }
        text: $text
        posted: $posted
      }
    ) {
      _id
    }
  }
`)
