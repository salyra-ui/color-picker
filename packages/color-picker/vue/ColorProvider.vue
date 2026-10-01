<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from 'vue';
import {
  subscribeColor,
  createColorStore,
  type ColorView,
  type ColorStore,
} from '../core';
import { provideColor, watchColor } from './context';
const props = withDefaults(defineProps<{
  value?: string;
  disabled?: boolean;
  store?: ColorStore;
  view?: ColorView;
}>(), { disabled: undefined });
const emit = defineEmits<{ change: [hex: string] }>();
const store = provideColor(
  props.store ??
    createColorStore(props.value, 'hex', props.view, props.disabled),
);
const color = watchColor(store);
watch(
  () => props.disabled,
  (value) => {
    if (value !== undefined) store.setDisabled(value);
  },
  { immediate: true },
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
<template>
  <fieldset
    class="cp-provider-controls"
    :disabled="color.disabled"
    :inert="color.disabled"
    :aria-disabled="color.disabled"
    :data-disabled="color.disabled"
  >
    <slot />
  </fieldset>
</template>
