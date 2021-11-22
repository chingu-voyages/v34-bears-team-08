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
import FollowUsersModal from './FollowUsersModal.svelte'

export let username
let currentUser = $auth?.userInfo.username
const UserInfo = queryOp(GetUserInfo.query, { username })()
$: ({ headline, fullName, followingCount, followerCount, bio, username, profileImgSrc, followedByUser, _id } =
  $UserInfo.data?.result || {})
const execFollowUser = FollowUser()

let settingsOpen = false,
  followsOpen = false,
  followers = false
</script>

{#if $UserInfo.data}
  <div class="mr-3 flex items-center w-full max-w-[200px]">
    <img
      src={profileImgSrc || 'https://picsum.photos/200'}
      class="w-full rounded-full"
      alt="profile avatar"
      width="200"
    />
  </div>
  <div class="flex flex-col w-3/4">
    <div class="flex flex-row justify-between place-items-center">
      <h2 class="my-1 text-[2.25rem] overflow-ellipsis overflow-hidden">{fullName || username}</h2>
      <button class="w-8 sm:w-6 text-gray-gray11 hover:text-white" on:click={() => (settingsOpen = true)}
        ><Gear /></button
      >
    </div>
    <div class="flex items-center">
      <button
        class="text-sm inline-block mr-2 disabled:cursor-default"
        disabled={!followingCount}
        on:click={() => {
          followers = false
          followsOpen = true
        }}>{followingCount || 0} following</button
      >
      <button
        class="text-sm inline-block disabled:cursor-default"
        disabled={!followerCount}
        on:click={() => (followers = followsOpen = true)}>{followerCount || 0} followers</button
      >
    </div>
    {#if headline}<h3 class="my-1">{headline}</h3>{/if}
    <p class="my-1">{bio}</p>
    {#if currentUser != username}
      <button
        class="bg-blue-400 rounded-md py-1 px-2 w-min text-white"
        on:click={() => execFollowUser({ id: _id, value: !followedByUser, user: $UserInfo.data?.result })}
      >
        {followedByUser ? 'Unfollow' : 'Follow'}
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

{#if followsOpen}
  <FollowUsersModal {username} {followers} on:close={() => (followsOpen = false)} />
{/if}

<style>
img {
  aspect-ratio: 1;
}
</style>
