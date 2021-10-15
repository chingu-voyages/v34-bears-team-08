<script>
  import { isAuthenticated, logout } from '$lib/stores/auth'
  import Home from '@svicons/fa-solid/home.svelte'
  import Signout from '@svicons/fa-solid/sign-out-alt.svelte'
  import User from '@svicons/fa-solid/user-alt.svelte'
  import Compass from '@svicons/fa-solid/compass.svelte'
</script>

<header class="h-16 bg-white border-b border-gray-primary mb-8">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items cursor-pointer">
        <h1 class="flex justify-center w-full">
          <a href="/" class="font-mono" aria-label="Home">
            <img src="/images/devvy-01.png" class="w-1/2" alt="devvy logo" />
          </a>
        </h1>
      </div>
      <div class="text-gray-700 text-center flex items-center align-items">
        <!--This conditional will be replaced with isAuthenticated-->
        {#if true}
          <a href="/" aria-label="Timeline">
            <Home
              class="w-8 mr-6 text-black-light cursor-pointer"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <a href="/explore" area-label="explore">
            <Compass
              class="w-8 mr-6 text-black-light cursor-pointer"
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
              class="w-8 mr-6 text-black-light cursor-pointer"
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
              <User
                class="w-8 mr-6 text-black-light cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              />
              <!--  Link for profile image goes here
                  <a href={`/p/${user?.username}`}>
                    
                    Image goes here 
                    vv from tutorial vv
                <img
                  class="rounded-full h-8 w-8 flex"
                  src={`/images/avatars/${user?.username}.jpg`}
                  alt={`${user?.username} profile`}
                  onError={(e) => {
                    //e.target.src = DEFAULT_IMAGE_PATH;
                  }}
              />
            </a>
              -->
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
