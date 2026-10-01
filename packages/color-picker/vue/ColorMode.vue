<script setup lang="ts">
import { colorFormats } from '../core';
import { useColor, useColorStore } from './context';
const color = useColor(),
  store = useColorStore();
</script>
<template>
  <button
    type="button"
    class="cp-mode"
    :aria-label="`Next color format (${color.format.toUpperCase()})`"
    @click="
      store.setFormat(
        colorFormats[
          (colorFormats.indexOf(color.format) + 1) % colorFormats.length
        ],
      )
    "
  >
    <slot :format="color.format">Next format</slot>
  </button>
</template>
