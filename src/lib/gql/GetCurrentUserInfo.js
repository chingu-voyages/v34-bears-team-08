import { queryOp } from './urql'
import { gql } from '@urql/svelte'

export const GetCurrentUserInfo = queryOp(
  gql`
    query GetCurrentUserInfo($id: ID!) {
      result: findUserByID(id: $id) {
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
