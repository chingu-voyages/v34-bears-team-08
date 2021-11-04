<script>
import { goto } from '$app/navigation'
import { useDialog, useMenu } from 'sashui'
import { tick } from 'svelte'
import { slide } from 'svelte/transition'
import Fuse from 'fuse.js'
import { PlusSquareFill } from '@svicons/bootstrap'
import { Compass, SignOutAlt, PlusCircle } from '@svicons/fa-solid'
import { logout } from '$lib/stores/auth'

let isOpen
export { isOpen as open }
export let showModal = false
const Menu = useMenu(true),
  { menuId, Item, button, selected } = Menu
function navigate(href) {
  if (location.pathname != href) goto(href)
}
const dialog = useDialog(false),
  { overlay, title } = dialog
$: $dialog = isOpen
async function onOpen() {
  await tick()
  Menu.gotoItem?.()
}
let inp = ''
$: isOpen ? onOpen() : (inp = '') // focus first item on open
$: queryStr = inp.toLowerCase()
let buttonsArr = [
  {
    text: 'Post',
    Icon: PlusSquareFill,
    async click() {
      await tick()
      showModal = true
    },
  },
  {
    text: 'Explore',
    Icon: Compass,
    click() {
      navigate('/explore')
    },
  },
  {
    text: 'Sign Out',
    Icon: SignOutAlt,
    click() {
      logout()
    },
  },
]
const fuse = new Fuse(buttonsArr, { keys: ['text'] })
$: buttons = inp == '' ? buttonsArr : fuse.search(queryStr).map(({ item }) => item)
$: buttons.length && Menu.gotoItem?.() // go to first on input
</script>

{#if $dialog}
  <section class="fixed z-10 inset-0 overflow-y-auto" use:dialog on:close={() => (isOpen = false)}>
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-blackA-blackA8 bg-opacity-75 transition-opacity" use:overlay />
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> &#8203; </span>
      <div
        class="inline-block align-bottom bg-blackA-blackA12 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <input
          class="w-full outline-none p-4"
          type="text"
          bind:value={inp}
          placeholder="Get there in a flash"
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
                inp = ''
                break
              case 'Enter':
                e.preventDefault()
                $selected?.click?.()
                isOpen = false
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
          {#each buttons as { text,  click, Icon = Compass}}
            <Item let:active>
              <button
                class="text-left flex items-center w-full p-4 {active ? 'bg-whiteA-whiteA8' : ''}"
                transition:slide|local
                title={text}
                on:click={click}
                >{#if Icon}<Icon class="mr-6" width="16" />{/if}
                {text}</button
              >
            </Item>
          {/each}
        </menu>
      </div>
    </div>
  </section>
{/if}

<svelte:window
  on:keydown={(e) => {
    switch (e.key) {
      case 'k':
        if (e.ctrlKey) {
          e.preventDefault()
          isOpen = !isOpen
        }
        break
      default:
        break
    }
  }}
/>
