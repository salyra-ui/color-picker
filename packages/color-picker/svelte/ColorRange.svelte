<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import {
    bindColorSlider,
    sliderAttributes,
    sliderLabels,
    sliderTrackStyle,
    type SliderChannel,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    channel = 'h',
    style = '',
    disabled = false,
    ref = $bindable(),
    ...attributes
  }: Omit<HTMLInputAttributes, 'value'> & {
    channel?: SliderChannel;
    ref?: HTMLInputElement;
  } = $props();
  const store = useColorStore(),
    color = useColor();
  $effect(() => {
    if (ref) return bindColorSlider(ref, store, channel, () => !!disabled);
  });
</script>

<input
  aria-label={sliderLabels[channel]}
  {...attributes}
  {...sliderAttributes($color, channel)}
  disabled={disabled || $color.disabled}
  bind:this={ref}
  data-cp-part="slider"
  data-channel={channel}
  style={`${sliderTrackStyle($color)};${style}`}
/>
