import { mutationOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
export const UpdateProfile = mutationOp(gql`
 mutation UpdateProfile(
   $username: String!, 
   $fullName: String, 
   $bio: String, 
   $headline:String, 
   $id: ID!,
   $profileImgSrc: String) {
   result: partialUpdateUser(id: $id, data: { 
     onboard: false, 
     username: $username, 
     fullName: $fullName,
     bio: $bio,
     headline:$headline
     profileImgSrc: $profileImgSrc
   }) {
     _id
   }
 }
`)
