<script>
import { GetUserInfo } from '$lib/gql/GetUserInfo'
import { auth } from '$lib/stores/auth'
import Loader from '$lib/components/Loader.svelte'
import { UpdateProfile } from '$lib/gql/UpdateUserInfo'
const username = $auth?.userInfo.username
GetUserInfo.variables = { username }
GetUserInfo()
$: user = $GetUserInfo.data?.result
let newUserInfo = { fullName: '', bio: '', username: '', headline: '', profileImgSrc: '' }

const execUpdateUserInfo = UpdateProfile()

async function updateUserInfo() {
  await execUpdateUserInfo({
    ...newUserInfo,
    id: $auth?.userInfo._id,
  })
  alert('Your profile info has been updated!')
}

let loading = true
$: if ($GetUserInfo.data?.result) loading = false
</script>

<div class="flex flex-col justify-center items-center w-full">
  {#if loading}
    <Loader />
    <h3>Loading your information . . .</h3>
  {/if}
  <form
    on:submit|preventDefault={updateUserInfo}
    class="flex w-4/5 flex-col items-center justify-center rounded-xl p-4 my-3"
  >
    <div class="w-3/4 h-1/3 flex rounded-full items-center">
      {#if user?.profileImgSrc}
        <img src={newUserInfo.profileImgSrc} alt="profile img" />
      {:else}
        <span class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
          <span class="text-lg font-medium leading-none text-white">{username[0]}</span>
        </span>
      {/if}
      <h2 class="ml-4">Change profile photo</h2>
    </div>

    <label for="Username" class="mt-4 w-3/4">Username</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm py-2 px-3"
      bind:value={newUserInfo.username}
      placeholder={user?.username}
      disabled={loading}
    />

    <label for="fullName" class="mt-4 w-3/4 ">Full Name</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm py-2 px-3"
      bind:value={newUserInfo.fullName}
      placeholder={user?.fullName}
      disabled={loading}
    />
    <label for="headline" class="mt-4 w-3/4">Headline</label>
    <input
      type="text"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm py-2 px-3"
      bind:value={newUserInfo.headline}
      placeholder={user?.headline}
      disabled={loading}
    />
    <label for="bio" class="mt-4 w-3/4">Bio</label>
    <textarea
      type="text"
      rows="3"
      class="w-3/4 mt-2 text-gray-400 focus:text-gray-gray7 focus:ring-1 focus:ring-gray-500 focus:outline-none rounded-sm py-2 px-3"
      bind:value={newUserInfo.bio}
      placeholder={user?.bio}
      disabled={loading}
    />
    <label for="username" class="mt-4 w-3/4" />
    <button type="submit" class="mt-6 py-2 px-8 rounded-md bg-amber-amber8 font-semibold">Save</button>
  </form>
</div>
