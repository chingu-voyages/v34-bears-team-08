<script context="module">
export function load({ page }) {
  let username = page.path
  return { props: { username: username } }
}
</script>

<script>
import ProfileInfo from '$lib/components/ProfileInfo.svelte'
import { queryOp } from '$lib/gql/urql'
import { gql } from '@urql/svelte'
export let username
username = username.slice(1)

console.log(typeof username)
const GetCurrentUserPhotos = queryOp(
  gql`
    query GetCurrentUserPhotos {
      result: getProfilePhotos(username: "${username}") {
        data {
          _id
          src
        }
      }
    }
  `
)

console.dir(GetCurrentUserPhotos())
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
