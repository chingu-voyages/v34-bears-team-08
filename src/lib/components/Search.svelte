<script>
import Loader from '$components/Loader.svelte'
import { slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { SearchForUser } from '$lib/gql/SearchForUser'

let loading = false
let username = ''

async function searchQuery() {
  loading = true
  await SearchForUser({ username })
  loading = false
}
$: username && searchQuery()
$: console.log($SearchForUser.data?.result)
</script>

<div class="flex flex-col p-3">
  <input
    type="text"
    class="border w-full self-center justify-self-center outline-none"
    placeholder="find your buddies.."
    bind:value={username}
  />
  {#if loading}<Loader />{:else if SearchForUser.data?.result.data}
    <div class="z-10 border bg-white">
      {#each SearchForUser.data?.result.data as user}
        <a href="/{user.username}" class="text-black-light hover:text-blue-700">{user.username}</a>
      {/each}
    </div>
  {/if}
</div>
