import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/core'
export const UpdateOnboard = mutationOp(gql`
 mutation UpdateProfile(
   $username: String!, 
   $fullName: String, 
   $bio: String, 
   $headline:String, 
   $id: ID!) {
   result: partialUpdateUser(id: $id, data: { 
     onboard: false, 
     username: $username, 
     fullName: $fullName,
     bio: $bio,
     headline:$headline
   }) {
     _id
   }
 }
`)
