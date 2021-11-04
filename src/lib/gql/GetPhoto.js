import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { PHOTO_FIELDS } from './fragments/PHOTO_FIELDS'

export const GetPhoto = queryOp(
  gql`
    ${PHOTO_FIELDS}
    query GetPhoto($photoID: ID!) {
      result: findPhotoByID(id: $photoID) {
        ...PHOTO_FIELDS
      }
    }
  `
)
