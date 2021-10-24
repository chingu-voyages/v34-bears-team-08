<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { auth } from '$lib/stores/auth'
import { GetCurrentUserInfo } from '$lib/gql/GetCurrentUserInfo'
import { CreateFollow } from '$lib/gql/CreateFollow'
import { DeleteFollow } from '$lib/gql/DeleteFollow';
export let username
export let currentUser
let currentUserId = $auth?.userInfo._id
// Logged in user profile
GetCurrentUserInfo({ username })
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc, followers, _id } =
  $GetCurrentUserInfo.data?.result || {})


const execCreateFollow = CreateFollow()

function follow(){
execCreateFollow({ currentUserId, _id })
}

const execDeleteFollow = deleteFollow()
function unfollow() {
//need to get follow id
//execDeleteFollow()
}
</script>

{#if $GetCurrentUserInfo.data}
  <img src={profileImgSrc || 'https://picsum.photos/200'} alt="profile avatar" width="200" />
  <div class="flex flex-col w-3/4 pl-5">
    <h2 class="p-1">{fullName || username}</h2>
    <div class="p-1">{followingCount || 0} following / {followerCount || 0} followers</div>
    <h3 class="p-1">{headline}</h3>
    <p class="p-1">{bio}</p>
    {#if currentUser && currentUser != username && followers.data.includes(currentUser)}
      <button class="bg-blue-400 rounded-md p-3 text-white">Unfollow</button>
    {:else if currentUser && currentUser != username}
      <button class="bg-blue-400 rounded-md py-1 px-2 w-min text-white" on:click={follow}
        >Follow</button
      >
    {/if}
  </div>
{:else}
  <Loader />
{/if}
