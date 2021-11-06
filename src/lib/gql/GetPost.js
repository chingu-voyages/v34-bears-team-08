import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { PHOTO_FIELDS } from './fragments/PHOTO_FIELDS'
import { USER_FIELDS } from './fragments/USER_FIELDS'
/** Gets both photo AND author */
export const GetPost = queryOp(
  gql`
    ${USER_FIELDS}
    ${PHOTO_FIELDS}
    query GetPost($id: ID!) {
      result: getPostByID(id: $id) {
        photo {
          ...PHOTO_FIELDS
        }
        likedByUser
        author {
          ...USER_FIELDS
        }
        followedByUser
      }
    }
  `
)
