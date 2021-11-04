<script>
import { goto } from '$app/navigation'
import { useDialog, useMenu } from 'sashui'
import { tick } from 'svelte'
import { slide } from 'svelte/transition'
import Fuse from 'fuse.js'
let isOpen
export { isOpen as open }
export let showModal = false
const Menu = useMenu(true),
  { menuId, Item, button, selected } = Menu

const dialog = useDialog(false),
  { overlay, title } = dialog
$: $dialog = isOpen
$: isOpen && onOpen()
async function onOpen() {
  await tick()
  Menu?.nextItem()
}
let inp = ''
$: queryStr = inp.toLowerCase()
let buttonsArr = [
  {
    text: 'Post',
    async click() {
      isOpen = false
      await tick()
      showModal = true
    },
  },
  {
    text: 'Explore',
    click() {
      isOpen = false
      goto('/explore')
    },
  },
]
const fuse = new Fuse(buttonsArr, { keys: ['text'] })
$: buttons = inp == '' ? buttonsArr : fuse.search(queryStr).map(({ item }) => item)
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
                Menu?.nextItem()
                break
              case 'ArrowUp':
                e.preventDefault()
                Menu?.prevItem()
                break
              case 'Escape':
                inp = ''
                break
              case 'Enter':
                e.preventDefault()
                $selected?.click()
                break
              case 'Tab':
                if (inp != '') e.preventDefault()
                break
              default:
                break
            }
          }}
        />

        <menu class="p-0 m-0" use:Menu={{ autofocus: false }}>
          {#each buttons as { text, click }}
            <Item let:active>
              <button
                class="block w-full p-4 {active ? 'bg-whiteA-whiteA8' : ''}"
                transition:slide|local
                on:click={click}>{text}</button
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
