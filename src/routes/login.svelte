<script>
  import GitHub from '@svicons/fa-brands/github.svelte'
  import { oAuthLogin } from '$lib/utils/magic'

  let error = false
  let onboard = false

  let loginOrSignUp = { type: 'Sign up', function: signUp }

  function toggleNewUser() {
    onboard = !onboard
  }

  $: {
    // reactively switch to login or sign up depending on state of onboard
    if (onboard) {
      loginOrSignUp.type = 'Sign up'
      loginOrSignUp.function = signUp
    } else {
      loginOrSignUp.type = 'Login'
      loginOrSignUp.function = login
      loginOrSignUp.signUpBtn = ''
    }
  }

  function signUp() {
    console.log('sign in')
  }

  function login() {
    console.log('login')
  }
</script>

<svelte:head>
  <title>{loginOrSignUp.type}</title>
</svelte:head>
<div class="flex justify-center items-center h-full">
  <div class="container flex mx-auto max-w-screen-md items-center h-screen px-3">
    <div class="flex w-3/5">
      <img class="max-h-full" src="/images/iphone.png" alt="iPhone with app on screen" />
    </div>
    <div class="flex flex-col w-3/5">
      <div class="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
        <h1 class="flex justify-center w-full">
          <img src="/images/devvy-01.png" alt="Placeholder" class="mt-2 w-3/4" />
        </h1>
        
        {#if error} <p class="mb-4 text-xs text-red-primary">{error}</p> {/if}
      </div>

      <div class="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
        <button
          class="bg-black-light text-white flex flex-row text-black p-3 rounded-md hover:scale-100"
          on:click={async () => {
            //loginOrSignUp.function
            await oAuthLogin('github')
          }}
        >
          {loginOrSignUp.type} with GitHub <GitHub class="pl-4 text-3xl" width="1.5em" color="white" />
        </button>
      </div>

      <div class="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
        <p class="text-sm">
          {#if !onboard}
            Don't have an account?{` `}
          {:else}
            Already have an account?{` `}
          {/if}
          <button on:click={toggleNewUser} class="font-bold text-blue-medium">
            {loginOrSignUp.type === 'Login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  </div>
</div>
