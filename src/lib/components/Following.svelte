<script>
export let following
$: console.log(following)
</script>

<ul class="flex flex-col items-center">
  {#if !following.length}
    <li>You're not following anyone!!</li>
  {/if}
  {#each following as user}
    <a class="w-full p-4 text-center" href="/{user.follows.username}">{user.follows.username}</a>
  {/each}
</ul>
