<script>
import { FollowUser } from '$lib/gql/FollowUser'
import { GetFollowUsers } from '$lib/gql/GetFollowUsers'
import Modal from './Modal.svelte'
export let followers = false,
  username

const execFollowUser = FollowUser()
GetFollowUsers({ username, followers })
$: users = $GetFollowUsers.data?.result.data || []
</script>

<Modal let:title on:close>
  <div class="flex flex-col w-full">
    <h2 class="text-center py-4 font-bold" use:title>{followers ? 'Followers' : 'Following'}</h2>
    <hr class="text-whiteA-whiteA11" />
    <ul class="overflow-y-auto h-80 flex flex-col">
      {#each users as { username, followedByUser, _id }, i (_id)}
        <li class="text-center p-4 flex">
          <!-- Placeholder, use profile pic later -->
          <a href="/{username}" class="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gray-500">
            <span class="text-lg font-medium leading-none text-white">{username[0]}</span>
          </a>
          <div class="ml-4">
            <a class="w-full font-semibold" href="/{username}">{username}</a>
          </div>
          <button
            class="ml-auto p-2 rounded-md {followedByUser ? 'border-whiteA-whiteA8 border' : 'bg-amber-amber8'}"
            on:click={() => execFollowUser({ id: _id, value: !followedByUser, user: users[i] })}
            >{followedByUser ? 'Following' : 'Follow'}
          </button>
        </li>
      {:else}
        <li class="inline-block text-center m-auto">Loading...</li>
      {/each}
    </ul>
  </div>
</Modal>
