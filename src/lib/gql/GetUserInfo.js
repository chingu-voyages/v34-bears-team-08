import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const GetUserInfo = queryOp(
  gql`
    query GetUserInfo($username: String!) {
      result: getUserByUsername(username: $username) {
        headline
        fullName
        followingCount
        followerCount
        bio
        username
        profileImgSrc
        _id
        followedByUser
      }
    }
  `
)
