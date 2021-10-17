<script>
  import { auth, isAuthenticated, logout } from '$lib/stores/auth'
  import Home from '@svicons/fa-solid/home.svelte'
  import Signout from '@svicons/fa-solid/sign-out-alt.svelte'
  import User from '@svicons/fa-solid/user-alt.svelte'
  import Compass from '@svicons/fa-solid/compass.svelte'
  let username = $auth.userInfo?.username
</script>

<header class="px-4 h-16 bg-white border-b border-gray-primary mb-8">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items cursor-pointer">
        <h1 class="flex justify-center w-full">
          <a href="/" class="logo text-3xl" aria-label="Home">DEVVY</a>
        </h1>
      </div>
      <div class="text-gray-700 text-center flex items-center align-items">
        <!--This conditional will be replaced with isAuthenticated-->
        {#if true}
          <a href="/" aria-label="Timeline">
            <Home
              class="w-6 mr-6 text-black-light cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <a href="/explore" area-label="explore">
            <Compass
              class="w-5 mr-6 text-black-light cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <button
            type="button"
            title="Sign Out"
            on:click={() => {
              logout()
            }}
          >
            <Signout
              class="w-6 mr-6 text-black-light cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>
          <!--This conditional will be replaced with some user data containing a user image (avatar)-->
           {#if true}
            <!--The <User/> icon is a placeholder for where the user img will go-->
            <div class="flex items-center cursor-pointer">
              <a href="/{username}"
                ><User
                  class="w-5 mr-6 text-black-light cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                /></a
              >
            </div>
          {/if}
        {:else}
          <a href="/login">
            <button type="button" class="bg-black-light font-bold text-sm rounded text-white w-20 h-8"> Log In </button>
          </a>

          <a href="/login">
            <button type="button" class="font-bold text-sm rounded text-black-light w-20 h-8"> Sign Up </button>
          </a>
        {/if}
      </div>
    </div>
  </div>
</header>

<style>
  @font-face {
    font-family: 'moonlight';
    src: url(data:application/font-woff2;charset=utf-8;base64,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)
        format('woff2'),
      url(data:application/font-woff;charset=utf-8;base64,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)
        format('woff');
    font-weight: normal;
    font-style: normal;
  }
  .logo {
    font-family: moonlight, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New',
      monospace;
  }
</style>
