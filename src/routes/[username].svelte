<script context="module">

export function load (){
    return {}
}

</script>

<script>
    import ProfileInfo from '$lib/components/ProfileInfo.svelte';

    


</script>
  
  <div class="flex flex-col items-center h-screen mt-10">
    <div class="flex flex-row justify-between w-3/5">
        <ProfileInfo/>
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
  