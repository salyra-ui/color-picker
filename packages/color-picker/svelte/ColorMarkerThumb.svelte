<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { useColor } from './context';
  const state = useColor();
  import {
    thumbPosition,
    styleText,
    type ColorMarker as Marker,
  } from '../core';
  let {
    marker,
    active = false,
    disabled = false,
    style = '',
    children,
    ref = $bindable(),
    ...attributes
  }: HTMLButtonAttributes & {
    marker: Marker;
    active?: boolean;
    children?: Snippet;
    ref?: HTMLButtonElement;
  } = $props();
</script>

<button
  type="button"
  aria-label={marker.ariaLabel ?? marker.id}
  {...attributes}
  bind:this={ref}
  disabled={disabled || $state.disabled}
  data-cp-part="marker"
  data-marker-id={marker.id}
  data-small={!marker.label || undefined}
  aria-pressed={active}
  data-state={active ? 'active' : 'inactive'}
  style={`${styleText(thumbPosition(marker.color, 'wheel'))};pointer-events:auto;background:${marker.color.hex};z-index:${active ? 2 : 1};${style}`}
>
  {#if children}{@render children()}{:else}{marker.label ?? ''}{/if}
</button>
