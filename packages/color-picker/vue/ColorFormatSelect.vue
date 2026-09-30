<script setup lang="ts">
import { colorFormats, type ColorFormat } from '../core';
import { useColor, useColorStore } from './context';
withDefaults(defineProps<{ label?: string }>(), { label: 'Color format' });
const color = useColor(),
  store = useColorStore();
</script>
<template>
  <label class="cp-format"
    >{{ label
    }}<select
      data-cp-part="select"
      :value="color.format"
      @change="
        store.setFormat(
          ($event.target as HTMLSelectElement).value as ColorFormat,
        )
      "
    >
      <option v-for="format in colorFormats" :key="format" :value="format">
        {{ format.toUpperCase() }}
      </option>
    </select></label
  >
</template>
