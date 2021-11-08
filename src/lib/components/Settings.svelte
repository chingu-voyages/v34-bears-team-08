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
import Loader from '$lib/components/Loader.svelte'
import { UpdateProfile } from '$lib/gql/UpdateUserInfo'
const username = $auth?.userInfo.username
GetUserInfo.variables = { username }
GetUserInfo()
$: user = $GetUserInfo.data?.result
let newUserInfo = {fullName:"", bio:"", username:"", headline:"", profileImgSrc: ""}
$: if (user) setUserInfo()

function setUserInfo(){
    newUserInfo = {
  fullName: user?.fullName,
  bio: user?.bio,
  username: user?.username,
  headline: user?.headline,
  profileImgSrc: user?.profileImgSrc,
}
}

const execUpdateUserInfo = UpdateProfile()

async function updateUserInfo() {
  const { fullName, bio, username, headline, profileImgSrc } = newUserInfo
  console.log(bio)
  await execUpdateUserInfo({
    fullName: fullName,
    bio: bio,
    username: username,
    headline: headline,
    profileImgSrc: profileImgSrc,
    id: $auth?.userInfo._id
  })
  alert("Your profile info has been updated!")
}

let loading = true
$: if ($GetUserInfo.data?.result) loading = false
</script>

<div class="flex flex-col justify-center items-center w-full">
  {#if loading}
    <Loader />
    <h3>Loading your information . . . </h3>
  {/if}
  <form
    on:submit|preventDefault={updateUserInfo}
    class="flex w-4/5 flex-col items-center justify-center bg-grayDark-gray1 border border-gray-500 rounded-xl p-4 my-3"
  >
    <div class="w-3/4 h-1/3 justify-self-center rounded-full border">
      <img src={newUserInfo.profileImgSrc} alt="profile img" />
    </div>

    <label for="Username" class="mt-4 w-3/4 ">Username</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.username}
      placeholder={user?.username}
      disabled={loading}
    />

    <label for="fullName" class="mt-4 w-3/4 ">Full Name</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.fullName}
      placeholder={user?.fullName}
      disabled={loading}
    />
    <label for="headline" class="mt-4 w-3/4">Headline</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.headline}
      placeholder={user?.headline}
      disabled={loading}
    />
    <label for="bio" class="mt-4 w-3/4">Bio</label>
    <textarea
      type="text"
      rows="3"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm p-1"
      bind:value={newUserInfo.bio}
      placeholder={user?.bio}
      disabled={loading}
    />
    <label for="username" class="mt-4 w-3/4" />
    <button type="submit" class="mt-6 border py-1 px-4 rounded-sm bg-grayDarkA-grayA7 active:bg-grayDark-gray1">Save</button>
  </form>
</div>
