<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { auth } from '$lib/stores/auth'
import {GetCurrentUserInfo} from '$lib/gql/GetCurrentUserInfo'

// Logged in user profile
GetCurrentUserInfo()

$: ({ headline, fullName, followingCount, followerCount, bio, username } = $GetCurrentUserInfo.data?.result || {})
</script>

{#if $GetCurrentUserInfo.data}
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
