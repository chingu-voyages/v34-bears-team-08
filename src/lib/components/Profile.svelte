<script>
  import Header from '$lib/components/Header.svelte'
</script>

<Header />
<div class="flex flex-col items-center h-screen mt-10">
  <div class="flex flex-row justify-between w-3/5">
    <div>I will be a photo</div>
    <div class="flex flex-col w-1/2">
      <h2 class="p-1">I will be a name</h2>
      <div class="p-1">posts/follows/following</div>
      <h3 class="p-1">sub-title</h3>
      <p class="p-1">bio</p>
    </div>
  </div>
  <div class="flex flex-wrap justify-between w-3/5">
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
    <div class="placeholder mt-10" />
  </div>
</div>

<style>
  .placeholder {
    width: 300px;
    height: 300px;
    background-color: black;
  }
</style>
