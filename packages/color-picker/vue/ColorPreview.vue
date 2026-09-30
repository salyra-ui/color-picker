<script setup lang="ts">
import { useColor } from './context';
const color = useColor();
</script>
<template>
  <output
    class="cp-preview"
    :style="{ background: color.value }"
    :aria-label="`Selected color ${color.value}`"
    >{{ color.value }}</output
  >
</template>
