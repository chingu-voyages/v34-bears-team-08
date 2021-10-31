<script>
import Loader from '$components/Loader.svelte'
import { slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { SearchForUser } from '$lib/gql/SearchForUser'

let username = ''

async function searchQuery() {
  await SearchForUser({ username })
}
$: username && searchQuery()
</script>

<div class="flex flex-col p-3">
  <input
    type="text"
    class="border w-full self-center justify-self-center outline-none py-1 px-2"
    placeholder="find your buddies.."
    bind:value={username}
  />
  {#if $SearchForUser.fetching}
    <Loader />
  {/if}
  {#if username}
    <nav class="z-10 border bg-white mt-2 p-1 h-40">
      {#each $SearchForUser.data?.result.data || [] as user}
        <a
          href="/{user.username}"
          class="text-black-light hover:text-blue-700 block"
          on:click={() => (username = '')}
          transition:slide
          >{user.username}
        </a>
      {/each}
    </nav>
  {/if}
</div>
