<script>
import { goto } from '$app/navigation'
import { useDialog, useMenu } from 'sashui'
import { onDestroy, tick } from 'svelte'
import { fly, fade } from 'svelte/transition'
import Fuse from 'fuse.js'
import { PlusSquareFill, Search } from '@svicons/bootstrap'
import { Compass, SignOutAlt, Home } from '@svicons/fa-solid'
import { logout } from '$lib/stores/auth'
import { SearchForUser } from '$lib/gql/SearchForUser'
import CreatePost from '../CreatePost.svelte'
import { sleep } from '$lib/utils'

export let isOpen = false,
  searchMode = false,
  post = false
const dialog = useDialog(false),
  { overlay } = dialog,
  Menu = useMenu(true),
  { Item, selected } = Menu

let uploading = false,
  inp = ''
onDestroy(() => {
  post = false
})

function navigate(href) {
  if (location.pathname != href) goto(href)
}

$: queryStr = inp.toLowerCase()
let buttonsArr = [
    {
      text: 'Search',
      Icon: Search,
      shortcut: ['g', 's'],
      click() {
        searchMode = true
        inp = ''
      },
    },
    {
      text: 'Explore',
      Icon: Compass,
      shortcut: ['g', 'e'],
      click() {
        navigate('/explore')
        isOpen = false
      },
    },
    {
      text: 'Post',
      Icon: PlusSquareFill,
      shortcut: ['g', 'p'],
      async click() {
        post = true
        await tick()
      },
    },
    {
      text: 'Home',
      Icon: Home,
      shortcut: ['g', 'h'],
      async click() {
        navigate('/')
        isOpen = false
      },
    },

    {
      text: 'Sign Out',
      Icon: SignOutAlt,
      click() {
        logout()
      },
    },
  ],
  searchResults = []
const fuse = new Fuse(buttonsArr, { keys: ['text'] })
$: buttons = filterButtons(inp)
function filterButtons() {
  if (!inp || searchMode) return buttonsArr
  return fuse.search(queryStr).map(({ item }) => item)
}
$: focusFirstOnInp(inp, searchResults, searchMode)
async function focusFirstOnInp() {
  // go to first on input
  await tick()
  Menu.gotoItem?.()
}
async function autofocus(node) {
  await tick()
  node.focus()
}

// SearchForUser
$SearchForUser.fetching = false
SearchForUser.reexecute({ pause: true })
SearchForUser()
function searchQuery() {
  $SearchForUser.context.pause = false
  SearchForUser.variables = { username: inp.toLowerCase() }
}
$: searchMode && inp && searchQuery()
$: !$SearchForUser.fetching && setSearchResults($SearchForUser.data?.result.data)
async function setSearchResults(arr = []) {
  searchResults = arr
  await sleep()
  Menu.gotoItem?.()
}
</script>

<section class="fixed z-10 inset-0 overflow-y-auto" use:dialog on:close={() => !uploading && (isOpen = false)}>
  <div class="fixed inset-0 bg-blackA-blackA9 bg-opacity-75 transition-opacity" transition:fade use:overlay />
  <div
    class="flex items-end justify-center min-h-screen pb-20 text-center sm:block sm:p-0"
    transition:fly={{ duration: 200, y: -10 }}
  >
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> &#8203; </span>
    <div
      style={`height: ${post ? 420 : (searchMode ? searchResults.length : buttons.length) * 60 + 56}px`}
      class="inline-block align-bottom bg-blackA-blackA12 rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle max-w-lg w-full"
    >
      {#if post}
        <CreatePost bind:uploading />
      {:else}
        <input
          class="w-full outline-none p-4"
          class:animate-pulse={$SearchForUser.fetching}
          use:autofocus
          type="text"
          bind:value={inp}
          placeholder={!searchMode ? 'Get there in a flash' : 'Find your buddies'}
          on:keydown={function keydown(e) {
            switch (e.key) {
              case 'ArrowDown':
                e.preventDefault()
                Menu.nextItem?.()
                break
              case 'ArrowUp':
                e.preventDefault()
                Menu.prevItem?.()
                break
              case 'Escape':
                isOpen = false
                break
              case 'Enter':
                e.preventDefault()
                $selected?.click?.()
                break
              case 'Tab':
                if (inp != '') e.preventDefault()
                break
              default:
                break
            }
          }}
          on:blur={(e) => {
            e.currentTarget.focus() // prevent losing focus due to modal's focus trap event
          }}
        />

        <menu class="p-0 m-0" use:Menu={{ autofocus: false }}>
          {#if !searchMode}
            {#each buttons as { text, click, Icon, shortcut } (text)}
              <Item let:active>
                <button
                  class="[ item ] {active ? 'bg-whiteA-whiteA8' : 'text-gray-gray11'}"
                  title={text}
                  on:click={click}
                  >{#if Icon}<Icon class="mr-6" width="16" />{/if}
                  {text}
                  {#if shortcut}
                    <span class="ml-auto">
                      {#each shortcut as key}
                        <kbd class="bg-whiteA-whiteA5 py-1 px-2 rounded-md ml-2 text-base">{key.toUpperCase()}</kbd>
                      {/each}
                    </span>
                  {/if}
                </button>
              </Item>
            {/each}
          {:else}
            {#each searchResults as user (user._id)}
              <!-- Search -->
              <!-- TODO: Might want to think about how the loading is visually represented, probably a small loader next to or inside the search bar? -->
              <Item let:active>
                <a
                  sveltekit:prefetch
                  href="/{user.username}"
                  class="[ item ] {active ? 'bg-whiteA-whiteA8' : 'text-gray-gray11'}"
                  on:click={() => {
                    isOpen = false
                  }}
                >
                  <p class="text-base font-medium">
                    {user.username}
                  </p>
                </a>
              </Item>
            {/each}
          {/if}
        </menu>
      {/if}
    </div>
  </div>
</section>

<style>
menu {
  transition: all 0.2s ease, opacity 0.2s ease;
}
.item {
  @apply text-left flex items-center w-full p-4 transition-all duration-200 ease-in text-lg h-[60px];
}
</style>
