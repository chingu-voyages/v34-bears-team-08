<script context="module">
import { loadQueries, queryOp } from '$lib/gql/urql'
import { GetTimeline } from '$lib/gql/GetTimeline'
import { GetUserInfo } from '$lib/gql/GetUserInfo'

export async function load({ page, fetch }) {
  const { username } = page.params
  // let username = page.params.username
  GetUserInfo.variables = GetTimeline.variables = { username }
  await loadQueries({ fetch }, GetTimeline, GetUserInfo)
  return {}
}
</script>

<script>
import ProfileInfo from '$lib/components/ProfileInfo.svelte'
import TimelineFormat from '$lib/components/TimelineFormat.svelte'
import { DeletePhoto } from '$lib/gql/DeletePhoto'
import { DeleteComment } from '$lib/gql/DeleteComment'
import { apiReq, auth } from '$lib/stores/auth'
import { ThLarge, ListUl } from '@svicons/fa-solid'
import { page } from '$app/stores'

$: ({ username } = $page.params)
const Timeline = queryOp(GetTimeline.query)
$: Timeline.variables = { username }
Timeline()
let currentUser = $auth?.userInfo.username
//get current user
//check who follows
//dispplay follow or unfollow button
$: photoArr = $Timeline.data?.result.data || []

const execDeletePhoto = DeletePhoto()
const execDeleteComment = DeleteComment()

let direction = 'wrap'
</script>

<main class="flex flex-col items-center min-h-screen mt-36">
  <div class="flex flex-row justify-between w-3/5 max-w-screen-lg">
    {#key username}
      <ProfileInfo {username} />
    {/key}
  </div>
  <div class="flex flex-row m-8">
    <button on:click={() => (direction = 'wrap')}>
      <ThLarge id="wrap" class="w-4 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" />
    </button>
    <button on:click={() => (direction = 'col')}>
      <ListUl id="wrap" class="w-4 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" />
    </button>
  </div>

  {#if direction === 'col'}
    <div class="flex flex-row justify-center w-full relative">
      <TimelineFormat {photoArr} />
    </div>
  {:else}
    <ul
      class="grid gap-10 justify-center sm:grid-cols-[repeat(2,300px)] sm:justify-around lg:grid-cols-[repeat(3,300px)] lg:justify-between w-full max-w-screen-lg relative"
    >
      {#each photoArr as photo, index}
        <li class="w-max relative">
          <img src={photo.media.src} width="300px" alt="photo #{index + 1}" class="z-0" />
          {#if currentUser === username}
            <button
              class="z-0 display-block absolute top-0 right-2 mt-4 ml-3 text-white text-lg pr-4 pb-4"
              on:click={async function callDeletePhoto(e) {
                const id = photo._id
                if (confirm('Are you sure you want to delete this post?')) {
                  await apiReq.delete('/media', { body: { fileId: photo.media.id } })

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
                  // TODO likes need to be deleted
                  // Tip: You can actually execute multiple mutations at once in a single query. Also to "connect" there is also "disconnect", which serves the same purposes as deleting, in fact you could provide a whole array of disconnects and delete everything in one query.
                }
              }}
            >
              x
            </button>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</main>
