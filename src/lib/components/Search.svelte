<script>
import Loader from '$components/Loader.svelte'
import { fly, slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { SearchForUser } from '$lib/gql/SearchForUser'

let username = ''
$SearchForUser.fetching = false
async function searchQuery() {
  await SearchForUser({ username })
}
$: username && searchQuery()
</script>

<div class="my-auto">
  <input
    type="text"
    class="border w-40 outline-none py-1 px-2"
    placeholder="find your buddies.."
    bind:value={username}
  />

  {#if $SearchForUser.fetching}
    <!-- <Loader class="absolute" /> -->
  {/if}
  {#if username}
    <nav
      class="ml-20 top-10 absolute z-10 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0"
      in:fly={{ duration: 200, y: -15 }}
      out:fly={{ duration: 150, y: -15 }}
    >
      <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
        <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
          {#each $SearchForUser.data?.result.data || [] as user}
            <a
              href="/{user.username}"
              class="-m-3 p-3 block rounded-md hover:bg-gray-50 transition ease-in-out duration-150"
              on:click={() => (username = '')}
              transition:slide
            >
              <p class="text-base font-medium text-gray-900">
                {user.username}
              </p>
            </a>
          {/each}
        </div>
      </div>
    </nav>
  {/if}
</div>
