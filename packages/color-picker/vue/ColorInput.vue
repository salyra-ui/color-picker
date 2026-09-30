<script setup lang="ts">
import { computed } from 'vue';
import type { ColorFormat } from '../core';
import type { ColorPartClasses } from '../core';
import { useColor } from './context';
import ColorTextInput from './ColorTextInput.vue';
import ColorChannelInput from './ColorChannelInput.vue';
const props = defineProps<{
  classes?: ColorPartClasses;
  format?: ColorFormat;
  label?: string;
}>();
const color = useColor(),
  format = computed(() => props.format ?? color.value.format);
</script>
<template>
  <ColorTextInput
    v-if="format === 'hex'"
    format="hex"
    :classes="classes"
    :label="label ?? 'HEX'"
  />
  <div
    v-else
    class="cp-channels"
    role="group"
    :aria-label="label ?? format.toUpperCase()"
  >
    <ColorChannelInput
      v-for="index in [0, 1, 2] as const"
      :key="`${format}-${index}`"
      :format="format"
      :classes="classes"
      :index="index"
    />
  </div>
</template>
