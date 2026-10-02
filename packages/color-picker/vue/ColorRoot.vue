<script setup lang="ts">
import { onMounted, onScopeDispose, watch } from 'vue';
import { createColorStore, subscribeColor, type ColorStore } from '../core';
import { provideColor } from './context';
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  store?: ColorStore;
  value?: string;
  modelValue?: string;
  defaultValue?: string;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  'update:modelValue': [value: string];
  valueChange: [value: string];
}>();
const store = provideColor(
  props.store ??
    createColorStore(
      props.modelValue ?? props.value ?? props.defaultValue,
      'hex',
      'area',
      props.disabled,
    ),
);
watch(
  () => props.disabled,
  (value) => {
    if (value !== undefined) store.setDisabled(value);
  },
  { immediate: true },
);
watch(
  () => props.modelValue ?? props.value,
  (value) => {
    if (value !== undefined) store.setHex(value);
  },
);
let stop: (() => void) | undefined;
onMounted(() => {
  stop = subscribeColor(store, (value) => {
    emit('update:modelValue', value);
    emit('valueChange', value);
  });
});
onScopeDispose(() => stop?.());
defineExpose({ store });
</script>
<template><slot /></template>
