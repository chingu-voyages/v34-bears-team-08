<script>
import { imagekit } from '$lib/utils/imagekit'
import { CreatePhoto } from '$lib/gql/CreatePhoto'
import { auth } from '$lib/stores/auth'
import { scale, fade } from 'svelte/transition'
const execCreatePhoto = CreatePhoto()

export let uploading = false
let files = null,
  caption,
  err,
  ready = true

function uploadPost() {
  const fileOptions = {
    file: files[0],
    fileName: files[0].name || 'default.jpg',
    tags: [''],
  }
  uploading = true
  imagekit.upload(fileOptions, async (error, { url, width, height, fileId } = {}) => {
    if (error) {
      err = `Something went wrong Please try again`
      console.log(error)
    } else {
      // result has TS support! Use VSCode intellisense to get the image types
      // Save the url and maybe a transformation with a smaller image and a thumbnail to the db query to create the post
      await execCreatePhoto({
        id: $auth.userInfo?._id,
        media: { src: url, id: fileId, width, height },
        posted: new Date().toISOString(),
        caption,
      })
      uploading = false
      files = null
      caption = ''
    }
  })
}
</script>

<div class="h-full grid" transition:fade>
  {#if !uploading}
    <h2 class="w-full text-center text-lg font-bold px-2 py-3 mb-2 mt-auto">Create a post</h2>
    {#if err}
      <p>{err}</p>
    {/if}
    <form class="w-full text-center mt-3 mb-auto" on:submit|preventDefault={uploadPost}>
      {#if !files}
        <label
          for="fileUpload"
          class="cursor-pointer font-medium rounded-md px-5 py-3 bg-amberA-amberA8 hover:bg-amberA-amberA10"
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
          placeholder="Write the most enthusiastically written caption you have ever written in your whole life. You must to proceed!"
        />
        <button
          class="mt-4 rounded-md border-none px-7 py-2 font-bold transition-all {!caption
            ? 'bg-whiteA-whiteA7 cursor-not-allowed'
            : 'bg-amberA-amberA8'}"
          disabled={!caption}
          transition:scale={{ duration: 200, start: 0.9 }}
          on:outrostart={() => (ready = false)}
          on:outroend={() => (ready = true)}
          type="submit">Post</button
        >
      {/if}
    </form>
  {:else if ready}
    <h4 class="w-full text-center text-lg font-bold px-2 py-3 my-auto">Uploading post.. Please wait</h4>
  {/if}
</div>

<style>
input[type='file']::file-selector-button {
  border: 2px solid gray;
  padding: 0.2em 0.4em;
  background-color: #fff;
  transition: 1s;
}

input[type='file']::file-selector-button:hover {
  background-color: #81ecec;
  border: 2px solid #00cec9;
}
</style>
