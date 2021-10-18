<!-- ? Do we want a load func to redirect if already onboarded? -->
<script>
  import { auth, dbLogout, verify } from '$lib/stores/auth'
  import { UpdateOnboard } from '$lib/gql/UpdateOnboard'
  import { goto } from '$app/navigation'

  const execUpdateOnboard = UpdateOnboard()

  let userInput = { username: '', fullName: '', bio: '', headline: '' }
  async function submitHandler() {
    const { username, fullName, bio, headline } = userInput
    await execUpdateOnboard({ username, fullName, bio, headline, id: $auth.userInfo?._id })
    // ? Do we want to deal with errors? $UpdateOnboard.error
    await verify()
    dbLogout()
    goto('/')
  }

  const baseInputClass =
    'text-gray-700 light appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3D7BAF] focus:border-[#3D7BAF] sm:text-sm'
</script>

<div class="flex flex-row w-full justify-center h-screen items-center ">
  <form on:submit|preventDefault={submitHandler} class="flex flex-col p-20 text-white rounded-md">
    <h2 class="text-3xl">Welcome to Devvy!</h2>
    <p class="mb-4 text-gray-300 text-sm self-center">Enter some basic info to get started.</p>
    <label class="mt-3 mb-1 text-gray-200 block text-sm font-medium" for="username">Username</label>
    <input class={baseInputClass} bind:value={userInput.username} type="text" name="username" id="username" required />
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="fullName">Full name</label>
    <input
      class={baseInputClass}
      type="text"
      name="fullName"
      id="fullName"
      bind:value={userInput.fullName}
      placeholder="optional"
    />
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="bio">Bio</label>
    <input class={baseInputClass} type="text" name="bio" id="bio" bind:value={userInput.bio} placeholder="optional" />
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="headline">Title</label>
    <input
      class={baseInputClass}
      type="text"
      name="headline"
      id="headline"
      bind:value={userInput.headline}
      placeholder="optional"
    />
    <button
      class="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3D7BAF] hover:bg-[#336793] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#336793]"
      type="submit">Submit</button
    >
    <p class="mt-3 self-center text-gray-400 italic">Thanks for signing up!</p>
  </form>
</div>

<style>
  form {
    background: linear-gradient(360deg, #2c5364, #284b5b, #234452, #1f3c49, #1b3540, #172e37, #13272f, #0f2027);
  }
  input::placeholder {
    font-style: italic;
  }
</style>
