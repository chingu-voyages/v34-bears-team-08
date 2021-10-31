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
import { GetTimeline } from '$lib/gql/GetTimeline'
import TimelineFormat from '$lib/components/TimelineFormat.svelte'
import ProfileInfo from '$lib/components/ProfileInfo.svelte'

let currentUser = $auth?.userInfo.username

GetTimeline({})

$: photoArr = $GetTimeline.data?.result.data || []
</script>

<svelte:head>
  <title>Devvy - Timeline</title>
</svelte:head>

<div class="flex flex-row w-full justify-center">
  <TimelineFormat {photoArr} />
  <div class="ml-4 lg:flex flex-col w-1/5 hidden">
    <ProfileInfo username={currentUser} />
  </div>
</div>
