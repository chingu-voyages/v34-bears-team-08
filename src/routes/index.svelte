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
import {GetTimeline} from '$lib/gql/GetTimeline'

let currentUser = $auth.userInfo?.username

GetTimeline()

$: photoArr = GetTimeline.data?.result.data || []
</script>

<svelte:head>
  <title>Devvy - Timeline</title>
</svelte:head>

<div class="flex flex-row w-full justify-center">
  <ul class="flex flex-col w-1/2 items-center">
    {#if photoArr.length === 0 || !photoArr}
      <div class="flex flex-col w-3/4 h-80 bg-gray-50 text-center rounded-sm pb-36 justify-between">
        <div class="w-full bg-gray-300 py-2 rounded-sm">
          <h4 class="text-black-light">Your feed is empty!</h4>
        </div>
        <p class="text-gray-500 self-center">Follow people to see their recent activity.</p>
      </div>
    {:else}
      {#each photoArr as photo}
        <li>
          <span>{photo.author.username}</span>
          <img src={photo.src} width="500px" alt="{photo.author.username}'s photo" />
          <span>{photo.likeCount || 0} likes</span>
          <div>
            <span>Comments</span>
            <ul>
              {#each photo.comments.data as comment}
                <li>
                  <!--Should username be a link to the user account?-->
                  <span>{comment.author.username} {comment.text}</span>
                </li>
              {/each}
            </ul>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
  <div class="flex flex-col w-1/5">
    <ProfileInfo username={currentUser} />
  </div>
</div>
