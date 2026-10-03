<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref } from 'vue';
import { thumbPosition } from '../core';
import { useColor } from './context';
import { useSurface } from './surface-context';
const state = useColor(),
  view = useSurface(),
  element = ref<HTMLSpanElement>();
defineExpose({ element });
</script>
<template>
  <span
    :style="thumbPosition(state, view ?? 'area')"
    v-bind="$attrs"
    ref="element"
    data-cp-part="thumb"
    aria-hidden="true"
    ><slot
  /></span>
</template>
