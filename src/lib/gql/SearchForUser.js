import { gql } from '@urql/svelte'
import { queryOp } from './urql'

export const SearchForUser = queryOp(gql`
  query SearchForUser($username: String!) {
    result: searchUser(username: $username) {
      data {
        _id
        email
      }
    }
  }
`)
