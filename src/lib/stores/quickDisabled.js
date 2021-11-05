import { writable } from 'svelte/store'
/**We need a way to expose methods to disable quick if other modals want to open, and that's what this is for.  
 Those modals should then re-enable quick onDestroy at a setTimeout of 500ms to make way for animations.*/
export const quickDisabled = writable(false)
