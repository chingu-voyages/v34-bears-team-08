import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const CreateComment = mutationOp(gql`
  mutation CreateComment($author: ID!, $photo: ID!, $text: String!, $posted: Time!) {
    result: createComment(
      data: { author: { connect: $author }, photo: { connect: $photo }, text: $text, posted: $posted }
    ) {
      author {
        username
        _id
      }
      text
      _id
    }
  }
`)
