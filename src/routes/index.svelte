<script context="module">
import { get } from 'svelte/store'
import { auth } from '$lib/stores/auth'
import { loadQueries, queryOp } from '$lib/gql/urql'
import { GetTimeline } from '$lib/gql/GetTimeline'
import { GetUserInfo } from '$lib/gql/GetUserInfo'

export async function load({ fetch }) {
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
  GetTimeline.variables = {}
  GetUserInfo.variables = { username: userInfo?.username }
  await loadQueries({ fetch }, GetTimeline, GetUserInfo)
  return {}
}
</script>

<script>
import TimelineFormat from '$lib/components/TimelineFormat.svelte'
import ProfileInfo from '$lib/components/ProfileInfo.svelte'

const Timeline = queryOp(GetTimeline.query, {})()

$: photoArr = $Timeline.data?.result.data || []
</script>

<svelte:head>
  <title>Devvy - Timeline</title>
</svelte:head>

<div class="flex flex-row w-full justify-center">
  <TimelineFormat {photoArr} />
  <div class="ml-4 lg:flex flex-col w-1/5 hidden">
    <ProfileInfo username={$auth.userInfo?.username} />
  </div>
</div>
