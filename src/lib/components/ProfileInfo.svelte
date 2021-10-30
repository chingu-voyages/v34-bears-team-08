<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { GetUserInfo } from '$lib/gql/GetUserInfo'
import { FollowUser } from '$lib/gql/FollowUser'
export let username
export let currentUser
// Logged in user profile
GetUserInfo({ username })
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc, followedByUser, _id } =
  $GetUserInfo.data?.result || {})

const execFollowUser = FollowUser()
$: console.log($FollowUser.data)
</script>

{#if $GetUserInfo.data}
  <img src={profileImgSrc || 'https://picsum.photos/200'} class="mr-3" alt="profile avatar" width="200" />
  <div class="flex flex-col w-3/4 ">
    <h2 class="p-1">{fullName || username}</h2>
    <div class="p-1">{followingCount || 0} following / {followerCount || 0} followers</div>
    <h3 class="p-1">{headline}</h3>
    <p class="p-1">{bio}</p>
    {#if currentUser && currentUser != username && followedByUser}
      <button
        class="bg-blue-400 rounded-md py-1 px-2 w-min text-white"
        on:click={() => execFollowUser({ id: _id, value: false })}
      >
        Unfollow
      </button>
    {:else if currentUser && currentUser != username}
      <button class="bg-blue-400 rounded-md py-1 px-2 w-min text-white" on:click={() => execFollowUser({ id: _id })}>
        Follow
      </button>
    {/if}
  </div>
{:else}
  <Loader />
{/if}
