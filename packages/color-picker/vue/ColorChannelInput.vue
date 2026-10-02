<script setup lang="ts">
import { computed } from 'vue';
import {
  channelSpecs,
  type ChannelFormat,
  type ChannelIndex,
  type ColorPartClasses,
} from '../core';
import ColorField from './ColorField.vue';
defineOptions({ inheritAttrs: false });
const props = defineProps<{
  format: ChannelFormat;
  index: ChannelIndex;
  classes?: ColorPartClasses;
}>();
const spec = computed(() => channelSpecs[props.format][props.index]);
</script>
<template>
  <label :class="['cp-channel', $attrs.class, classes?.root, classes?.label]"
    ><span :class="classes?.text">{{ spec.label }}</span>
    <span class="cp-channel-field"
      ><ColorField
        v-bind="{ ...$attrs, class: classes?.input }"
        :format="format"
        :index="index"
      /><span aria-hidden="true">{{ spec.unit }}</span></span
    ></label
  >
</template>
