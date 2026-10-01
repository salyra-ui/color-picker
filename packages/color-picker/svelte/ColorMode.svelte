<script lang="ts">
  import type { Snippet } from 'svelte';
  import { colorFormats, type ColorFormat } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    class: className = '',
    children,
  }: { class?: string; children?: Snippet<[ColorFormat]> } = $props();
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
    )}
  >{#if children}{@render children(
      $color.format,
    )}{:else}{$color.format.toUpperCase()} ↔{/if}</button
>
