<script context="module">
  import Header from '$lib/components/Header.svelte'
  import ProfileInfo from '$lib/components/ProfileInfo.svelte'
  export function load({ session, fetch }) {
    // we can use this for SSR
    //!session?.token
    if (false)
      return {
        redirect: '/login',
        status: 302,
      }
    return {}
  }
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<Header />
<div class="flex flex-row w-full justify-center">
  <div class="flex flex-col w-1/2 items-center">
    <div>This will be a post</div>
    <div>This will be a post</div>
    <div>This will be a post</div>
  </div>
  <div class="flex flex-col w-1/5">
    <ProfileInfo />
  </div>
</div>
