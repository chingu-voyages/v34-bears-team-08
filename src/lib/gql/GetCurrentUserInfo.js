import { queryOp } from "./urql"
import { gql } from "@urql/svelte"
import {get} from 'svelte/store'
import { auth } from "$lib/stores/auth"

export const GetCurrentUserInfo = queryOp(
  gql`
    query GetProfileInfo($id: ID!) {
      result: findUserByID(id: $id) {
        headline
        fullName
        followingCount
        followerCount
        bio
        username
        _id
      }
    }
  `,
  { id: get(auth).userInfo?._id }
)
