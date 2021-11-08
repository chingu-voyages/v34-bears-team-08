<script context="module">
import { get } from 'svelte/store'
import { GetUserInfo } from '$lib/gql/GetUserInfo'
import { auth } from '$lib/stores/auth'
import { loadQueries, queryOp } from '$lib/gql/urql'
export async function load({ fetch }) {
  const {
    userInfo: { username },
  } = get(auth)
  GetUserInfo.variables = { username }
  await loadQueries({ fetch }, GetUserInfo)
  return {}
}
</script>

<script>
const username = $auth?.userInfo.username
GetUserInfo.variables = {username}
GetUserInfo()
$: user = $GetUserInfo.data?.result
$: newUserInfo = {
  fullName: user?.fullName,
  bio: user?.bio,
  username: user?.username,
  headline: user?.headline,
  profileImgSrc: user?.profileImgSrc,
}
$: console.log(newUserInfo)
</script>

<div class="flex flex-row h-screen justify-center items-center">
  <form
    on:submit|preventDefault={() => {}}
    class="w-1/2 h-2/3 flex flex-col items-center justify-center bg-grayDark-gray1 border border-gray-500 rounded-xl p-4"
  >
    <div class="w-1/2 h-1/3 justify-self-center rounded-full border">
      <img src={newUserInfo.profileImgSrc} alt="profile img" />
    </div>

    <label for="Username" class="mt-4 w-3/4 ">Username</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.username}
    />

    <label for="fullName" class="mt-4 w-3/4 ">Full Name</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.fullName}
    />
    <label for="headline" class="mt-4 w-3/4">Headline</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.headline}
    />
    <label for="bio" class="mt-4 w-3/4">Bio</label>
    <textarea
      type="text"
      rows="3"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.bio}
    />
    <label for="username" class="mt-4 w-3/4" />
    <button type="submit" class="mt-6 border py-1 px-4 rounded-sm bg-grayDarkA-grayA7">Save</button>
  </form>
</div>
