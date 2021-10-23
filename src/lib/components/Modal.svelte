<script>
    import ImageKit from 'imagekit-javascript';
    import {createEventDispatcher,onDestroy} from 'svelte'

        const imagekit = new ImageKit({
            publicKey : import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
            urlEndpoint : import.meta.env.VITE_IMAGEKIT_URL_END_POINT,
            authenticationEndpoint : import.meta.env.VITE_IMAGEKIT_AUTHENTICATION_END_POINT,
            // Need to fix the  server endpoint issue, tested with express server hosted at 
            // eg: http://localhost:5000/api/imagekit-auth method POST which returns the url 
            // successfully
        });
        
        const uploadPost = async () => {
        uploading = true;
        const result = await imagekit.upload({file:files[0],fileName:files[0].name || 'default.jpg',tags:['']})
        //This function probably need to go in the module
        console.log(result)
        //Save the Post along with url to our database
        setTimeout(() => {
            uploading =false;
            files = null;
            caption = ''
        }, 5000);
        }

        const dispatch = createEventDispatcher();
        const close = () => dispatch('close');

        let modal;
        let files = null;
        let caption;
        let uploading = false;

        const handle_keydown = e => {
        if (e.key === 'Escape') {
            close();
            return;
        }

        if (e.key === 'Tab') {
            // trap focus
            const nodes = modal.querySelectorAll('*');
            const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0);

            let index = tabbable.indexOf(document.activeElement);
            if (index === -1 && e.shiftKey) index = 0;

            index += tabbable.length + (e.shiftKey ? -1 : 1);
            index %= tabbable.length;

            tabbable[index].focus();
            e.preventDefault();
        }
    };

    const previously_focused = typeof document !== 'undefined' && document.activeElement;

    if (previously_focused) {
        onDestroy(() => {
            previously_focused.focus();
        });
    }
    
</script>
<svelte:window on:keydown={handle_keydown}/>
<div class="modal-bg" on:click={close}></div>
    <div class="modal" role="dialog" aria-modal="true" bind:this={modal}>
        <svg class="modal-close" on:click={close} viewBox="0 0 12 12">
            <circle cx=6 cy=6 r=6 />
            <line x1=3 y1=3 x2=9 y2=9 />
            <line x1=9 y1=3 x2=3 y2=9 />
        </svg>
      {#if !uploading}
      <div class="modal-content w-full h-full">
        <h2 class="w-full text-center text-lg font-bold px-2 py-3 mb-2 border-b-2">
            Create new post
        </h2>
        <form class="w-full flex flex-col justify-center items-center " on:submit|preventDefault={uploadPost}>
            
            {#if files === null}
            <label for="fileUpload" class="cursor-pointer inline-block absolute top-1/2 font-medium rounded-xl px-5 py-2 bg-gray-100">
                Select an Image for Upload
                <input type="file" id="fileUpload" name="fileUpload"  class="my-5 hidden" bind:files/>   
            </label>
             
            {/if}
            {#if files !== null }
            <textarea  class="w-full focus:outline-none p-5" name="caption" id="caption" bind:value={caption} cols="3" rows="2" placeholder="Write a caption"></textarea>
            {#if caption !== undefined}
            <button class="absolute bottom-0  mb-4 rounded-lg border-none px-7 py-2 bg-gray-100 font-bold" type="submit">Post</button>
            {/if}
            {/if}
        </form>
    </div>
      {/if}

      {#if uploading}
          <h4>Uploading post.. Please wait</h4>
      {/if}
    </div>



<style>
    
    .modal-bg{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #4448;
        
    }
    
    .modal {
        position: fixed;
        left: 50%;
        top: 50%;
        width: calc(100vw - 6em);
        width: 26em;
        height: calc(100vh - 12em);
        overflow: none;
        transform: translate(-50%,-50%);
        border-radius: 1em;
        background: white;
        filter: drop-shadow(5px 5px 5px #555);
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .modal-close {
        position: absolute;
        top:-12px;
        right:-12px;
        width:24px;
        height:24px;
        cursor: pointer;
        fill:#000;
        transition: transform 0.3s;
    }	

    .modal-close:hover {
        transform: scale(2);
    }

    .modal-close line {
        stroke:#FFF;
        stroke-width:2;
    }
    /* .modal-content {
        max-width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
        overflow: auto;
    } */


    input[type=file]::file-selector-button {
    border: 2px solid gray;
    padding: .2em .4em;
    border-radius: .2em;
    background-color: #fff;
    transition: 1s;
    }

    input[type=file]::file-selector-button:hover {
    background-color: #81ecec;
    border: 2px solid #00cec9;
    }

</style>