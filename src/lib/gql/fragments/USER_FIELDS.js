import { gql } from '@urql/svelte'

export const USER_FIELDS = gql`
  fragment USER_FIELDS on User {
    headline
    fullName
    followingCount
    followerCount
    bio
    username
    profileImgSrc
    _id
    followedByUser
    followers {
      data {
        _id
        follows {
          _id
          username
        }
      }
    }
    following {
      data {
        _id
        follows {
          _id
          username
        }
      }
    }
  }
`
