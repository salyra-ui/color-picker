<script lang="ts">
  import { useColorStore } from './context';
  let {
    value,
    label = value,
    class: className = '',
  }: { value: string; label?: string; class?: string } = $props();
  const store = useColorStore();
</script>

<button
  type="button"
  class="cp-swatch {className}"
  aria-label={label}
  style:background={value}
  onclick={() => store.setHex(value)}
></button>
