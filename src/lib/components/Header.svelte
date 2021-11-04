<script>
import { auth, isAuthenticated } from '$lib/stores/auth'
import Logo from '$components/Logo.svelte'
import { LightningCharge } from '@svicons/bootstrap'
import Quick from './Quick/Quick.svelte'
import { goto } from '$app/navigation'

let username = $auth.userInfo?.username,
  post = false,
  quickOpen = false,
  searchMode = false
$: if (!quickOpen) searchMode = false
</script>

<header class="px-4 h-16 bg-blackA-blackA11 mb-8 w-full fixed z-10 top-0">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items">
        <h1 class="flex justify-center w-full">
          <Logo />
        </h1>
      </div>
      <div class="absolute">beta</div>
      <div class="text-gray-700 text-center flex items-center align-items space-x-5">
        {#if $isAuthenticated}
          <button
            class="rounded-full text-gray-gray11 bg-whiteA-whiteA5 p-2 hover:text-whiteA-whiteA11 hover:bg-whiteA-whiteA6"
            aria-label="quick actions"
            on:click={() => (quickOpen = !quickOpen)}
          >
            <LightningCharge
              class="w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>

          <!--This conditional will be replaced with some user data containing a user image (avatar)-->
          {#if $isAuthenticated}
            <a sveltekit:prefetch class="rounded-full bg-whiteA-whiteA5 p-2 hover:bg-whiteA-whiteA6" href="/{username}">
              <!-- TODO remove this line when profile photo upload func implemented -->
              <img class="h-6 w-6 rounded-full" src="https://picsum.photos/24" alt="" />
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
          {/if}
        {/if}
      </div>
    </div>
  </div>
</header>

{#if quickOpen}
  <Quick bind:isOpen={quickOpen} bind:searchMode bind:post />
{/if}
<!-- shortcuts -->
<svelte:window
  on:keydown={(e) => {
    switch (e.key) {
      case 'k':
        if (e.ctrlKey) {
          e.preventDefault()
          quickOpen = !quickOpen
        }
        break
      case 'e':
        if (e.ctrlKey) {
          e.preventDefault()
          goto('/explore')
        }
        break
      case 'h':
        if (e.ctrlKey) {
          e.preventDefault()
          goto('/')
        }
        break
      case 'p':
        if (e.ctrlKey) {
          e.preventDefault()
          quickOpen = true
          post = true
        }
        break
      case 's':
        if (e.ctrlKey) {
          e.preventDefault()
          quickOpen = true
          searchMode = true
        }
        break
      default:
        break
    }
  }}
/>
