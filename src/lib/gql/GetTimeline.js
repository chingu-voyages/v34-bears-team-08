import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetTimeline = queryOp(gql`
  query GetTimeline {
    result: getTimeline(_size: 10) {
      data {
        author {
          username
          _id
        }
        src
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
        liked {
          data {
            username
          }
        }
        likedByUser
      }
    }
  }
`)
