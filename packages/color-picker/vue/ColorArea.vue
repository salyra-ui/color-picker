<script setup lang="ts">
import type { ColorPartClasses } from '../core';
import ColorPlane from './ColorPlane.vue';
import ColorThumb from './ColorThumb.vue';
defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<{
    classes?: ColorPartClasses;
    thumbText?: string;
    label?: string;
  }>(),
  { label: 'Saturation and brightness' },
);
</script>
<template>
  <ColorPlane
    v-bind="$attrs"
    :class="['cp-area', $attrs.class, classes?.root]"
    :aria-label="label"
    :style="{ width: '100%', minHeight: 'var(--cp-area-height,180px)' }"
  >
    <ColorThumb :class="['cp-thumb', classes?.thumb]"
      ><span data-cp-part="thumb-text" :class="classes?.text"
        ><slot name="thumb">{{ thumbText }}</slot></span
      ></ColorThumb
    >
  </ColorPlane>
</template>
