<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref } from 'vue';
import { nextColorFormat, type ColorFormat } from '../core';
import { useColor, useColorStore } from './context';
const props = defineProps<{ format?: ColorFormat; disabled?: boolean }>(),
  state = useColor(),
  store = useColorStore(),
  element = ref<HTMLButtonElement>();
defineExpose({ element });
</script>
<template>
  <button
    type="button"
    aria-label="Change color format"
    v-bind="$attrs"
    ref="element"
    :disabled="disabled || state.disabled"
    data-cp-part="format-trigger"
    :aria-pressed="format ? state.format === format : undefined"
    @click="
      (event) => {
        if (!event.defaultPrevented) nextColorFormat(store, format);
      }
    "
  >
    <slot :state="state">{{ state.format.toUpperCase() }}</slot>
  </button>
</template>
