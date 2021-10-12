<script context="module">
  export function load({ session, fetch }) {
    // we can use this for SSR
    return {}
  }
</script>

<script>
  import Header from '$components/header.svelte'
  import Loader from '$lib/components/loader.svelte'
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>
