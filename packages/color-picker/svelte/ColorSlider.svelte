<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { sliderLabels, type ColorPartClasses } from '../core';
  import ColorRange from './ColorRange.svelte';
  let {
    channel = 'h',
    label,
    class: className = '',
    classes = {},
    ...attributes
  }: ComponentProps<typeof ColorRange> & {
    label?: string;
    classes?: ColorPartClasses;
  } = $props();
</script>

<label
  class="cp-slider {className} {classes.root ?? ''} {classes.label ?? ''}"
  data-cp-part="slider"
  data-channel={channel}
>
  {label ?? sliderLabels[channel]}<ColorRange
    {...attributes}
    {channel}
    aria-label={label ?? sliderLabels[channel]}
    class="{classes.track ?? ''} {classes.input ?? ''}"
  />
</label>
