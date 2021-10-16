<script context="module">
  export function load({ session, fetch }) {
    // we can use this for SSR
    if (!session?.token) {
      return {
        redirect: '/login',
        status: 302,
      }
    } else if (session?.userInfo.onboard) {
      return {
        redirect: '/onboard',
        status: 302,
      }
    }
    return {}
  }
</script>

<script>
  import Header from '$lib/components/Header.svelte'
  import ProfileInfo from '$lib/components/ProfileInfo.svelte'
  import NoPosts from '$lib/components/NoPosts.svelte'
  import { auth } from '$lib/stores/auth'
  auth

  let onboard = $auth.userInfo?.onboard

  $: console.log(onboard)
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
