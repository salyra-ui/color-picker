<script lang="ts">
  import {
    sliderLabels,
    sliderValue,
    setSliderValue,
    sliderTrackStyle,
    type SliderChannel,
    type ColorPartClasses,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    channel = 'h',
    label,
    class: className = '',
    classes = {},
  }: {
    channel?: SliderChannel;
    label?: string;
    class?: string;
    classes?: ColorPartClasses;
  } = $props();
  const store = useColorStore(),
    color = useColor();
</script>

<label
  class="cp-slider {className} {classes.root ?? ''} {classes.label ?? ''}"
  data-cp-part="slider"
  data-channel={channel}
  style={sliderTrackStyle($color)}
  >{label ?? sliderLabels[channel]}<input
    data-cp-part="track"
    class="{classes.track ?? ''} {classes.input ?? ''}"
    type="range"
    min="0"
    max={channel === 'h' ? 359 : 100}
    step="1"
    value={sliderValue($color, channel)}
    oninput={(e) =>
      setSliderValue(store, channel, Number(e.currentTarget.value))}
  /></label
>
