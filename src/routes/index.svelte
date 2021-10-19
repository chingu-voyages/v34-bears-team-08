<script context="module">
  import { get } from 'svelte/store'
  import { auth } from '$lib/stores/auth'
  export function load({ fetch }) {
    const { token, userInfo } = get(auth)
    // we can use this for SSR
    if (!token) {
      return {
        redirect: '/login',
        status: 302,
      }
    } else if (userInfo?.onboard) {
      return {
        redirect: '/onboard',
        status: 302,
      }
    }
    return {}
  }
</script>

<script>
  import ProfileInfo from '$lib/components/ProfileInfo.svelte'
  import NoPosts from '$lib/components/NoPosts.svelte'

  let onboard = $auth.userInfo?.onboard

</script>

<svelte:head>
  <title>Devvy - Timeline</title>
</svelte:head>

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
