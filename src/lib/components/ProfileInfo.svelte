<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { queryOp } from '$lib/gql/urql'
import { auth } from '$lib/stores/auth'
import { gql } from '@urql/svelte'

console.log('id', $auth.userInfo?._id)
const getProfileInfo = queryOp(gql`
  query getProfileInfo {
     result: findUserByID(id: ${$auth.userInfo?._id}) {
      headline
      fullName
      followingCount
      followerCount
      bio
      username
    }
  }
`)

let execGetProfileInfo = getProfileInfo()
$: console.log($execGetProfileInfo.data.result)
let { headline, fullName, followingCount, followerCount, bio, username } = $execGetProfileInfo.data.result
</script>

{#if $execGetProfileInfo.data}
  <div>I will be a photo</div>
  <div class="flex flex-col w-1/2">
    <h2 class="p-1">{fullName || username}</h2>
    <div class="p-1">{followingCount || 0} following / {followerCount || 0} followers</div>
    <h3 class="p-1">{headline}</h3>
    <p class="p-1">{bio}</p>
  </div>
{:else}
  <Loader />
{/if}
