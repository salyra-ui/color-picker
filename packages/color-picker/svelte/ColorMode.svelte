<script lang="ts">
  import { colorFormats } from '../core';
  import { useColor, useColorStore } from './context';
  let { class: className = '' }: { class?: string } = $props();
  const color = useColor(),
    store = useColorStore();
</script>

<button
  type="button"
  class="cp-mode {className}"
  aria-label="Next color format ({$color.format.toUpperCase()})"
  onclick={() =>
    store.setFormat(
      colorFormats[
        (colorFormats.indexOf($color.format) + 1) % colorFormats.length
      ],
    )}>{$color.format.toUpperCase()} ↔</button
>
