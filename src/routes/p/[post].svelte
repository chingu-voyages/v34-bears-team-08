<script context="module">
// export async function load() {
//   return {status: 302 }
// }
</script>

<script>
import { page } from '$app/stores'
import { GetPhoto } from '$lib/gql/GetPhoto'

GetPhoto({ photoID: $page.params.post })
// $: if($GetPhoto.data && Object.is($GetPhoto.data.result, null)) {
//   // redirect here because a null result means query went through & it's an invalid id
// }
</script>

<div class="container mx-auto max-w-screen-lg h-full">
  <!--  -->
</div>
