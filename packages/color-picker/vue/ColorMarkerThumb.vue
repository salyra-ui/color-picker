<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref } from 'vue';
import { useColor } from './context';
const state = useColor();
import { thumbPosition, type ColorMarker as Marker } from '../core';
const props = defineProps<{
    marker: Marker;
    active?: boolean;
    disabled?: boolean;
  }>(),
  element = ref<HTMLButtonElement>();
defineExpose({ element });
</script>
<template>
  <button
    type="button"
    :aria-label="marker.ariaLabel ?? marker.id"
    :style="{
      ...thumbPosition(marker.color, 'wheel'),
      pointerEvents: 'auto',
      background: marker.color.hex,
      zIndex: active ? 2 : 1,
    }"
    v-bind="$attrs"
    :disabled="disabled || state.disabled"
    ref="element"
    data-cp-part="marker"
    :data-marker-id="marker.id"
    :data-small="!marker.label || undefined"
    :aria-pressed="!!active"
    :data-state="active ? 'active' : 'inactive'"
  >
    <slot>{{ marker.label }}</slot>
  </button>
</template>
