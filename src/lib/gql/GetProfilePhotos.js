import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetCurrentUserPhotos = queryOp(
  gql`
    query GetCurrentUserPhotos($username: String!) {
      result: getProfilePhotos(username: $username) {
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
  `
)
