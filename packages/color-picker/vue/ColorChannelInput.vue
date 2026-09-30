<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  channelSpecs,
  channelValue,
  setColorChannel,
  type ChannelFormat,
  type ChannelIndex,
} from '../core';
import type { ColorPartClasses } from '../core';
import { useColor, useColorStore } from './context';
const props = defineProps<{
  classes?: ColorPartClasses;
  format: ChannelFormat;
  index: ChannelIndex;
}>();
const color = useColor(),
  store = useColorStore(),
  spec = computed(() => channelSpecs[props.format][props.index]),
  draft = ref(channelValue(color.value, props.format, props.index)),
  focused = ref(false),
  invalid = ref(false);
watch([color, () => props.format, () => props.index], () => {
  if (!focused.value) reset();
});
function change(raw: string) {
  draft.value = raw;
  try {
    if (!raw.trim()) throw new Error('Incomplete');
    setColorChannel(store, props.format, props.index, Number(raw));
    invalid.value = false;
  } catch {
    invalid.value = true;
  }
}
function reset() {
  draft.value = channelValue(store.getSnapshot(), props.format, props.index);
  invalid.value = false;
}
</script>
<template>
  <label :class="['cp-channel', classes?.root, classes?.label]"
    ><span>{{ spec.label }}</span
    ><span class="cp-channel-field"
      ><input
        data-cp-part="input"
        :class="classes?.input"
        type="number"
        :aria-label="`${format.toUpperCase()} ${spec.label}`"
        :min="spec.min"
        :max="spec.max"
        :step="spec.step"
        :value="draft"
        :aria-invalid="invalid"
        @focus="focused = true"
        @input="change(($event.target as HTMLInputElement).value)"
        @blur="
          focused = false;
          reset();
        "
        @keydown.enter="reset"
      /><span aria-hidden="true">{{ spec.unit }}</span></span
    ></label
  >
</template>
