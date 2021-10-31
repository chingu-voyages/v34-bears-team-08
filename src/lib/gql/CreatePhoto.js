import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const CreatePhoto = mutationOp(
  gql`
    mutation CreatePhoto($id: ID!, $src: String!, $posted: Time!, $caption: String) {
      createPhoto(data: { author: { connect: $id }, src: $src, posted: $posted, caption: $caption, likeCount: 0 }) {
        author {
          username
          _id
        }
        caption
        src
        likeCount
        _id
      }
    }
  `
)
