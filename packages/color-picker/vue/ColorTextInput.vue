<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { parseColor, formatColor, type ColorFormat } from '../core';
import type { ColorPartClasses } from '../core';
import { useColor, useColorStore } from './context';
const props = defineProps<{
  classes?: ColorPartClasses;
  format?: ColorFormat;
  label?: string;
}>();
const store = useColorStore(),
  color = useColor(),
  format = computed(() => props.format ?? color.value.format),
  draft = ref(formatColor(color.value.hex, format.value, color.value.alpha)),
  invalid = ref(false),
  focused = ref(false);
watch(
  [() => color.value.hex, () => color.value.alpha, () => format.value],
  () => {
    if (!focused.value) reset();
  },
);
function change(text: string) {
  draft.value = text;
  try {
    store.setHex(parseColor(text, format.value));
    invalid.value = false;
  } catch {
    invalid.value = true;
  }
}
function reset() {
  draft.value = formatColor(
    store.getSnapshot().hex,
    format.value,
    store.getSnapshot().alpha,
  );
  invalid.value = false;
}
</script>
<template>
  <label :class="['cp-input', classes?.root, classes?.label]"
    >{{ label ?? format.toUpperCase()
    }}<input
      data-cp-part="input"
      :class="classes?.input"
      :value="draft"
      spellcheck="false"
      :maxlength="format === 'hex' ? 9 : 64"
      :aria-invalid="invalid"
      @focus="focused = true"
      @input="change(($event.target as HTMLInputElement).value)"
      @blur="
        focused = false;
        reset();
      "
      @keydown.enter="reset"
  /></label>
</template>
