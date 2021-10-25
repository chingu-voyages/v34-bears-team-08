<script context="module">
import { get } from 'svelte/store'
import { auth } from '$lib/stores/auth'
import { Heart, AngleRight, HeartBroken, AngleDown } from '@svicons/fa-solid'
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
import { GetTimeline } from '$lib/gql/GetTimeline'

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
        <li class=" mb-4">
          <div class="border-t border-l border-r border-gray-400 w-full py-3 px-2 rounded-t-sm">
            <span>{photo.author.username}</span>
          </div>
          <img src={photo.src} width="700px" alt="{photo.author.username}'s photo" />
          <div class="border-b border-l border-r border-gray-400 w-full p-2 flex flex-col rounded-b-sm">
            <div class="inline-block">
              <button>
                <Heart
                  class="w-4 mr-3 text-black-light"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                />
              </button>
            </div>
            <span>{photo.likeCount || 0} likes</span>
            <button class="inline-flex items-center">
              View comments
              <AngleRight
                class="w-2 ml-1 pt-0.5 text-black-light"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              /></button
            >
            <ul>
              {#each photo.comments.data as comment}
                <li>
                  <!--Should username be a link to the user account?-->
                  <span>{comment.author.username} {comment.text}</span>
                </li>
              {/each}
            </ul>
            <div class="display-block relative w-full">
              <input
                type="text"
                name="comment"
                class="w-full bg-gray-50 p-2 border border-gray-300 rounded-sm z-0"
                placeholder="add a comment..."
              />
              <button class="z-10 display-block absolute top-2 right-2 text-blue-300 hover:text-blue-400">post</button>
            </div>
          </div>
        </li>
      {/each}
    {/if}
  </ul>
  <div class="flex flex-col w-1/5">
    <ProfileInfo username={currentUser} />
  </div>
</div>
