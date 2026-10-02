<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import {
    nextColorFormat,
    type ColorFormat,
    type ColorSnapshot,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    format,
    children,
    onclick,
    disabled = false,
    ref = $bindable(),
    ...attributes
  }: Omit<HTMLButtonAttributes, 'children'> & {
    format?: ColorFormat;
    children?: Snippet<[ColorSnapshot]>;
    ref?: HTMLButtonElement;
  } = $props();
  const store = useColorStore(),
    color = useColor();
</script>

<button
  type="button"
  aria-label="Change color format"
  {...attributes}
  bind:this={ref}
  disabled={disabled || $color.disabled}
  data-cp-part="format-trigger"
  aria-pressed={format ? $color.format === format : undefined}
  onclick={(event) => {
    onclick?.(event);
    if (!event.defaultPrevented) nextColorFormat(store, format);
  }}
>
  {#if children}{@render children(
      $color,
    )}{:else}{$color.format.toUpperCase()}{/if}
</button>
