<script>
export let following
$: console.log(following)
</script>

<ul>
    {#if !following.length}
    <li>You're not following anyone!!</li>
    {/if}
  {#each following as user}
    <li class="flex flex-row">
      <a href="/{user.follows.username}">{user.follows.username}</a>
    </li>
  {/each}
</ul>
