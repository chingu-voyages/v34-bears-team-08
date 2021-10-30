import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const FollowUser = mutationOp(gql`
  mutation FollowUser($id: ID!, $value: Boolean = true) {
    result: followUser(input: { userID: $id, value: $value }) {
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
`)
