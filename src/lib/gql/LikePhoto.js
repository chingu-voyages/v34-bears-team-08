import { gql } from "@urql/svelte";
import { mutationOp } from "./urql";

export const LikePhoto = mutationOp(gql`
  mutation LikePhoto($id: ID!) {
    result: likePhoto(input: { photoID: $id, value: true }) {
      author {
        username
        _id
      }
    }
    _id
  }
`)