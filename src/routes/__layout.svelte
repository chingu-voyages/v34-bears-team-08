<script context="module">
  import { auth } from '$lib/stores/auth'
  export function load({ session }) {
    // we have an auth token, which means we have a session
    if (session?.token) auth.set(session)
    return {}
  }
</script>

<script>
  import '../app.css'
</script>

<slot />
