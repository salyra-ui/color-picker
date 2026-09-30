<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue';
import {
  subscribeColor,
  createColorStore,
  type ColorView,
  type ColorStore,
} from '../core';
import { provideColor } from './context';
const props = defineProps<{
  value?: string;
  store?: ColorStore;
  view?: ColorView;
}>();
const emit = defineEmits<{ change: [hex: string] }>();
const store = provideColor(
  props.store ?? createColorStore(props.value, 'hex', props.view),
);
let unsubscribe: (() => void) | undefined;
onMounted(() => {
  unsubscribe = subscribeColor(store, (hex) => emit('change', hex));
});
onBeforeUnmount(() => unsubscribe?.());
watch(
  () => props.value,
  (value) => {
    if (value) store.setHex(value);
  },
);
</script>
<template><slot /></template>
