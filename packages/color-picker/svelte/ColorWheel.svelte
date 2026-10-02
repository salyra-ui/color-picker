<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { ColorMarker, ColorPartClasses } from '../core';
  import ColorWheelSurface from './ColorWheelSurface.svelte';
  import ColorThumb from './ColorThumb.svelte';
  import ColorMarkerThumb from './ColorMarkerThumb.svelte';
  let {
    class: className = '',
    classes = {},
    thumbText = '',
    markers,
    activeId,
    marker: renderMarker,
    label = 'Hue and saturation wheel',
    ...attributes
  }: ComponentProps<typeof ColorWheelSurface> & {
    classes?: ColorPartClasses;
    thumbText?: string;
    marker?: Snippet<[ColorMarker, boolean]>;
    label?: string;
  } = $props();
</script>

<ColorWheelSurface
  {...attributes}
  {markers}
  {activeId}
  class="cp-wheel {className} {classes.root ?? ''}"
  aria-label={label}
>
  {#if markers}{#each markers as marker (marker.id)}<ColorMarkerThumb
        {marker}
        active={marker.id === activeId}
        class="cp-wheel-marker {classes.marker ?? ''}"
        ><span data-cp-part="marker-text" class={classes.text}
          >{#if renderMarker}{@render renderMarker(
              marker,
              marker.id === activeId,
            )}{:else}{marker.label ?? ''}{/if}</span
        ></ColorMarkerThumb
      >{/each}
  {:else}<ColorThumb class="cp-thumb {classes.thumb ?? ''}"
      ><span data-cp-part="thumb-text" class={classes.text}>{thumbText}</span
      ></ColorThumb
    >{/if}
</ColorWheelSurface>
