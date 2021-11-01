<script context="module">
import { auth } from '$lib/stores/auth'
import { get } from 'svelte/store'
export function load({ session }) {
  // init auth data into store if we haven't done so yet on app entry
  if (!get(auth).token && session?.token) auth.set(session)
  return {}
}
</script>

<script>
import '../app.css'
import { initClient } from '$lib/gql/urql'
import Footer from '$lib/components/Footer.svelte'
import Header from '$lib/components/Header.svelte'

initClient()
</script>

<Header />

<slot />

<Footer />
