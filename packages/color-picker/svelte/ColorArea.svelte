<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { ColorPartClasses } from '../core';
  import ColorPlane from './ColorPlane.svelte';
  import ColorThumb from './ColorThumb.svelte';
  let {
    class: className = '',
    classes = {},
    style = '',
    thumbText = '',
    thumb,
    label = 'Saturation and brightness',
    ...attributes
  }: Omit<ComponentProps<typeof ColorPlane>, 'view'> & {
    classes?: ColorPartClasses;
    thumbText?: string;
    thumb?: Snippet;
    label?: string;
  } = $props();
</script>

<ColorPlane
  {...attributes}
  class="cp-area {className} {classes.root ?? ''}"
  aria-label={label}
  style={`width:100%;min-height:var(--cp-area-height,180px);${style}`}
>
  <ColorThumb class="cp-thumb {classes.thumb ?? ''}"
    ><span data-cp-part="thumb-text" class={classes.text}
      >{#if thumb}{@render thumb()}{:else}{thumbText}{/if}</span
    ></ColorThumb
  >
</ColorPlane>
