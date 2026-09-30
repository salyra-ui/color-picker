<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import {
    areaStyle,
    thumbStyle,
    bindColorArea,
    type ColorPartClasses,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    class: className = '',
    label = 'Saturation and brightness',
    classes = {},
    style = '',
    thumbText = '',
    thumb,
  }: {
    class?: string;
    label?: string;
    classes?: ColorPartClasses;
    style?: string;
    thumbText?: string;
    thumb?: Snippet;
  } = $props();
  const store = useColorStore(),
    color = useColor();
  let element: HTMLDivElement;
  onMount(() => bindColorArea(element, store));
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (A two-axis keyboard surface; one-dimensional sliders are also available.) -->
<div
  bind:this={element}
  class="cp-area {className} {classes.root ?? ''}"
  data-cp-part="surface"
  role="group"
  tabindex="0"
  aria-label="{label}. Arrow keys adjust; Shift for larger steps. {Math.round(
    $color.s,
  )}% saturation, {Math.round($color.v)}% brightness."
  style={`${areaStyle($color)};${style}`}
>
  <span
    data-cp-part="thumb"
    class={classes.thumb}
    aria-hidden="true"
    style={thumbStyle($color)}
    ><span data-cp-part="thumb-text" class={classes.text}
      >{#if thumb}{@render thumb()}{:else}{thumbText}{/if}</span
    ></span
  >
</div>
