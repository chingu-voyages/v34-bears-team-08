<script>
import { GetFollowUsers } from '$lib/gql/GetFollowUsers'
import Frown from '@svicons/fa-solid/frown.svelte'
import Modal from './Modal.svelte'
export let followers = false,
  username

GetFollowUsers({ username, followers })
$: users = $GetFollowUsers.data?.result.data || []
</script>

<Modal on:close>
  <ul class="flex flex-col w-full">
    {#if !$GetFollowUsers.fetching}
      {#each users as { username, ...user }}
        <a class="w-full" href="/{username}">
          <li class="text-center p-4">{username}</li>
        </a>
      {:else}
        <li class="inline-block">
          Nobody <Frown class="w-8 sm:w-6" />
        </li>
      {/each}
    {:else}
      <li class="inline-block">Loading...</li>
    {/if}
  </ul>
</Modal>
