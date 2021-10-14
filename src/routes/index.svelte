<script context="module">
  export function load() {
    //{ session, fetch }
    // we can use this for SSR
    //if (!session?.token)
      return {
        headers: { Location: '/login' },
        status: 302,
      }

    return {}
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
