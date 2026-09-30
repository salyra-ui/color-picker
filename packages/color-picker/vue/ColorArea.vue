<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  areaStyle,
  thumbStyle,
  bindColorArea,
  type ColorPartClasses,
} from '../core';
import { useColor, useColorStore } from './context';
withDefaults(
  defineProps<{
    label?: string;
    classes?: ColorPartClasses;
    thumbText?: string;
  }>(),
  { classes: () => ({}) },
);
const store = useColorStore(),
  color = useColor(),
  element = ref<HTMLElement>();
let cleanup: (() => void) | undefined;
onMounted(() => {
  cleanup = bindColorArea(element.value!, store);
});
onBeforeUnmount(() => cleanup?.());
</script>
<template>
  <div
    ref="element"
    :class="['cp-area', classes.root]"
    data-cp-part="surface"
    role="group"
    tabindex="0"
    :aria-label="`${label ?? 'Saturation and brightness'}. Arrow keys adjust; Shift for larger steps. ${Math.round(color.s)}% saturation, ${Math.round(color.v)}% brightness.`"
    :style="areaStyle(color)"
  >
    <span
      data-cp-part="thumb"
      :class="classes.thumb"
      aria-hidden="true"
      :style="thumbStyle(color)"
      ><span data-cp-part="thumb-text" :class="classes.text"
        ><slot name="thumb">{{ thumbText }}</slot></span
      ></span
    >
  </div>
</template>
