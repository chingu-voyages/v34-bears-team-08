<script context="module">
export async function load({ session }) {
  // TODO: Enable redirect if logged in, later
  // if (session?.token)
  /**
     return {
       redirect: '/',
       status: 302
     }
    */
  return {}
}
</script>

<script>
import GitHub from '@svicons/fa-brands/github.svelte'
import { oAuthLogin } from '$lib/utils/magic'
import Footer from '$lib/components/Footer.svelte'
import Logo from '$components/Logo.svelte'
let error = false
</script>

<svelte:head>
  <title>Login</title>
</svelte:head>
<div class="flex justify-center items-center h-full">
  <div class="container flex mx-auto max-w-screen-md items-center justify-center h-screen px-3">
    <!-- <div class="flex w-3/5">
      <img class="max-h-full" src="/images/iphone.png" alt="iPhone with app on screen" />
    </div> -->
    <div class="flex flex-col w-3/5 space-y-4 py-6">
      <div class="flex flex-col items-center bg-black-off rounded mb-12">
        <h1 class="flex justify-center w-full neonText">
          <Logo disabled class="text-6xl" />
        </h1>

        {#if error} <p class="mb-4 text-xs text-red-primary">{error}</p> {/if}
      </div>

      <div class="flex flex-col items-center bg-black-off rounded">
        <button
          class="bg-black-light text-white flex flex-row p-3 rounded-md hover:scale-100"
          on:click={async () => {
            await oAuthLogin('github')
          }}
        >
          Login with GitHub <GitHub class="pl-4 text-3xl" width="1.5em" color="white" />
        </button>
      </div>
    </div>
  </div>
</div>
<Footer />

<style>
.neonText {
  animation: flicker 10s infinite alternate;
  --primary: hsla(0, 0%, 100%, 0.8);
  --secondary: hsla(180, 100%, 75%, 0.6);
  color: var(--primary);
}
@media screen and (prefers-reduced-motion) {
  .neonText {
    animation: none;
  }
}
/* Flickering animation, credited to https://css-tricks.com/how-to-create-neon-text-with-css/ */
@keyframes flicker {
  0%,
  18%,
  22%,
  25%,
  53%,
  57%,
  100% {
    text-shadow: 0 0 4px var(--primary), 0 0 11px var(--primary), 0 0 19px var(--primary), 0 0 25px var(--secondary),
      0 0 30px var(--secondary), 0 0 35px var(--secondary), 0 0 40px var(--secondary), 0 0 45px var(--secondary);
  }

  20%,
  24%,
  55% {
    text-shadow: none;
  }
}
</style>
