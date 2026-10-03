<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref, onMounted, onUnmounted, watch } from 'vue';
import {
  createColorEyeDropper,
  type ColorEyeDropperController,
  type ColorEyeDropperState,
} from '../core';
import { useColor, useColorStore } from './context';
const props = withDefaults(
  defineProps<{ preserveAlpha?: boolean; disabled?: boolean }>(),
  { preserveAlpha: true, disabled: false },
);
const emit = defineEmits<{ pick: [hex: string]; pickError: [error: Error] }>();
const color = useColor(),
  store = useColorStore(),
  element = ref<HTMLButtonElement>();
const state = ref<ColorEyeDropperState>({
  supported: false,
  pending: false,
  error: undefined,
});
let eye: ColorEyeDropperController | undefined, stop: (() => void) | undefined;
onMounted(() => {
  eye = createColorEyeDropper(store);
  stop = eye.subscribe(() => (state.value = eye!.getSnapshot()));
  eye.mount();
});
onUnmounted(() => {
  stop?.();
  eye?.destroy();
});
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) eye?.cancel();
  },
);
function pick(event: MouseEvent) {
  if (event.defaultPrevented || props.disabled) return;
  void eye
    ?.pick({ preserveAlpha: props.preserveAlpha })
    .then((hex) => {
      if (hex) emit('pick', hex);
    })
    .catch((error) => emit('pickError', error));
}
defineExpose({ element });
</script>
<template>
  <button
    type="button"
    aria-label="Pick color from screen"
    v-bind="$attrs"
    ref="element"
    :disabled="disabled || color.disabled || !state.supported || state.pending"
    data-cp-part="eyedropper"
    :data-cp-supported="state.supported"
    :aria-busy="state.pending"
    @click="pick"
  >
    <slot :state="state">Pick from screen</slot>
  </button>
</template>
