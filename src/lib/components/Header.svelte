<script>
import { auth, isAuthenticated } from '$lib/stores/auth'
import Logo from '$components/Logo.svelte'
import { LightningCharge } from '@svicons/bootstrap'
import Quick from './quick/Quick.svelte'
import { goto } from '$app/navigation'
import { quickDisabled } from '$lib/stores/quickDisabled'
import { fly } from 'svelte/transition'
import { browser } from '$app/env'

let username = $auth.userInfo?.username,
  post = false,
  quickOpen = false,
  searchMode = false
$: if (!quickOpen) searchMode = false

let gPressedId = null,
  quickTooltipOpen = false
const platform = browser && (navigator?.userAgentData?.platform || navigator?.platform)?.toLowerCase?.(),
  isMac = !platform?.includes?.('mac')
</script>

<header class="px-4 h-16 bg-blackA-blackA11 w-full fixed z-10 top-0">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items">
        <h1 class="flex justify-center w-full">
          <Logo />
        </h1>
      </div>
      <div class="absolute">beta</div>
      <nav class="text-gray-700 text-center flex items-center align-items space-x-5">
        {#if $isAuthenticated}
          {#if quickTooltipOpen}
            <div transition:fly={{ x: -25 }} class="hidden text-whiteA-whiteA12 text-sm -ml-20 sm:flex items-center">
              <kbd class="rounded-md py-1 px-2 bg-whiteA-whiteA5 mr-2">{isMac ? '⌘' : 'CTRL'}</kbd>
              <kbd class="rounded-md py-1 px-2 bg-whiteA-whiteA5">K</kbd>
            </div>
          {/if}
          <button
            class="fixed bottom-6 right-6 p-4 sm:static rounded-full text-gray-gray11 bg-grayA-grayA10 sm:bg-whiteA-whiteA5 sm:p-2 hover:text-whiteA-whiteA11 hover:bg-whiteA-whiteA6"
            aria-label="quick actions"
            aria-haspopup="true"
            on:mouseenter={() => (quickTooltipOpen = true)}
            on:mouseleave={() => (quickTooltipOpen = false)}
            on:focus={() => (quickTooltipOpen = true)}
            on:blur={() => (quickTooltipOpen = false)}
            on:click={() => (quickOpen = !quickOpen)}
          >
            <LightningCharge
              class="w-8 sm:w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>

          <!--This conditional will be replaced with some user data containing a user image (avatar)-->

          <a sveltekit:prefetch class="rounded-full bg-whiteA-whiteA5 p-2 hover:bg-whiteA-whiteA6" href="/{username}">
            <!-- TODO remove this line when profile photo upload func implemented -->
            <img class="h-6 w-6 rounded-full" src="https://picsum.photos/24" alt="" />
            {#if $auth.userInfo?.profileImgSrc}
              <img class="inline-block h-6 w-6 rounded-full" src={$auth.userInfo?.profileImgSrc} alt="profile avatar" />
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
      </nav>
    </div>
  </div>
</header>
<!-- Offset height of document so we never have the header overlap it by default. Negative margins can be used to adjust an element if an override is desired. -->
<div class="h-16" />

{#if quickOpen && !$quickDisabled}
  <Quick bind:isOpen={quickOpen} bind:searchMode bind:post />
{/if}
<!-- shortcuts -->
<svelte:window
  on:keydown={(e) => {
    if ((e.ctrlKey || e.metaKey) && e.key == 'k') {
      e.preventDefault()
      if (post) post = false
      else if (searchMode) searchMode = false
      else quickOpen = !quickOpen
      return
    }

    // g keys
    if (!quickOpen && !document.activeElement.matches(':read-write'))
      switch (e.key) {
        case 'g':
          gPressedId = setTimeout(() => (gPressedId = null), 500)
          break
        case 'k':
          break
        case 'p':
          if (gPressedId) {
            gPressedId = null
            e.preventDefault()
            quickOpen = post = !post
          }
          break
        case 's':
          if (gPressedId) {
            gPressedId = null
            e.preventDefault()
            quickOpen = searchMode = !searchMode
          }
          break
        // navigation
        case 'e':
          if (gPressedId && !quickOpen) {
            e.preventDefault()
            goto('/explore')
          }
          break
        case 'h':
          if (gPressedId && !quickOpen) {
            e.preventDefault()
            goto('/')
          }
          break
        default:
          break
      }
  }}
/>
