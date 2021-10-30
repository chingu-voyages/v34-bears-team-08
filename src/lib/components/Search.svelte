<script>
import Loader from '$components/Loader.svelte'
import { slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { SearchForUser } from '$lib/gql/SearchForUser'

let loading = false
let username = ""

async function searchQuery(username) {
  loading = true
  await SearchForUser({ username })
  loading = false
}
$: searchQuery(username)
$: console.log($SearchForUser.data?.result)
</script>

<div class="flex flex-col p-3">
  <input
    type="text"
    class="border h-10 self-center justify-self-center"
    placeholder="find your buddies.."
    bind:value={username}
  />
  <div transition:slide={{ delay: 0, duration: 300, easing: quintOut }}>
    {#if loading}<Loader />{:else if SearchForUser.data?.result}{SearchForUser.data?.result}{/if}
  </div>
</div>
