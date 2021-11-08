<!-- @component 
Load this component on either a flex row or column. 
-->
<script>
import Loader from './Loader.svelte'
import { GetUserInfo } from '$lib/gql/GetUserInfo'
import { FollowUser } from '$lib/gql/FollowUser'
import { auth } from '$lib/stores/auth'
import { queryOp } from '$lib/gql/urql'
import { Gear } from '@svicons/bootstrap'
import Modal from '$lib/components/Modal.svelte'
import Settings from '$lib/components/Settings.svelte'
import Following from './Following.svelte'
import Followers from './Followers.svelte'

export let username
let currentUser = $auth?.userInfo.username
const UserInfo = queryOp(GetUserInfo.query, { username })()
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc, followedByUser, _id } =
  $UserInfo.data?.result || {})
const execFollowUser = FollowUser()

$: following = $UserInfo.data?.result.following.data
$: followers = $UserInfo.data?.result.followers.data

let settingsOpen = false
let followingOpen = false
let followersOpen = false
</script>

{#if $UserInfo.data}
  <img src={profileImgSrc || 'https://picsum.photos/200'} class="mr-3 rounded-full" alt="profile avatar" width="200" />
  <div class="flex flex-col w-3/4">
    <div class="flex flex-row justify-between">
      <h2 class="my-1 text-4xl overflow-ellipsis overflow-hidden">{fullName || username}</h2>
      <button
        on:click={() => {
          settingsOpen = true
        }}
        ><Gear
          class="w-8 sm:w-6 text-gray-gray11 hover:text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        /></button
      >
    </div>
    <div class="flex items-center ">
      <button class="text-sm inline-block mr-2" on:click={() => (followingOpen = true)}
        >{followingCount || 0} following</button
      >
      <button class="text-sm inline-block" on:click={() => (followersOpen = true)}
        >{followerCount || 0} followers</button
      >
    </div>
    {#if headline}<h3 class="my-1">{headline}</h3>{/if}
    <p class="my-1">{bio}</p>
    {#if currentUser != username && followedByUser}
      <button
        class="bg-blue-400 rounded-md py-1 px-2 w-min text-white"
        on:click={() => execFollowUser({ id: _id, value: false, user: $UserInfo.data?.result })}
      >
        Unfollow
      </button>
    {:else if currentUser != username}
      <button
        class="bg-blue-400 rounded-md py-1 px-2 w-min text-white"
        on:click={() => execFollowUser({ id: _id, user: $UserInfo.data?.result })}
      >
        Follow
      </button>
    {/if}
  </div>
{:else}
  <Loader />
{/if}

{#if settingsOpen}
  <Modal on:close={() => (settingsOpen = false)}>
    <Settings {settingsOpen} />
  </Modal>
{/if}

{#if followingOpen}
  <Modal on:close={() => (followingOpen = false)}>
    <Following {following} />
  </Modal>
{/if}

{#if followersOpen}
  <Modal on:close={() => (followersOpen = false)}>
    <Followers {followers} />
  </Modal>
{/if}
