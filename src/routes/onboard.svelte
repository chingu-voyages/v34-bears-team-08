<script>
  import { auth, verify } from '$lib/stores/auth'
  import { UpdateOnboard } from '$lib/gql/UpdateOnboard'
  auth

  const updateOnboard = UpdateOnboard()

  let userInput = { username: '', fullName: '', bio: '', headline: '' }
  async function submitHandler() {
    const { username, fullName, bio, headline } = userInput
    updateOnboard({ username, fullName, bio, headline, id: $auth.userInfo?._id })
    await verify()
    location.pathname= "/"
  }

  function setInput(e) {
    let value = e.target.value
    let id = e.target.id
    userInput = { ...userInput, [id]: value }
  }

  //$: error = $updateOnboard.error
  //$: $updateOnboard.data
</script>

<div class="flex flex-row w-full justify-center h-screen items-center ">
  <form on:submit|preventDefault={submitHandler} class="flex flex-col p-20 bg-black-light text-white rounded-md">
    <h2 class="text-3xl">Welcome to Devvy!</h2>
    <p class="mb-4 text-gray-500 text-sm self-center">Enter some basic info to get started.</p>
    <label class="my-2" for="username">Username:</label>
    <input
      class="text-black-light"
      on:change|self={setInput}
      type="text"
      name="username"
      id="username"
      value={userInput.username}
      required
    />
    <label class="my-2" for="fullName">Full name:</label>
    <input
      class="text-black-light"
      on:change={setInput}
      type="text"
      name="fullName"
      id="fullName"
      value={userInput.fullName}
      placeholder="(optional)"
    />
    <label class="my-2" for="bio">Bio:</label>
    <input
      class="text-black-light"
      on:change|self={setInput}
      type="text"
      name="bio"
      id="bio"
      value={userInput.bio}
      placeholder="(optional)"
    />
    <label class="my-2 " for="headline">Title:</label>
    <input
      class="text-black-light"
      on:change|self={setInput}
      type="text"
      name="headline"
      id="headline"
      value={userInput.headline}
      placeholder="(optional)"
    />
    <button class="self-center bg-white text-black-light p-1 rounded-sm my-3" type="submit">Submit</button>
    <p class="mt-3 self-center text-gray-500">Thanks for signing up!</p>
  </form>


</div>
