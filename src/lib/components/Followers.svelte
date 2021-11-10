<script>
import Frown from '@svicons/fa-solid/frown.svelte'
export let followers
</script>

<ul class="flex flex-col w-full">
  {#if !followers.length}
    <li class="inline-block">
      You have no followers <Frown class="w-8 sm:w-6" />
    </li>
  {/if}
  {#each followers as user}
    <a class="w-full" href="/{user.follows.username}">
      <li class="text-center p-4">{user.follows.username}</li>
    </a>
  {/each}
</ul>
