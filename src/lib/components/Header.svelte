<script>
import { auth, isAuthenticated, logout } from '$lib/stores/auth'
import Modal from '$components/Modal.svelte'
import { Home, Compass, SignOutAlt, PlusCircle } from '@svicons/fa-solid'
import Logo from '$components/Logo.svelte'
import Search from '$components/Search.svelte'

let username = $auth.userInfo?.username,
  disableLogout = false
let showModal = false
</script>

<header class="px-4 h-16 bg-white border-b border-gray-primary mb-8">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items">
        <h1 class="flex justify-center w-full">
          <Logo />
        </h1>
      </div>
      <div class="absolute">beta</div>
      <Search />
      <div class="text-gray-700 text-center flex items-center align-items space-x-5">
        {#if $isAuthenticated}
          <button title="Add Post" on:click={() => (showModal = true)}>
            <PlusCircle
              class="w-6 text-black-light pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>
          <a sveltekit:prefetch href="/" aria-label="Timeline">
            <Home
              class="w-6 text-black-light pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <a sveltekit:prefetch href="/explore" area-label="explore">
            <Compass
              class="w-5 text-black-light pointer-events-none	"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <button
            type="button"
            title="Sign Out"
            disabled={disableLogout}
            on:click={() => {
              disableLogout = true
              logout()
            }}
          >
            <SignOutAlt
              class="w-6 text-black-light pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>
          <!--This conditional will be replaced with some user data containing a user image (avatar)-->
          {#if $isAuthenticated}
            <div class="flex items-center">
              <a sveltekit:prefetch class="h-6" href="/{username}">
                <!-- TODO remove this line when profile photo upload func implemented -->
                <img class="inline-block h-6 w-6 rounded-full" src="https://picsum.photos/24" alt="" />
                {#if $auth.userInfo?.profileImgSrc}
                  <img
                    class="inline-block h-6 w-6 rounded-full"
                    src={$auth.userInfo?.profileImgSrc}
                    alt="profile avatar"
                  />
                  <!-- {:else} -->
                  <!-- placeholder -->
                  <span class="inline-block h-6 w-6 rounded-full overflow-hidden bg-gray-300">
                    <svg class="h-full w-full text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </span>
                {/if}
              </a>
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</header>

{#if showModal}
  <Modal on:close={() => (showModal = false)} />
{/if}
