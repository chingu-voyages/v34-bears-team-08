<script>
    import {createEventDispatcher,onDestroy} from 'svelte'
        
        const dispatch = createEventDispatcher();
        const close = () => dispatch('close');

        let modal;

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
        <slot name="header"></slot>
        <div class="modal-content">
            <slot></slot>
        </div>
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
        width: calc(100vw - 4em);
        max-width: 32em;
        max-height: calc(100vh - 4em);
        overflow: none;
        transform: translate(-50%,-50%);
        padding: 1em;
        border-radius: 0.4em;
        background: white;
        filter: drop-shadow(5px 5px 5px #555);
        z-index: 3;
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
    .modal-content {
        max-width: calc(100vw - 20px);
        max-height: calc(100vh - 20px);
        overflow: auto;
    }
</style>