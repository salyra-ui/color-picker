<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { bindAlphaInput, type ColorPartClasses } from '../core';
import { useColorStore } from './context';
withDefaults(defineProps<{ label?: string; classes?: ColorPartClasses }>(), {
  label: 'Alpha',
  classes: () => ({}),
});
const store = useColorStore(),
  initial = Number((store.getSnapshot().alpha * 100).toFixed(1)),
  input = ref<HTMLInputElement>();
let cleanup: (() => void) | undefined;
onMounted(() => (cleanup = bindAlphaInput(input.value!, store)));
onBeforeUnmount(() => cleanup?.());
</script>
<template>
  <label
    :class="['cp-alpha-input', 'cp-channel', classes.root, classes.label]"
    data-cp-part="alpha-input"
    >{{ label
    }}<span class="cp-channel-field"
      ><input
        ref="input"
        data-cp-part="input"
        :class="classes.input"
        type="number"
        min="0"
        max="100"
        step="0.1"
        :value="initial"
        :aria-label="label"
      /><span>%</span></span
    ></label
  >
</template>
