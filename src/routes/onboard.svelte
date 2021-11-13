<!-- ? Do we want a load func to redirect if already onboarded? -->
<script>
import { auth, dbLogout, verify } from '$lib/stores/auth'
import { UpdateProfile } from '$lib/gql/UpdateUserInfo'
import { goto } from '$app/navigation'
import { useForm, HintGroup, Hint, validators, maxLength, required } from 'svelte-use-form'

const execUpdateOnboard = UpdateProfile()

let userInput = { username: '', fullName: '', bio: '', headline: '' }
async function submitHandler() {
  const { username, fullName, bio, headline } = userInput
  await execUpdateOnboard({ username, fullName, bio, headline, id: $auth.userInfo?._id })
  // ? Do we want to deal with errors? $UpdateOnboard.error
  await verify()
  dbLogout()
  goto('/')
}

$: invalid = {
  username: $form.username?.touched && !$form.username?.valid,
}
const lazyEagerTouched = (field) => () => setTimeout(() => $form[field]?.valid && ($form[field].touched = false))

const form = useForm()
const urlSafeUsername = (str) => (/^[a-zA-Z0-9_-]*$/.test(str) ? null : { username: 'Username is not valid.' })
</script>

<main class="flex flex-row w-full justify-center min-h-[calc(100vh-)] items-center">
  <form use:form on:submit|preventDefault={submitHandler} class="flex flex-col p-20 text-white rounded-md">
    <h2 class="text-3xl">Welcome to Devvy!</h2>
    <p class="mb-4 text-gray-300 text-sm self-center">Enter some basic info to get started.</p>
    <label class="mt-3 mb-1 text-gray-200 block text-sm font-medium" for="username">Username</label>
    <div class="relative">
      <input
        bind:value={userInput.username}
        type="text"
        name="username"
        class:error={invalid.username}
        id="username"
        use:validators={[required, maxLength(30), urlSafeUsername]}
        on:blur={lazyEagerTouched('username')}
      />
      {#if invalid.username}
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-red-500" fill="currentColor" aria-hidden="true">
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      {/if}
    </div>
    <HintGroup for="username">
      <Hint on="username">
        <p class="hint">A valid username only contains letters, numbers, underscores, and/or dashes.</p>
      </Hint>
      <Hint on="maxLength" let:value>
        <p class="hint">A max length of {value} characters is allowed.</p>
      </Hint>
      <Hint on="required"><p class="hint">This field is required.</p></Hint>
    </HintGroup>
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="fullName">Full name</label>
    <input type="text" name="fullName" id="fullName" bind:value={userInput.fullName} placeholder="optional" />
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="bio">Bio</label>
    <input type="text" name="bio" id="bio" bind:value={userInput.bio} placeholder="optional" />
    <label class="mt-4 text-gray-200 block text-sm font-medium" for="headline">Title</label>
    <input type="text" name="headline" id="headline" bind:value={userInput.headline} placeholder="optional" />
    <button
      disabled={!$form.valid}
      class="mt-8 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3D7BAF] hover:bg-[#336793] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#336793]"
      type="submit">Submit</button
    >
    <p class="mt-3 self-center text-gray-400 italic">Thanks for signing up!</p>
  </form>
</main>

<style>
form {
  background: linear-gradient(360deg, #2c5364, #284b5b, #234452, #1f3c49, #1b3540, #172e37, #13272f, #0f2027);
}
input::placeholder {
  font-style: italic;
}
input {
  @apply text-whiteA-whiteA12 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#3D7BAF] focus:border-[#3D7BAF] sm:text-sm;
}
.error {
  @apply border-red-400 text-red-500 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500;
}
.hint {
  @apply max-w-[fit-content] mt-2 text-sm text-red-500;
}
</style>
