<script context="module">
import { GetTimeline } from '$lib/gql/GetTimeline'
import { loadQueries, queryOp } from '$lib/gql/urql'

export async function load({ fetch }) {
  GetTimeline.variables = { username: '' }
  await loadQueries({ fetch }, GetTimeline)
  return {}
}
</script>

<script>
const Timeline = queryOp(GetTimeline.query, { username: '' })()

$: photoArr = $Timeline.data?.result.data || []
</script>

<svelte:head>
  <title>Devvy - Explore</title>
</svelte:head>

<div class="w-full flex flex-row justify-center mt-36">
  <ul class="flex flex-wrap justify-center px-10 relative">
    {#each photoArr as photo}
      <li class="w-max relative z-0 mr-5 mt-5">
        <img src={photo.src} width="400px" alt="{photo.author.username}'s photo" />
        <div class="opacity-0 hover:opacity-100 w-full h-full z-10 display-block absolute top-0 left-0 text-white">
          <div class="w-full h-full display-flex absolute top-0 left-0 bg-black-light opacity-40 z-20" />
          <a class="z-30 display-block absolute top-0 left-0 m-2" href="/{photo.author.username}" sveltekit:prefetch
            >{photo.author.username}</a
          >
          <div class="flex w-full h-full flex-row justify-center items-center">
            <span class="z-30 mr-5">{photo.likeCount || 0} likes</span>
            <span class="z-30">{photo.comments.data.length || 0} comments</span>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
