<script>
import { useDialog } from 'sashui'
import { fly, fade } from 'svelte/transition'

export let style = null
let className
export { className as class }

const dialog = useDialog(),
  { overlay, title } = dialog
</script>

<section class="fixed z-10 inset-0 overflow-y-auto" use:dialog on:close>
  <div class="fixed inset-0 bg-blackA-blackA9 bg-opacity-75 transition-opacity" transition:fade use:overlay />
  <div
    class="flex items-end justify-center min-h-screen pb-20 text-center sm:block sm:p-0"
    transition:fly={{ duration: 200, y: -10 }}
  >
    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> &#8203; </span>

    <div
      {style}
      class="inline-block align-bottom bg-blackA-blackA12 rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 sm:align-middle max-w-lg w-full {className}"
    >
      <slot {title} />
    </div>
  </div>
</section>
