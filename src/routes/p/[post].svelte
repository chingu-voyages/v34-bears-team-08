<script context="module">
// export async function load() {
//   return {status: 302 }
// }
</script>

<script>
import { page } from '$app/stores'
import { GetPhoto } from '$lib/gql/GetPhoto'
import { transformMedia } from '$lib/utils'

GetPhoto({ photoID: $page.params.post })
// $: if($GetPhoto.data && Object.is($GetPhoto.data.result, null)) {
//   // redirect here because a null result means query went through & it's an invalid id
// }
$: photo = $GetPhoto.data?.result
</script>

<main class="container mx-auto my-12 max-w-screen-lg h-full flex">
  {#if photo}
    <!-- Main content -->
    <div class="flex-1 flex items-stretch overflow-hidden">
      <main class="flex-1 overflow-y-auto">
        <!-- Primary column -->
        <section
          aria-labelledby="primary-heading"
          class="min-w-0 flex-1 h-full flex flex-col overflow-hidden lg:order-last"
        >
          <h1 id="primary-heading" class="sr-only">Photos</h1>
          <!-- Your content -->
          <img
            src={transformMedia(photo.media.src, 700)}
            width="700px"
            class="rounded-md object-cover"
            alt="{photo.author.username}'s photo"
          />
        </section>
      </main>

      <!-- Secondary column (hidden on smaller screens) -->
      <aside class="hidden w-96 bg-whiteA-whiteA5 border-l border-gray-700 overflow-y-auto lg:block">
        <!-- TODO profile img -->
        <a href="/{photo.author.username}">
          {photo.author.username}
        </a>
        <!-- TODO following menu -->
        <button>following</button>
        <!-- ? extra actions menu, e.g. copy link & unfollow -->
        <button>...</button>
        {#each photo.comments.data as { author, text, _id }}
          <!-- ? extra credit: Popover w/ thumbnails & details -->
          <span>{author}</span>
          <span>{text}</span>
          <!-- ? extra credit: date posted comment -->
          <!-- ? unnecessary: like comment -->
        {/each}
        <!-- TODO: Heart/like -->
        <!-- TODO post comment -->
        <!-- ? extra credit: star the photo -->
      </aside>
    </div>
  {/if}
</main>
