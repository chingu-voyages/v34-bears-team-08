<footer class="mt-auto">
  <div class="h-36 mt-7 pt-7 bg-whiteA-whiteA3">
    <nav class="w-full flex justify-center items-center flex-wrap">
      {#each [['/about', 'About'], ['/blog', 'Blog'], ['/privacy', 'Privacy'], ['/terms', 'Terms'], ['/profiles', 'Top Accounts']] as [link, title]}
        <a class="p-3 whitespace-nowrap text-whiteA-whiteA11" href={link}>{title}</a>
      {/each}
    </nav>
    <p class="text-center p-3 text-whiteA-whiteA11">Copyright &copy; 2021 Devvy All rights reserved</p>
  </div>
</footer>
