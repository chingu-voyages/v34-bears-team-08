<script context="module">
  
  export function load({ session, fetch }) {
    // we can use this for SSR
    //!session?.token
    if(false)
    return {
      redirect: '/login',
      status: 302,
    }
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

