<script>
import { GetExplore } from '$lib/gql/GetExplore'

GetExplore()

$: console.dir($GetExplore.data?.result)
$: photoArr = $GetExplore.data?.result.data || []
$: console.log(photoArr)
</script>

<div class="w-full flex flex-row justify-center">
  <ul class="flex flex-wrap justify-between px-5 relative">
    {#each photoArr as photo}
      <li class="w-max relative z-0">
        <img src={photo.src} alt="{photo.author.username}'s photo" />
        <div class="opacity-0 hover:opacity-100 w-full h-full z-10 display-block absolute top-0 left-0 text-white">
          <div class="w-full h-full display-flex absolute top-0 left-0 bg-black-light opacity-40 z-20" />
          <button class="z-30 display-block absolute top-0 left-0 m-2">{photo.author.username}</button>
          <div class="flex w-full h-full flex-row justify-center items-center">
            <span class="z-30 mr-5">{photo.likeCount || 0} likes</span>
            <span class="z-30">{photo.comments.length || 0} comments</span>
          </div>
        </div>
      </li>
    {/each}
  </ul>
</div>
