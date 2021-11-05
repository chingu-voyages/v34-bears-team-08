<script>
import { useMenu } from 'sashui'
import Modal from './Modal.svelte'
let className = ''
export { className as class }
const Menu = useMenu(true)
</script>

<Modal on:close let:title>
  <menu class={className} use:Menu={{ autofocus: false }}>
    <slot Item={Menu.Item} {Menu} {title} />
  </menu>
</Modal>
