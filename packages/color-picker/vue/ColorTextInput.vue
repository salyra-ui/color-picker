<script setup lang="ts">
import { computed } from 'vue';
import type { ColorFormat, ColorPartClasses } from '../core';
import { useColor } from './context';
import ColorField from './ColorField.vue';
defineOptions({ inheritAttrs: false });
const props = defineProps<{
    format?: ColorFormat;
    label?: string;
    classes?: ColorPartClasses;
  }>(),
  state = useColor();
const format = computed(() => props.format ?? state.value.format);
</script>
<template>
  <label :class="['cp-input', $attrs.class, classes?.root, classes?.label]"
    >{{ label ?? format.toUpperCase() }}
    <ColorField v-bind="{ ...$attrs, class: classes?.input }" :format="format"
  /></label>
</template>
