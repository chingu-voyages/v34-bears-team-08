import { gql } from '@urql/svelte'
import { mutationOp } from './urql'

export const LikePhoto = mutationOp(gql`
  mutation LikePhoto($id: ID!, $value: Boolean! = true) {
    result: likePhoto(input: { photoID: $id, value: $value }) {
      likeCount
      likedByUser
      _id
    }
  }
`)
