<script>
import { createEventDispatcher } from 'svelte'
import { useDialog } from 'sashui'
import { fade, fly } from 'svelte/transition'
import { imagekit } from '$lib/utils/imagekit'
import { CreatePhoto } from '$lib/gql/CreatePhoto'
import { auth } from '$lib/stores/auth'

const dispatch = createEventDispatcher()
const close = () => dispatch('close')
const dialog = useDialog()
const execCreatePhoto = CreatePhoto()

let files = null,
  caption,
  uploading = false,
  err

function uploadPost() {
  const fileOptions = {
    file: files[0],
    fileName: files[0].name || 'default.jpg',
    tags: [''],
  }
  uploading = true
  imagekit.upload(fileOptions, async (error, result) => {
    if (error) {
      err = `Something went wrong Please try again`
      console.log(error)
    } else {
      // result has TS support! Use VSCode intellisense to get the image types
      // Save the url and maybe a transformation with a smaller image and a thumbnail to the db query to create the post
      await execCreatePhoto({ id: $auth.userInfo?._id, src: result.url, posted: new Date().toISOString(), caption })
      uploading = false
      files = null
      caption = ''
    }
  })
}
</script>

<div class="modal-bg z-10" use:dialog.overlay transition:fade={{ duration: 500 }} />
<div
  class="flex flex-col items-center content-center bg-white modal z-30 drop-shadow-md fixed left-1/2 top-1/2 w-[26rem] h-80 translate-x-[-50%] translate-y-[-50%] transform-gpu rounded-2xl"
  use:dialog
  on:close
  transition:fly={{ y: -15, duration: 250 }}
>
  <svg
    class="modal-close absolute -top-3 -right-3 w-6 h-6 cursor-pointer fill-[#000] transition-transform duration-300 hover:scale-125"
    on:click={close}
    viewBox="0 0 12 12"
  >
    <circle cx="6" cy="6" r="6" />
    <line class="line" x1="3" y1="3" x2="9" y2="9" />
    <line class="line" x1="9" y1="3" x2="3" y2="9" />
  </svg>
  {#if !uploading}
    <div class="modal-content w-full h-full">
      <h2 class="w-full text-center text-lg font-bold px-2 py-3 mb-2 border-b-2">Create new post</h2>
      {#if err}
        <p>{err}</p>
      {/if}
      <form class="w-full flex flex-col justify-center items-center " on:submit|preventDefault={uploadPost}>
        {#if !files}
          <label
            for="fileUpload"
            class="cursor-pointer inline-block absolute top-1/2 font-medium rounded-xl px-5 py-2 bg-gray-100"
          >
            Select an Image for Upload
            <input type="file" id="fileUpload" name="fileUpload" class="my-5 hidden" accept="image/*" bind:files />
          </label>
        {:else}
          <textarea
            class="w-full focus:outline-none p-5"
            name="caption"
            id="caption"
            bind:value={caption}
            cols="3"
            rows="2"
            placeholder="Write a caption"
          />
          {#if caption}
            <button class="absolute bottom-0  mb-4 rounded-lg border-none px-7 py-2 bg-gray-100 font-bold" type="submit"
              >Post</button
            >
          {/if}
        {/if}
      </form>
    </div>
  {:else}
    <h4>Uploading post.. Please wait</h4>
  {/if}
</div>

<style>
.modal-bg {
  background: #4448;
  @apply fixed top-0 left-0 right-0 bottom-0;
}

.line {
  stroke: #fff;
  stroke-width: 2;
}
/* .modal-content {
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
    overflow: auto;
} */

input[type='file']::file-selector-button {
  border: 2px solid gray;
  padding: 0.2em 0.4em;
  border-radius: 0.2em;
  background-color: #fff;
  transition: 1s;
}

input[type='file']::file-selector-button:hover {
  background-color: #81ecec;
  border: 2px solid #00cec9;
}
</style>
