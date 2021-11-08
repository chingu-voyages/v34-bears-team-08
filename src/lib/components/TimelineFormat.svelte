<script>
import { AngleRight, AngleDown } from '@svicons/fa-solid'
import { Heart, HeartFill, ThreeDots } from '@svicons/bootstrap'
import { ChatDelete } from '@svicons/remix-line'
import { slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { CreateComment } from '$lib/gql/CreateComment'
import { DeleteComment } from '$lib/gql/DeleteComment'
import { auth } from '$lib/stores/auth'
import { LikePhoto } from '$lib/gql/LikePhoto'
import { sleep, transformMedia } from '$lib/utils'
import { useMenu } from 'sashui'
import Modal from './Modal.svelte'
export let photoArr

let currentUser = $auth.userInfo?.username

const execCreateComment = CreateComment()
$CreateComment.fetching = false

let text = '',
  displayComments,
  commentsEl,
  postReady = true

const execDeleteComment = DeleteComment()

const execLikePhoto = LikePhoto()
let optsOpen = false,
  curPhotoID
</script>

<ul class="flex flex-col">
  {#each photoArr as photo, index}
    <li class="mx-4 mb-4 max-w-[700px]">
      <div class="py-3 ml-4 rounded-t-sm flex justify-between">
        <span class="font-semibold">{photo.author.username}</span>
        <button class="w-6" aria-expanded={optsOpen} on:click={() => (curPhotoID = photo._id) && (optsOpen = true)}>
          <ThreeDots />
        </button>
      </div>
      <img
        src={transformMedia(photo.media.src, 700)}
        width="700px"
        class="rounded-md"
        alt="{photo.author.username}'s photo"
      />
      <div class="w-full max-w-full p-2 flex flex-col rounded-b-sm pt-4 px-4">
        <div class="flex items-center">
          <button
            class="w-4 h-4 mr-2"
            on:click={async () => {
              await execLikePhoto({ id: photo._id, value: !photo.likedByUser, photo })
              console.log('Executed like photo', LikePhoto.data)
            }}
          >
            {#if photo.likedByUser}
              <HeartFill class="text-red-500" />
            {:else}
              <Heart />
            {/if}
          </button>
          <span>{photo.likeCount || 0} likes</span>
        </div>
        <button
          class="inline-flex items-center my-2"
          on:click={function toggleCommentDisplay() {
            displayComments = displayComments == index ? null : index
          }}
        >
          View comments
          {#if displayComments != index}
            <AngleRight class="w-2 ml-1 pt-0.5" />
          {:else}
            <AngleDown class="w-3 ml-1 pt-0.5" />
          {/if}
        </button>

        {#if displayComments === index}
          <ul class="flex flex-col max-w-full overflow-y-auto max-h-28" bind:this={commentsEl}>
            {#each photo.comments.data as comment (comment._id)}
              <li
                class="flex flex-row justify-between w-full px-2"
                transition:slide={{ duration: 300, easing: quintOut }}
              >
                <!--Should username be a link to the user account?-->
                <div class="inline-block">
                  <span class="text-gray-400">{comment.author.username}</span>
                  <span>{comment.text}</span>
                </div>
                <div class="flex flex-row">
                  {#if comment.author.username === currentUser}
                    <button
                      class="w-5 mr-3 text-gray-300 hover:text-gray-800"
                      on:click={() => execDeleteComment({ id: comment._id, photoID: photo._id })}
                    >
                      <ChatDelete />
                    </button>
                  {:else}
                    <!-- TODO Like a comment... separate type Query field for CommentPage to obtain likedByUser, but in the same query -->
                    <button class="w-4" aria-label="like">
                      <Heart />
                      <!-- <HeartFill/> -->
                    </button>
                  {/if}
                </div>
              </li>
            {:else}
              <li>Be the first to comment!</li>
            {/each}
          </ul>
        {/if}

        <form
          class="-ml-2 my-2 display-block relative w-full"
          on:submit|preventDefault={async function postComment() {
            if (!text || $CreateComment.fetching) return
            await execCreateComment({
              text,
              posted: new Date().toISOString(),
              photo: photo._id,
              author: $auth?.userInfo._id,
            })
            text = ''
            displayComments = index
            await sleep(400)
            let height = commentsEl.scrollHeight + 100
            commentsEl.scrollTo({ top: height, behavior: 'smooth' })
          }}
        >
          <input
            type="text"
            name="comment"
            class="w-full p-2 outline-none rounded-md z-0 border-l-4 border-amber-amber8 "
            placeholder="Add a comment..."
            bind:value={text}
          />
          <button type="submit" class="z-0 display-block absolute top-2 right-2 text-amber-amber8 hover:text-blue-400">
            Post
          </button>
        </form>
      </div>
    </li>
  {:else}
    <div class="flex flex-col w-3/4 h-80 bg-gray-50 text-center rounded-sm pb-36 justify-between">
      <div class="w-full bg-gray-300 py-2 rounded-sm">
        <h4 class="text-black-light">Your feed is empty!</h4>
      </div>
      <p class="text-gray-500 self-center">Follow people to see their recent activity.</p>
    </div>
  {/each}
</ul>

{#if optsOpen}
  <Modal on:close={() => (optsOpen = false)}>
    <a href="/p/{curPhotoID}" sveltekit:prefetch>Go to post</a>
  </Modal>
{/if}
