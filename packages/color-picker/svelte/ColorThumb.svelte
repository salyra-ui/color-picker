<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { thumbPosition, styleText } from '../core';
  import { useColor } from './context';
  import { useSurface } from './surface-context';
  let {
    style = '',
    children,
    ref = $bindable(),
    ...attributes
  }: HTMLAttributes<HTMLSpanElement> & {
    children?: Snippet;
    ref?: HTMLSpanElement;
  } = $props();
  const color = useColor(),
    view = useSurface();
</script>

<span
  {...attributes}
  bind:this={ref}
  data-cp-part="thumb"
  aria-hidden="true"
  style={`${styleText(thumbPosition($color, view()))};${style}`}
>
  {#if children}{@render children()}{/if}
</span>
