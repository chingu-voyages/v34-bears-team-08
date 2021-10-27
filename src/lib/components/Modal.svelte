<script>
import { createEventDispatcher, onMount } from 'svelte'
import ImageKit from 'imagekit-javascript'

const dispatch = createEventDispatcher()
const close = () => dispatch('close')

let modal,
  files = null,
  caption,
  uploading = false,
  uploadedImage,
  err
const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_END_POINT,
  authenticationEndpoint: import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_END_POINT,
})

function uploadPost() {
  const fileOptions = {
    file: files[0],
    fileName: files[0].name || 'default.jpg',
    tags: [''],
  }
  uploading = true
  imagekit.upload(fileOptions, (error, result) => {
    if (error) {
      err = `Something went wrong Please try again`
      console.log(error)
    } else {
      uploadedImage = result //Object with the urls and the transformations
      // Save the url and maybe a transformation with a smaller image and a thumbnail to the db
      console.log(result)
      // query to create the post and save to the database
      //     uploading =false;
      //     files = null;
      //     caption = ''
      return result
    }
  })
}

function handleKeydown(e) {
  if (e.key == 'Escape') return close()

  if (e.key == 'Tab') {
    // trap focus
    const nodes = modal.querySelectorAll('*')
    const tabbable = Array.from(nodes).filter((n) => n.tabIndex >= 0)

    let index = tabbable.indexOf(document.activeElement)
    if (index === -1 && e.shiftKey) index = 0

    index += tabbable.length + (e.shiftKey ? -1 : 1)
    index %= tabbable.length

    tabbable[index].focus()
    e.preventDefault()
  }
}

let prevFocused
onMount(() => {
  prevFocused = document.activeElement
  return () => prevFocused?.focus()
})
</script>

<svelte:window on:keydown={handleKeydown} />
<div class="modal-bg" on:click={close} />
<div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
  <svg class="modal-close" on:click={close} viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="6" />
    <line x1="3" y1="3" x2="9" y2="9" />
    <line x1="9" y1="3" x2="3" y2="9" />
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
            <input type="file" id="fileUpload" name="fileUpload" class="my-5 hidden" bind:files />
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #4448;
}

.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  width: calc(100vw - 6em);
  width: 26em;
  height: calc(100vh - 12em);
  overflow: none;
  transform: translate(-50%, -50%);
  border-radius: 1em;
  background: white;
  filter: drop-shadow(5px 5px 5px #555);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.modal-close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  fill: #000;
  transition: transform 0.3s;
}

.modal-close:hover {
  transform: scale(2);
}

.modal-close line {
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
