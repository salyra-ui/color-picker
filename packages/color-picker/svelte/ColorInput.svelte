<script lang="ts">
  import type { ColorFormat } from '../core';
  import type { ColorPartClasses } from '../core';
  import { useColor } from './context';
  import ColorTextInput from './ColorTextInput.svelte';
  import ColorChannelInput from './ColorChannelInput.svelte';
  let {
    format: override,
    label,
    class: className = '',
    classes = {},
  }: {
    format?: ColorFormat;
    label?: string;
    classes?: ColorPartClasses;
    class?: string;
  } = $props();
  const color = useColor();
  const format = $derived(override ?? $color.format);
</script>

{#if format === 'hex'}<ColorTextInput
    format="hex"
    label={label ?? 'HEX'}
    class={className}
    {classes}
  />{:else}<div
    class="cp-channels {className}"
    role="group"
    aria-label={label ?? format.toUpperCase()}
  >
    {#each [0, 1, 2] as index (`${format}-${index}`)}<ColorChannelInput
        {classes}
        {format}
        index={index as 0 | 1 | 2}
      />{/each}
  </div>{/if}
