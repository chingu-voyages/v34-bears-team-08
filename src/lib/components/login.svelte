<script>
  import GitHubIcon from '@svicons/fa-brands/github.svelte'
  import GitLabIcon from '@svicons/fa-brands/gitlab.svelte'
  import BitBucketIcon from '@svicons/fa-brands/bitbucket.svelte'
  let error = false
  let newUser = false

  let loginOrSignUp = { type: 'Sign up', function: signUp }

  function changeLoginOrSignUp() {
    if (newUser) {
      loginOrSignUp.type = 'Sign up'
      loginOrSignUp.function = signUp
    } else {
      loginOrSignUp.type = 'Login'
      loginOrSignUp.function = login
      loginOrSignUp.signUpBtn = ''
    }
  }

  $: newUser = changeLoginOrSignUp()

  function signUp() {
    console.log('sign in')
  }

  function login() {
    console.log('login')
  }
</script>

<div class="container flex mx-auto max-w-screen-md items-center h-screen">
  <div class="flex w-3/5">
    <img src="/images/iphone.png" alt="iPhone with app on screen" />
  </div>
  <div class="flex flex-col w-3/5">
    <div class="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
      <h1 class="flex justify-center w-full">
        <img src="/images/devvy-01.png" alt="Placeholder" class="mt-2 w-3/4 mb-4" />
      </h1>

      {#if error} <p class="mb-4 text-xs text-red-primary">{error}</p> {/if}
    </div>

    <div class="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
      <button
        class="bg-black-light text-white mb-4 flex flex-row text-black p-3 rounded-md hover:scale-100"
        on:click={loginOrSignUp.function}
      >
        {loginOrSignUp.type} with GitHub <GitHubIcon class="pl-4 text-3xl" width="1.5em" color="white" />
      </button>
      <button
        class="bg-black-light text-white mb-4 flex flex-row text-black p-3 rounded-md hover:scale-100"
        on:click={loginOrSignUp.function}
      >
        {loginOrSignUp.type} with BitBucket <BitBucketIcon class="pl-4 text-3xl" width="1.5em" color="white" />
      </button>
      <button
        class="bg-black-light text-white flex flex-row text-black p-3 rounded-md hover:scale-100"
        on:click={loginOrSignUp.function}
      >
        {loginOrSignUp.type} with GitLab <GitLabIcon class="pl-4 text-3xl" width="1.5em" color="white" />
      </button>
    </div>

    {#if newUser}
      <div class="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
        <p class="text-sm">
          Don't have an account?{` `}
          <a href="/login" class="font-bold text-blue-medium"> Sign up </a>
        </p>
      </div>
    {/if}
  </div>
</div>
