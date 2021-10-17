<script context="module">
  import { auth } from '$lib/stores/auth'
  export function load({ session }) {
    // we have an auth token, which means we have a session
    if (session?.token) auth.set(session)
    return {}
  }
</script>

<script>
  import { initClient } from '$lib/gql/urql'

import '../app.css'
import Footer from '$lib/components/Footer.svelte';
import Header from '$lib/components/header.svelte';

  initClient()

</script>

<Header />

<slot />

<Footer />
