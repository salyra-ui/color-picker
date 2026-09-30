<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import {
    wheelStyle,
    wheelThumbStyle,
    bindColorArea,
    bindMarkerWheel,
    markerWheelStyle,
    markerStyle,
    type ColorMarker,
    type ColorPartClasses,
    type HSV,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    class: className = '',
    style = '',
    label = 'Hue and saturation wheel',
    classes = {},
    thumbText = '',
    markers,
    activeId,
    onSelect,
    onMarkerChange,
    marker: renderMarker,
  }: {
    class?: string;
    style?: string;
    label?: string;
    classes?: ColorPartClasses;
    thumbText?: string;
    markers?: readonly ColorMarker[];
    activeId?: string;
    onSelect?: (id: string) => void;
    onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
    marker?: Snippet<[ColorMarker, boolean]>;
  } = $props();
  const store = useColorStore(),
    color = useColor();
  let element: HTMLDivElement;
  onMount(() =>
    markers
      ? bindMarkerWheel(element, {
          getMarkers: () => markers ?? [],
          getActiveId: () => activeId ?? markers?.[0]?.id ?? '',
          select: (id) => onSelect?.(id),
          setHSV: (id, hsv) => onMarkerChange?.(id, hsv),
        })
      : bindColorArea(element, store, 'wheel'),
  );
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Two-axis keyboard surface.) -->
<div
  bind:this={element}
  data-cp-part="surface"
  class="cp-wheel {className} {classes.root ?? ''}"
  role="group"
  tabindex="0"
  aria-label={label}
  style="{markers ? markerWheelStyle() : wheelStyle($color)};{style}"
>
  {#if markers}{#each markers as marker (marker.id)}<button
        type="button"
        data-cp-part="marker"
        data-marker-id={marker.id}
        data-small={markers.length === 1 || !marker.label ? 'true' : undefined}
        class="cp-wheel-marker {classes.marker ?? ''}"
        aria-label={marker.ariaLabel ?? `Select ${marker.id} marker`}
        aria-pressed={activeId === marker.id}
        style={markerStyle(marker, activeId === marker.id)}
        ><span data-cp-part="marker-text" class={classes.text}
          >{#if renderMarker}{@render renderMarker(
              marker,
              activeId === marker.id,
            )}{:else}{marker.label ?? ''}{/if}</span
        ></button
      >{/each}{:else}<span
      data-cp-part="thumb"
      aria-hidden="true"
      class={classes.thumb}
      style={wheelThumbStyle($color)}
      ><span data-cp-part="thumb-text" class={classes.text}>{thumbText}</span
      ></span
    >{/if}
</div>
