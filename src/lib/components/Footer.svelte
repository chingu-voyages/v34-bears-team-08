<footer class="w-full mt-7 pt-5 bg-gray-100 h-36 bottom-0">
  <nav class="w-full flex justify-center items-center">
    {#each [['/about', 'About'], ['/blog', 'Blog'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/profiles', 'Top Accounts']] as [link, title]}
      <a class="p-3" href={link}>{title}</a>
    {/each}
  </nav>
  <p class="text-center p-3">Copyright &copy; 2021 Devvy All rights reserved</p>
</footer>
