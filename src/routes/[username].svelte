<script context="module">
export function load({ page }) {
  let username = page.path
  return { props: { username: username } }
}
</script>

<script>
import ProfileInfo from '$lib/components/ProfileInfo.svelte'
import { GetCurrentUserPhotos } from '$lib/gql/GetProfilePhotos';
export let username
username = username.slice(1)

console.dir(GetCurrentUserPhotos({username}))
$: photoArr = $GetCurrentUserPhotos.data?.result.data || []
$: console.log('photos', photoArr)
</script>

<div class="flex flex-col items-center h-screen mt-10">
  <div class="flex flex-row justify-between w-3/5">
    <ProfileInfo {username} />
  </div>
  <ul class="flex flex-wrap justify-between w-3/5">
    {#each photoArr as photo, index}
      <li><img src={photo.src} width="300px" alt="photo #{index + 1}" class="mt-5" /></li>
    {/each}
  </ul>
</div>
