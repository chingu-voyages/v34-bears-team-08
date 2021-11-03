<script>
// import Loader from '$components/Loader.svelte'
import { fly, fade } from 'svelte/transition'
import { flip } from 'svelte/animate'
import { quintOut } from 'svelte/easing'
import { SearchForUser } from '$lib/gql/SearchForUser'
import { useMenu } from 'sashui'
import { get } from 'svelte/store'
import { goto, prefetch } from '$app/navigation'
import { sleep } from '$lib/utils'
const Menu = useMenu(true)
let username = ''
$SearchForUser.fetching = false
async function searchQuery() {
  await SearchForUser({ username })
}
$: username && searchQuery()
let results = []
$: if (!$SearchForUser.fetching) results = $SearchForUser.data?.result.data || []
</script>

<!-- TODO: Discuss if we want search for mobile and how we'd do it (maybe double stack the header with another of different color, sort of like a second header, or like the reference, sticky menu at bottom of screen) -->
<div class="my-auto hidden sm:block">
  <input
    type="text"
    class="border w-40 outline-none py-1 px-2"
    placeholder="Find your buddies"
    bind:value={username}
    on:keydown={async (e) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          Menu.nextItem()
          break
        case 'ArrowUp':
          e.preventDefault()
          Menu.prevItem()
          break
        case 'Escape':
          username = ''
          break
        case 'Enter':
          e.preventDefault()
          const { href } = get(Menu.selected)
          await prefetch(href)
          await goto(href)
          username = ''
          break
        case 'Tab':
          if (username != '') e.preventDefault()
          break
      }
    }}
  />

  <!-- TODO: Might want to think about how the loading is visually represented, probably a small loader next to or inside the search bar? 
    {#if $SearchForUser.fetching}
    <Loader class="absolute" />
  {/if} -->
  {#if username}
    <nav
      use:Menu={{ autofocus: false }}
      class="ml-20 top-10 absolute z-10 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-xs sm:px-0 outline-none"
      in:fly={{ duration: 200, y: -15 }}
      out:fly={{ duration: 150, y: -15 }}
    >
      <div class="rounded-lg shadow-lg ring-1 ring-white ring-opacity-10 overflow-y-auto">
        <div class="relative grid gap-6 bg-black-off px-5 py-6 sm:gap-8 sm:p-8 content-start h-80">
          {#each results as user (user._id)}
            <div animate:flip={{ easing: quintOut }}>
              <Menu.Item let:active>
                <a
                  sveltekit:prefetch
                  href="/{user.username}"
                  class:bg-whiteA-whiteA6={active}
                  class="-m-3 p-3 block rounded-md transition ease-in-out duration-150"
                  transition:fade={{ duration: 250 }}
                  on:click={() => (username = '')}
                >
                  <p class="text-base font-medium">
                    {user.username}
                  </p>
                </a>
              </Menu.Item>
            </div>
          {/each}
        </div>
      </div>
    </nav>
  {/if}
</div>
