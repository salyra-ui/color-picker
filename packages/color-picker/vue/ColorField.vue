<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref, watch, computed } from 'vue';
import {
  bindColorValueInput,
  colorInputAttributes,
  type ColorInputOptions,
} from '../core';
import { useColor, useColorStore } from './context';
const props = defineProps<ColorInputOptions & { disabled?: boolean }>(),
  state = useColor(),
  store = useColorStore(),
  element = ref<HTMLInputElement>();
const initialValue = colorInputAttributes(store.getSnapshot(), props).value;
const inputAttrs = computed(() => {
  const { value, ...attrs } = colorInputAttributes(state.value, props);
  return attrs;
});
const vInitialValue = {
  getSSRProps: (binding: { value: string }) => ({ value: binding.value }),
};
watch(
  [element, () => props.format, () => props.index],
  ([node], _old, cleanup) => {
    if (node)
      cleanup(bindColorValueInput(node, store, props, () => !!props.disabled));
  },
  { flush: 'post' },
);
defineExpose({ element });
</script>
<template>
  <input
    v-initial-value="initialValue"
    v-bind="{ ...inputAttrs, ...$attrs }"
    ref="element"
    :disabled="disabled || state.disabled"
    data-cp-part="input"
    spellcheck="false"
  />
</template>
