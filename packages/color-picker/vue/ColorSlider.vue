<script setup lang="ts">
import {
  sliderLabels,
  sliderValue,
  setSliderValue,
  sliderTrackStyle,
  type SliderChannel,
  type ColorPartClasses,
} from '../core';
import { useColor, useColorStore } from './context';
withDefaults(
  defineProps<{
    channel?: SliderChannel;
    label?: string;
    classes?: ColorPartClasses;
  }>(),
  { channel: 'h', classes: () => ({}) },
);
const store = useColorStore(),
  color = useColor();
</script>
<template>
  <label
    :class="['cp-slider', classes.root, classes.label]"
    data-cp-part="slider"
    :data-channel="channel"
    :style="sliderTrackStyle(color)"
    >{{ label ?? sliderLabels[channel]
    }}<input
      data-cp-part="track"
      :class="[classes.track, classes.input]"
      type="range"
      min="0"
      :max="channel === 'h' ? 359 : 100"
      step="1"
      :value="sliderValue(color, channel)"
      @input="
        setSliderValue(
          store,
          channel,
          Number(($event.target as HTMLInputElement).value),
        )
      "
  /></label>
</template>
