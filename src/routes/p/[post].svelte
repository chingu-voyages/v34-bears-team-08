<!-- TODO Extra credit: modal for photo viewing on using history pushState or otherwise on time line components... Not important though -->
<script context="module">
// export async function load() {
//   return {status: 302 }
// }
</script>

<script>
import { page } from '$app/stores'
import Menu from '$lib/components/Menu.svelte'
import { GetPost } from '$lib/gql/GetPost'
import { transformMedia } from '$lib/utils'

GetPost({ id: $page.params.post })
// $: if($GetPhoto.data && Object.is($GetPhoto.data.result, null)) {
//   //
// }
$: ({ photo, author } = $GetPost.data || {})
$: if (!$GetPost.fetching) {
  // if (!$GetPhoto.data.result) {
  //   // redirect here because no result means query went through & it's an invalid id
  //   // this is NOT a very common occurrence so don't worry about doing it on client side
  // }
}
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
            alt="{author.username}'s photo"
          />
        </section>
      </main>

      <!-- Secondary column (hidden on smaller screens) -->
      <aside class="hidden w-96 bg-whiteA-whiteA5 border-l border-gray-700 overflow-y-auto lg:block">
        <!-- TODO profile img -->
        <a href="/{author.username}">
          {author.username}
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
        <button>like</button>
        <!-- TODO post comment -->
        <input type="text" placeholder="say something I'm giving up on you" />
        <!-- ? extra credit: star the photo -->
      </aside>
    </div>
  {/if}
</main>
