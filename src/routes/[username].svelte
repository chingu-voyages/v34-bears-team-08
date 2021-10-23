<script context="module">
export function load({ page }) {
  let username = page.path
  return { props: { username: username } }
}
</script>

<script>
import ProfileInfo from '$lib/components/ProfileInfo.svelte'
import { GetCurrentUserPhotos } from '$lib/gql/GetProfilePhotos'
import { mutationOp } from '$lib/gql/urql'
import Times from '@svicons/fa-solid/times.svelte'
import { gql } from '@urql/core'
export let username
username = username.slice(1)

GetCurrentUserPhotos({ username })
$: photoArr = $GetCurrentUserPhotos.data?.result.data || []

const deletePhoto = mutationOp(gql`
  mutation deletePhoto($id: ID!) {
    result: deletePhoto(id: $id) {
      _id
    }
  }
`)

function deletePost(e) {
  let id = e.target.dataset.photoId
  if (confirm('Are you sure you want to delete this post?')) {
    deletePhoto({id})
  }
}
</script>

<div class="flex flex-col items-center h-screen mt-10">
  <div class="flex flex-row justify-between w-3/5">
    <ProfileInfo {username} />
  </div>
  <ul class="flex flex-wrap justify-between w-3/5 relative">
    {#each photoArr as photo, index}
      <li class="w-max relative">
        <div class="w-full">
          <img src={photo.src} width="300px" alt="photo #{index + 1}" class="mt-5 z-0" />
          <button
            class="z-10 display-block absolute top-0 right-0 mt-7 ml-3 text-white text-lg pr-4 pb-4"
            on:click={deletePost}
            data-photo-id={photo._id}
          >
            x
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
