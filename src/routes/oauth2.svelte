<!-- OAuth2 callback route -->
<script>
  import { goto } from '$app/navigation'
  import { magic } from '$lib/utils/magic'
  import { onMount } from 'svelte'

  onMount(() => {
    magic.oauth.getRedirectResult().then(
      (result) => {
        // TODO: ID Token is critical. Use it for logging in!
        // result.magic = { userMetadata, idToken }
        // result.oauth.userInfo = { email, emailVerified: boolean, picture, profile }
      },
      () => goto('/login') // error
    )
  })
</script>
