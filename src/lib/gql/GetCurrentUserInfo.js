import { queryOp } from './urql'
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
      }
    }
  `
)
