<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref, watch } from 'vue';
import {
  bindColorSlider,
  sliderAttributes,
  sliderLabels,
  sliderTrackVariables,
  type SliderChannel,
} from '../core';
import { useColor, useColorStore } from './context';
const props = withDefaults(
  defineProps<{ channel?: SliderChannel; disabled?: boolean }>(),
  { channel: 'h' },
);
const state = useColor(),
  store = useColorStore(),
  element = ref<HTMLInputElement>();
watch(
  [element, () => props.channel],
  ([node], _old, cleanup) => {
    if (node)
      cleanup(
        bindColorSlider(node, store, props.channel, () => !!props.disabled),
      );
  },
  { flush: 'post' },
);
defineExpose({ element });
</script>
<template>
  <input
    :aria-label="sliderLabels[channel]"
    :style="sliderTrackVariables(state)"
    v-bind="{ ...$attrs, ...sliderAttributes(state, channel) }"
    ref="element"
    :disabled="disabled || state.disabled"
    data-cp-part="slider"
    :data-channel="channel"
  />
</template>
