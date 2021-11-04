<script>
import { goto } from '$app/navigation'
import { useDialog, useMenu } from 'sashui'
import { onMount, tick } from 'svelte'
import { fade, slide } from 'svelte/transition'
import Fuse from 'fuse.js'
import { PlusSquareFill, Search } from '@svicons/bootstrap'
import { Compass, SignOutAlt } from '@svicons/fa-solid'
import { logout } from '$lib/stores/auth'
import { SearchForUser } from '$lib/gql/SearchForUser'

export let isOpen = false,
  searchMode = false
$: placeholder = !searchMode ? 'Get there in a flash' : 'Find your buddies'
export let showModal = false
const dialog = useDialog(false),
  { overlay } = dialog
const Menu = useMenu(true),
  { menuId, Item, selected } = Menu

let documentStyle
onMount(() => {
  documentStyle = document.documentElement.style
  return () => (document.documentElement.style = documentStyle)
})

function navigate(href) {
  if (location.pathname != href) goto(href)
}

let inp = ''
$: queryStr = inp.toLowerCase()
let buttonsArr = [
    {
      text: 'Search',
      Icon: Search,
      click() {
        searchMode = true
        inp = ''
      },
    },
    {
      text: 'Explore',
      Icon: Compass,
      click() {
        navigate('/explore')
        isOpen = false
      },
    },
    {
      text: 'Post',
      Icon: PlusSquareFill,
      async click() {
        isOpen = false
        await tick()
        showModal = true
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
$: focusFirstOnInp(inp)
async function focusFirstOnInp() {
  // go to first on input
  await tick()
  if (searchMode) {
    searchResults.length && Menu.gotoItem?.()
  } else buttons.length && Menu.gotoItem?.()
}

// SearchForUser
$SearchForUser.fetching = false
async function searchQuery() {
  await SearchForUser({ username: inp })
}
$: searchMode && inp && searchQuery()
$: if (!$SearchForUser.fetching) searchResults = $SearchForUser.data?.result.data || []
</script>

<section class="fixed z-10 inset-0 overflow-y-auto" use:dialog on:close={() => (isOpen = false)}>
  <div class="flex items-end justify-center min-h-screen pb-20 text-center sm:block sm:p-0">
    <div
      class="fixed inset-0 bg-blackA-blackA9 bg-opacity-75 transition-opacity"
      use:overlay
      transition:fade={{ duration: 200 }}
    />
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> &#8203; </span>
    <div
      class="inline-block align-bottom bg-blackA-blackA12 rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle max-w-lg w-full"
    >
      <input
        class="w-full outline-none p-4"
        type="text"
        bind:value={inp}
        {placeholder}
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
          {#each buttons as { text, click, Icon } (text)}
            <Item let:active>
              <!-- TODO: Show shortcuts -->
              <button
                class="text-left flex items-center w-full p-4 {active
                  ? 'bg-whiteA-whiteA8'
                  : 'text-gray-gray11'} transition-all duration-200 ease-in text-lg"
                transition:slide|local
                title={text}
                on:click={click}
                >{#if Icon}<Icon class="mr-6" width="16" />{/if}
                {text}</button
              >
            </Item>
          {/each}
        {:else}
          {#each searchResults as user (user._id)}
            <!-- Search -->
            <!-- TODO: Might want to think about how the loading is visually represented, probably a small loader next to or inside the search bar? -->
            <Menu.Item let:active>
              <a
                sveltekit:prefetch
                href="/{user.username}"
                class="text-left flex items-center w-full p-4 {active
                  ? 'bg-whiteA-whiteA8'
                  : 'text-gray-gray11'} transition-all duration-200 ease-in text-lg"
                on:click={() => {
                  isOpen = false
                }}
              >
                <p class="text-base font-medium">
                  {user.username}
                </p>
              </a>
            </Menu.Item>
          {/each}
        {/if}
      </menu>
    </div>
  </div>
</section>

<!-- TODO This transition works but needs height and we need to have a fixed contain anchor point -->
<!-- 
<style>
menu {
  transition: transform 0.2s ease, opacity 0.2s ease;
}
</style> -->
