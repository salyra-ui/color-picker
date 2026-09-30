<script setup lang="ts">
import { colorViews, type ColorView } from '../core';
import { useColor, useColorStore } from './context';
withDefaults(defineProps<{ label?: string }>(), { label: 'Picker view' });
const color = useColor(),
  store = useColorStore();
</script>
<template>
  <label class="cp-format"
    >{{ label
    }}<select
      data-cp-part="select"
      :value="color.view"
      @change="
        store.setView(($event.target as HTMLSelectElement).value as ColorView)
      "
    >
      <option v-for="view in colorViews" :key="view" :value="view">
        {{ view === 'area' ? 'Rectangle' : 'Wheel' }}
      </option>
    </select></label
  >
</template>
