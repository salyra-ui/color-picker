<script setup lang="ts">
import { colorPreviewStyles } from '../core';
import { useColor } from './context';
const color = useColor();
</script>
<template>
  <output
    class="cp-preview"
    :style="colorPreviewStyles(color.value)"
    :aria-label="`Selected color ${color.value}`"
    >{{ color.value }}</output
  >
</template>
