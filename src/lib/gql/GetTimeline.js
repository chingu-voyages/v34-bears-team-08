import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
import { PHOTO_FIELDS } from './fragments/PHOTO_FIELDS'

export const GetTimeline = queryOp(
  gql`
    ${PHOTO_FIELDS}
    query GetTimeline($username: String, $size: Int = 10) {
      result: getTimeline(username: $username, _size: $size) {
        data {
          ...PHOTO_FIELDS
        }
      }
    }
  `
)
