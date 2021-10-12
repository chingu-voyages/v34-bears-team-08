<script>
  export let username;
</script>

<div class="flex border-b border-gray-primary h-4 p-4 py-8">
    <div class="flex items-center">
      <a href={`/p/${username}`} class="flex items-center">
        <img
          class="rounded-full h-8 w-8 flex mr-3"
          src={`/images/avatars/${username}.jpg`}
          alt={`${username} profile picture`}
        />
        <p class="font-bold">{username}</p>
      </a>
    </div>
  </div>