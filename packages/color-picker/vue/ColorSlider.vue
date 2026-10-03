<script setup lang="ts">
import {
  sliderLabels,
  type SliderChannel,
  type ColorPartClasses,
} from '../core';
import ColorRange from './ColorRange.vue';
defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<{
    channel?: SliderChannel;
    label?: string;
    classes?: ColorPartClasses;
  }>(),
  { channel: 'h' },
);
</script>
<template>
  <label
    :class="['cp-slider', $attrs.class, classes?.root, classes?.label]"
    data-cp-part="slider"
    :data-channel="channel"
    >{{ label ?? sliderLabels[channel] }}
    <ColorRange
      v-bind="{ ...$attrs, class: [classes?.track, classes?.input] }"
      :channel="channel"
      :aria-label="label ?? sliderLabels[channel]"
  /></label>
</template>
