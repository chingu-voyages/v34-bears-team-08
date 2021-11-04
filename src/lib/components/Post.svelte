<script>
import { imagekit } from '$lib/utils/imagekit'
import { CreatePhoto } from '$lib/gql/CreatePhoto'
import { auth } from '$lib/stores/auth'

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
      await execCreatePhoto({
        id: $auth.userInfo?._id,
        media: { src: result.url, id: result.fileId },
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

<div class="py-40">
  {#if !uploading}
    <h2 class="w-full text-center text-lg font-bold px-2 py-3 mb-2">Create new post</h2>
    {#if err}
      <p>{err}</p>
    {/if}
    <form class="w-full flex flex-col justify-center items-center " on:submit|preventDefault={uploadPost}>
      {#if !files}
        <label
          for="fileUpload"
          class="cursor-pointer inline-block top-1/2 font-medium rounded-md px-5 py-2 bg-whiteA-whiteA6"
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
          <button
            class="absolute bottom-0  mb-4 rounded-md border-none px-7 py-2 bg-whiteA-whiteA5 font-bold"
            type="submit">Post</button
          >
        {/if}
      {/if}
    </form>
  {:else}
    <h4 class="w-full text-center text-lg font-bold px-2 py-3 mb-2">Uploading post.. Please wait</h4>
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
