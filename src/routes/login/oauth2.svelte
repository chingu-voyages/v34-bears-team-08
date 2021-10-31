<!-- OAuth2 callback route -->
<script>
import { onMount } from 'svelte'
import { goto } from '$app/navigation'
import { verify } from '$lib/stores/auth'
import { magic } from '$lib/utils/magic'
import Loader from '$components/Loader.svelte'

let loading = true
onMount(async () => {
  /* res = {
      magic: { userMetadata, idToken }
      oauth: {
        userInfo = { email, emailVerified: boolean, picture, profile }
      }
    } */
  const res = await magic.oauth.getRedirectResult()
  await verify({ email: res.magic?.userMetadata.email, idToken: res.magic?.idToken })
  loading = false
  goto('/')
  // ? Deal with possible errors? Redirect to login on error? goto('/login')
})
</script>

{#if loading}
  <main class="grid place-items-center min-h-screen">
    <Loader class="opacity-75" />
  </main>
{/if}
