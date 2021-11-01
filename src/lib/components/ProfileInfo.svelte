<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { GetUserInfo } from '$lib/gql/GetUserInfo'
import { FollowUser } from '$lib/gql/FollowUser'
import { auth } from '$lib/stores/auth'
import { queryOp } from '$lib/gql/urql'

export let username
let currentUser = $auth?.userInfo.username
const UserInfo = queryOp(GetUserInfo.query, { username })()
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc, followedByUser, _id } =
  $UserInfo.data?.result || {})

const execFollowUser = FollowUser()
</script>

{#if $UserInfo.data}
  <img src={profileImgSrc || 'https://picsum.photos/200'} class="mr-3 rounded-full" alt="profile avatar" width="200" />
  <div class="flex flex-col w-3/4">
    <h2 class="p-1 text-4xl overflow-ellipsis overflow-hidden">{fullName || username}</h2>
    <div class="p-1">{followingCount || 0} following / {followerCount || 0} followers</div>
    <h3 class="p-1">{headline}</h3>
    <p class="p-1">{bio}</p>
    {#if currentUser != username && followedByUser}
      <button
        class="bg-blue-400 rounded-md py-1 px-2 w-min text-white"
        on:click={() => execFollowUser({ id: _id, value: false })}
      >
        Unfollow
      </button>
    {:else if currentUser != username}
      <button class="bg-blue-400 rounded-md py-1 px-2 w-min text-white" on:click={() => execFollowUser({ id: _id })}>
        Follow
      </button>
    {/if}
  </div>
{:else}
  <Loader />
{/if}
