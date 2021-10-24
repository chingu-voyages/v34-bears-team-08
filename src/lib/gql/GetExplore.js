import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetExplore = queryOp(gql`
  query GetExplore {
    result: getExplore(_size: 10) {
      data {
        author {
          username
        }
        src
        caption
        likeCount
        comments {
          data {
            author {
              username
            }
            text
          }
        }
        liked {
          data {
            username
          }
        }
      }
    }
  }
`)
