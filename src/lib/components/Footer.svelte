<script>
const footerLinks = [
    {id:'001',link:'/about',text:'About'},
    {id:'002',link:'/blog',text:'Blog'},
    {id:'003',link:'/privacy',text:'Privacy'},
    {id:'004',link:'/terms',text:'Terms'},
    {id:'005',link:'/profiles',text:'Top Accounts'},
    ] 
</script>

<footer class="w-full mt-7 pt-5 bg-gray-100 h-36">
       <nav class="w-full flex justify-center items-center">
        {#each footerLinks as {link,text}}
            <a class="p-3" href="{link}">{text}</a>
        {/each} 
       </nav>
       <p class="text-center p-3">Copyright &copy; 2021 Devvy All rights reserved</p>
</footer>

<style>
    footer{

    }
</style>