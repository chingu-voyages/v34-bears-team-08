import { gql } from '@urql/svelte'

export const PHOTO_FIELDS = gql`
  fragment PHOTO_FIELDS on Photo {
    author {
      username
      _id
    }
    media {
      src
      id
    }
    likeCount
    comments {
      data {
        author {
          username
          _id
        }
        text
        _id
      }
    }
    caption
    _id
    likedByUser
  }
`
