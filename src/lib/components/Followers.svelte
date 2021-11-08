<script>
import Frown from '@svicons/fa-solid/frown.svelte'

export let followers
$: console.log(followers)
</script>

<ul>
  {#if !followers.length}
    <li class="inline-block">
      You have no followers <Frown
        class="w-8 sm:w-6"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      />
    </li>
  {/if}
  {#each followers as user}
    <li class="flex flex-row">
      <span>{user.follows.id}</span>
    </li>
  {/each}
</ul>
