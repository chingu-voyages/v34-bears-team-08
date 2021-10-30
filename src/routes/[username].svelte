<script context="module">
export function load({ page }) {
  // let username = page.params.username
  return { props: {} }
}
</script>

<script>
import ProfileInfo from '$lib/components/ProfileInfo.svelte'
import TimelineFormat from '$lib/components/TimelineFormat.svelte'
import { GetTimeline } from '$lib/gql/GetTimeline'
import { DeletePhoto } from '$lib/gql/DeletePhoto'
import { DeleteComment } from '$lib/gql/DeleteComment'
import { auth } from '$lib/stores/auth'
import { ThLarge, ListUl } from '@svicons/fa-solid'
import { page } from '$app/stores'

$: ({ username } = $page.params)
$: GetTimeline.variables = { username }
GetTimeline()
let currentUser = $auth?.userInfo.username
//get current user
//check who follows
//dispplay follow or unfollow button
$: photoArr = $GetTimeline.data?.result.data || []

const execDeletePhoto = DeletePhoto()
const execDeleteComment = DeleteComment()
async function callDeletePhoto(e) {
  let id = e.target.dataset.photoId
  if (confirm('Are you sure you want to delete this post?')) {
    const {
      data: {
        result: {
          comments: { data },
        },
      },
    } = await execDeletePhoto({ id })
    console.log(data)
    if (data.length > 0) console.log(data.length)
    data.forEach((obj) => {
      const id = obj._id
      execDeleteComment({ id })
    })
    // likes need to be deleted
  }
}

let direction = 'wrap'
</script>

<div class="flex flex-col items-center h-screen mt-10">
  <div class="flex flex-row justify-between w-3/5">
    {#key username}
      <ProfileInfo {username} {currentUser} />
    {/key}
  </div>
  <div class="flex flex-row mb-3">
    <button on:click={() => (direction = 'wrap')}>
      <ThLarge
        id="wrap"
        class="w-4 mr-3 text-black-light pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      />
    </button>
    <button on:click={() => (direction = 'col')}>
      <ListUl
        id="wrap"
        class="w-4 mr-3 text-black-light pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      />
    </button>
  </div>

  {#if direction === 'col'}
    <div class="flex flex-row justify-center w-3/5 relative">
      <TimelineFormat {photoArr} />
    </div>
  {:else}
    <ul class="flex flex-wrap justify-start w-3/5 relative">
      {#each photoArr as photo, index}
        <li class="w-max relative">
          <img src={photo.src} width="300px" alt="photo #{index + 1}" class="mt-4 z-0 mr-4" />
          {#if currentUser === username}
            <button
              class="z-10 display-block absolute top-0 right-2 mt-4 ml-3 text-white text-lg pr-4 pb-4"
              on:click={callDeletePhoto}
              data-photo-id={photo._id}
            >
              x
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
button > * {
  pointer-events: none;
}
</style>
