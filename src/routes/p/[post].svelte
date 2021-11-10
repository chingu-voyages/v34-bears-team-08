<!-- TODO Extra credit: modal for photo viewing on using history pushState or otherwise on time line components... Not important though -->
<script context="module">
// TODO preload post data
// export async function load() {
//   return {status: 302 }
// }
</script>

<script>
import { page } from '$app/stores'
import { GetPost } from '$lib/gql/GetPost'
import { CreateComment } from '$lib/gql/CreateComment'
import { sleep, transformMedia } from '$lib/utils'
import { auth } from '$lib/stores/auth'
import { LikePhoto } from '$lib/gql/LikePhoto'
import { HeartFill, Heart, Star, StarFill } from '@svicons/bootstrap'
import Modal from '$lib/components/Modal.svelte'
import { ChatDelete } from '@svicons/remix-line'
import { DeleteComment } from '$lib/gql/DeleteComment'

let currentUser = $auth.userInfo?.username
const execLikePhoto = LikePhoto(),
  execCreateComment = CreateComment(),
  execDeleteComment = DeleteComment()
$CreateComment.fetching = false

let text

GetPost({ id: $page.params.post })
// $: if($GetPhoto.data && Object.is($GetPhoto.data.result, null)) {
//   //
// }
$: ({ photo, author, likedByUser: postLikedByUser } = $GetPost.data?.result || {})
$: likedByUser = photo?.likedByUser != null ? photo.likedByUser : postLikedByUser // null/undefined check, get from cache if it exists
$: if (!$GetPost.fetching) {
  // if (!$GetPhoto.data.result) {
  //   // redirect here because no result means query went through & it's an invalid id
  //   // this is NOT a very common occurrence so don't worry about doing it on client side
  // }
}
let followingOpen
</script>

<div class="container mx-auto my-12 max-w-screen-lg h-full">
  {#if photo}
    <!-- Main content -->
    <div class="grid justify-center md:grid-cols-[1.5fr,1fr] rounded-md overflow-hidden md:bg-whiteA-whiteA5">
      <main>
        <!-- Primary column -->
        <section aria-labelledby="primary-heading" class="h-full">
          <h1 id="primary-heading" class="sr-only">Photos</h1>
          <!-- Your content -->
          <img src={transformMedia(photo.media.src, 700)} class="rounded-md" alt="{author.username}'s photo" />
        </section>
      </main>

      <!-- Secondary column (hidden on smaller screens) -->
      <aside class="hidden border-l p-4 border-gray-700 overflow-y-auto h-auto md:block">
        <!-- TODO profile img -->
        <a href="/{author.username}">
          {author.username}
        </a>
        <!-- TODO following menu -->

        <button on:click={() => (followingOpen = true)}>following</button>
        {#if followingOpen}
          <Modal let:title on:close={() => (followingOpen = false)}>
            <h2 use:title>Following</h2>
            <!-- TODO each list over followers. THIS IS NOT A MENU, merely a modal. -->
          </Modal>
        {/if}
        <!-- ? extra actions menu, e.g. copy link & unfollow -->
        <button>...</button>
        {#each photo.comments.data as { author, text, _id }}
          <!-- ? extra credit: Popover w/ thumbnails & details -->
          <div class="flex justify-between">
            <div class="flex mb-2">
              <a class="mr-1 font-semibold text-whiteA-whiteA11" href="/{author.username}">
                <img
                  class="rounded-full w-5 inline-block mr-2"
                  src="https://picsum.photos/20"
                  alt="{author.username}'s avatar"
                />
                <span>{author.username} </span>
              </a>
              <span>{text}</span>
            </div>
            {#if author.username === currentUser}
              <button
                class="w-5 text-gray-300 hover:text-whiteA-whiteA8"
                on:click={() => execDeleteComment({ id: _id, photoID: photo._id })}
              >
                <ChatDelete />
              </button>
            {/if}
          </div>
          <!-- ? extra credit: date posted comment -->
          <!-- ? unnecessary: like comment -->
        {/each}
        <!-- TODO: Heart/like -->
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <button
              class="w-4 h-4 mr-2 mt-[0.1rem]"
              on:click={async () => {
                await execLikePhoto({ id: photo._id, value: !likedByUser, photo })
                console.log('Executed like photo', LikePhoto.data)
              }}
            >
              {#if likedByUser}
                <HeartFill class="text-red-500" fill="none" />
              {:else}
                <Heart />
              {/if}
            </button>
            <span>{photo.likeCount || 0} likes</span>
          </div>
          <!-- ? extra credit: star the photo -->
          <button class="w-4">
            <Star />
          </button>
        </div>

        <!-- TODO post comment -->
        <form
          class="my-2 display-block relative w-full"
          on:submit|preventDefault={async () =>
            text &&
            !$CreateComment.fetching &&
            (await execCreateComment({
              text,
              posted: new Date().toISOString(),
              photo: photo._id,
              author: $auth?.userInfo._id,
            })) &&
            // TODO: Set scroll height to container when comment created
            // postReady = true
            // await sleep(400)
            // let height = commentsEl.scrollHeight + 100
            // commentsEl.scrollTo({ top: height, behavior: 'smooth' })
            (text = '')}
        >
          <input
            type="text"
            name="comment"
            class="w-full p-2 outline-none rounded-md z-0 border-l-4 border-amber-amber8"
            placeholder="Add a comment..."
            bind:value={text}
          />
          <button type="submit" class="z-0 display-block absolute top-2 right-2 text-amber-amber8 hover:text-blue-400">
            Post
          </button>
        </form>
      </aside>
    </div>
  {/if}
</div>
