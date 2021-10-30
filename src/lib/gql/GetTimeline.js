import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetTimeline = queryOp(
  gql`
    query GetTimeline($username: String, $size: Int = 10) {
      result: getTimeline(username: $username, _size: $size) {
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
          likedByUser
        }
      }
    }
  `
)
