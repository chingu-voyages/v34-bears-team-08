<script>
  import { auth, isAuthenticated, logout } from '$lib/stores/auth';
  import Modal from '$components/Modal.svelte';
  import {Home, Compass, SignOutAlt, UserAlt, PlusCircle} from '@svicons/fa-solid'
  import Logo from '$components/Logo.svelte'

  let username = $auth.userInfo?.username,
  disableLogout = false
  console.log($isAuthenticated)
  let showModal = false;
</script>

<header class="px-4 h-16 bg-white border-b border-gray-primary mb-8">
  <div class="container mx-auto max-w-screen-lg h-full">
    <div class="flex justify-between h-full">
      <div class="text-gray-700 text-center flex items-center align-items">
        <h1 class="flex justify-center w-full">
          <Logo />
        </h1>
      </div>
      <div class="text-gray-700 text-center flex items-center align-items">
        {#if $isAuthenticated}
        <button
        type="button"
        title="Add Post"
        on:click="{() => showModal = true}"
      >
        <PlusCircle
          class="w-6 mr-6 text-black-light pointer-events-none	"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        />
      </button>
          <a href="/" aria-label="Timeline">
            <Home
              class="w-6 mr-6 text-black-light pointer-events-none	"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <a href="/explore" area-label="explore">
            <Compass
              class="w-5 mr-6 text-black-light pointer-events-none	"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </a>
          <button
            type="button"
            title="Sign Out"
            disabled={disableLogout}
            on:click={() => {
              disableLogout = true
              logout()
            }}
          >
            <SignOutAlt
              class="w-6 mr-6 text-black-light pointer-events-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            />
          </button>
          <!--This conditional will be replaced with some user data containing a user image (avatar)-->
          {#if $isAuthenticated}
            <!--The <User/> icon is a placeholder for where the user img will go-->
            <div class="flex items-center">
              <a href="/{username}"
                ><UserAlt
                  class="w-5 mr-6 text-black-light pointer-events-none"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                /></a
              >
            </div>
          {/if}
        {/if}
      </div>
    </div>
  </div>
</header>


{#if showModal}
<Modal on:close="{() => showModal = false}"   />
{/if}

