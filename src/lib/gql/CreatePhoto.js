import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const CreatePhoto = mutationOp(
  gql`
    mutation CreatePhoto($id: ID!, $media: MediaInput!, $posted: Time!, $caption: String) {
      createPhoto(data: { author: { connect: $id }, media: $media, posted: $posted, caption: $caption, likeCount: 0 }) {
        author {
          username
          _id
        }
        caption
        media {
          src
          id
        }
        likeCount
        _id
      }
    }
  `
)
