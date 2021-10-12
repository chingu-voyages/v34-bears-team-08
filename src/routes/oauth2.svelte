<!-- OAuth2 callback route -->
<script>
  import { goto } from '$app/navigation'
  import { verify } from '$lib/stores/auth'
  import { magic } from '$lib/utils/magic'
  import { onMount } from 'svelte'

  onMount(async () => {
    /* res = {
      magic: { userMetadata, idToken }
      oauth: {
        userInfo = { email, emailVerified: boolean, picture, profile }
      }
    } */
    const res = await magic.oauth.getRedirectResult()
    await verify({ email: res.magic?.userMetadata.email, idToken: res.magic?.idToken })
    // TODO: If this isn't causing a redirect that reloads __layout, then we need to just use the native location API.
    goto('/', { replaceState: true })
    // ? Deal with possible errors? Try doing this on error? goto('/login')
  })
</script>
