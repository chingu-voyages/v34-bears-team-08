<script>
import { Heart, AngleRight, HeartBroken, AngleDown, Pen, Times } from '@svicons/fa-solid'
import { slide } from 'svelte/transition'
import { quintOut } from 'svelte/easing'
import { fade } from 'svelte/transition'
import { PostNewComment } from '$lib/gql/PostNewComment'
import { DeleteComment } from '$lib/gql/DeleteComment'
import { auth } from '$lib/stores/auth'
import { LikePhoto } from '$lib/gql/LikePhoto'

let currentUser = $auth.userInfo?.username

const execPostNewComment = PostNewComment()

let text = ''
let newComment = {}
let displayComments
function toggleCommentDisplay(e) {
  const photoIndex = Number(e.target.dataset.photoIndex)
  if (displayComments != photoIndex) {
    displayComments = photoIndex
  }

  console.log(displayComments)
}

function postComment(e) {
  const photo = e.target.dataset.photoId
  const posted = new Date().toISOString()
  const author = $auth?.userInfo._id
  const index = e.target.dataset.index
  if (text && posted && photo && author) {
    execPostNewComment({ text, posted, photo, author })
  }
  newComment = { username: currentUser, text: text, index }
  displayComments = true
  setTimeout(() => {
    let commentsContainer = document.getElementById('comments')
    let height = commentsContainer.scrollHeight + 100
    commentsContainer.scrollTo({
      top: height,
      behavior: 'smooth',
    })
  }, 250)

  text = ''
}

const execDeleteComment = DeleteComment()

function deleteComment(e) {
  const id = e.target.dataset.commentId || e.target.parentNode.dataset.commentId
  execDeleteComment({ id })
}

const execLikePhoto = LikePhoto()

async function likePhoto(e) {
  const id = e.target.dataset.photoId
  console.log(id)
  await execLikePhoto({ id })
}

$: console.dir(execLikePhoto.data?.result)
$: console.log(execLikePhoto.error)

export let photoArr
</script>

<ul class="flex flex-col">
  {#if photoArr.length === 0 || !photoArr}
    <div class="flex flex-col w-3/4 h-80 bg-gray-50 text-center rounded-sm pb-36 justify-between">
      <div class="w-full bg-gray-300 py-2 rounded-sm">
        <h4 class="text-black-light">Your feed is empty!</h4>
      </div>
      <p class="text-gray-500 self-center">Follow people to see their recent activity.</p>
    </div>
  {:else}
    {#each photoArr as photo, index}
      <li class="mx-4 mb-4 max-w-photo">
        <div class="border-t border-l border-r border-gray-300 w-full py-3 px-2 rounded-t-sm">
          <span>{photo.author.username}</span>
        </div>
        <img
          src={photo.src}
          width="700px"
          class="border-l border-r border-gray-200"
          alt="{photo.author.username}'s photo"
        />
        <div class="border-b border-l border-r border-gray-300 w-full max-w-full p-2 flex flex-col rounded-b-sm">
          <div class="inline-block">
            <button data-photo-id={photo._id} on:click={likePhoto}>
              <Heart
                class="w-4 mr-3 text-black-light"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                data-photo-id={photo._id}
              />
            </button>
          </div>
          <span>{photo.likeCount || 0} likes</span>
          <button class="inline-flex items-center" on:click={toggleCommentDisplay} data-photo-index={index}>
            View comments {#if displayComments != index}
              <AngleRight
                class="w-2 ml-1 pt-0.5 text-black-light"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              />
            {:else}
              <AngleDown
                class="w-3 ml-1 pt-0.5 text-black-light"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              />
            {/if}
          </button>

          {#if displayComments === index}
            <ul
              class="flex flex-col max-w-full overflow-y-scroll max-h-28"
              id="comments"
              transition:slide={{ delay: 0, duration: 300, easing: quintOut }}
            >
              {#if photo.comments.data.length === 0}
                <li>Be the first to comment!</li>
              {/if}
              {#each photo.comments.data as comment}
                <li class="flex flex-row justify-between w-full px-2">
                  <!--Should username be a link to the user account?-->
                  <div class="inline-block">
                    <span class="text-gray-400">{comment.author.username}</span>
                    <span>{comment.text}</span>
                  </div>
                  {#if comment.author.username === currentUser}
                    <div class="flex flex-row">
                      <button data-comment-id={comment._id}>
                        <Pen
                          class="w-3 mr-3 text-gray-300 hover:text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        /></button
                      >
                      <button data-comment-id={comment._id} on:click={deleteComment}>
                        <Times
                          class="w-3 mr-3 text-gray-300 hover:text-gray-800"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          data-comment-id={comment._id}
                        /></button
                      >
                    </div>
                  {/if}
                </li>
              {/each}
              {#if newComment.username && newComment.text}
                <li class="inline-block" transition:fade={{ delay: 250, duration: 300 }}>
                  <!--Should username be a link to the user account?-->
                  <span class="text-gray-400">{newComment.username}</span>
                  <span>{newComment.text}</span>
                </li>
              {/if}
            </ul>
          {/if}

          <div class="display-block relative w-full">
            <input
              type="text"
              name="comment"
              class="w-full bg-gray-50 p-2 border border-gray-300 rounded-sm z-0"
              placeholder="add a comment..."
              bind:value={text}
            />
            <button
              on:click={postComment}
              data-photo-id={photo._id}
              class="z-10 display-block absolute top-2 right-2 text-blue-300 hover:text-blue-400">post</button
            >
          </div>
        </div>
      </li>
    {/each}
  {/if}
</ul>

<style>
.max-w-photo {
  max-width: 700px;
}
</style>
