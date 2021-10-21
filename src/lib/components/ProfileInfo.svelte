<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { auth } from '$lib/stores/auth'
import { GetCurrentUserInfo } from '$lib/gql/GetCurrentUserInfo'
export let username
console.log("profileInfo", username)
// Logged in user profile
GetCurrentUserInfo({ username })
$: console.log($GetCurrentUserInfo.error)
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc } =
  $GetCurrentUserInfo.data?.result || {})
</script>

{#if $GetCurrentUserInfo.data}
  <img src={profileImgSrc || 'https://picsum.photos/200'} alt="profile avatar" width="200" />
  <div class="flex flex-col w-3/4">
    <h2 class="p-1">{fullName || username}</h2>
    <div class="p-1">{followingCount || 0} following / {followerCount || 0} followers</div>
    <h3 class="p-1">{headline}</h3>
    <p class="p-1">{bio}</p>
  </div>
{:else}
  <Loader />
{/if}
