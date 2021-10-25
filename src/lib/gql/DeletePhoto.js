import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'

export const DeletePhoto = mutationOp(gql`
  mutation DeletePhoto($id: ID!) {
    result: deletePhoto(id: $id) {
      comments {
        data {
          _id
        }
      }
    }
  }
`)
