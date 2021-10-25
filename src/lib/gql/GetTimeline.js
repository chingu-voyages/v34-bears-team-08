import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetTimeline = queryOp(gql`
  query GetTimeline {
    result: getTimeline(_size: 10) {
      data {
        author {
          username
        }
        src
        likeCount
        comments {
          data {
            author {
              username
            }
            text
            _id
          }
        }
        caption
        _id
      }
    }
  }
`)
