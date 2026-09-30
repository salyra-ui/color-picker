<script lang="ts">
  import { useColor } from './context';
  let { class: className = '' }: { class?: string } = $props();
  const color = useColor();
</script>

<output
  class="cp-preview {className}"
  style:background={$color.value}
  aria-label="Selected color {$color.value}">{$color.value}</output
>
