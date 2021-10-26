import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetCurrentUserInfo = queryOp(
  gql`
    query GetCurrentUserInfo($username: String!) {
      result: getUserByUsername(username: $username) {
        headline
        fullName
        followingCount
        followerCount
        bio
        username
        profileImgSrc
        _id
        followers {
          data {
            user {
              username
              _id
            }
            _id
          }
        }
      }
    }
  `
)
