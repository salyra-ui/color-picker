<script setup lang="ts">
defineOptions({ inheritAttrs: false });
import { ref } from 'vue';
import ColorPlane from './ColorPlane.vue';
import type { ColorMarker, HSV } from '../core';
const props = defineProps<{
  markers?: readonly ColorMarker[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
}>();
const surface = ref<InstanceType<typeof ColorPlane>>();
defineExpose({
  get element() {
    return surface.value?.element;
  },
});
</script>
<template>
  <ColorPlane v-bind="{ ...$attrs, ...props }" view="wheel" ref="surface"
    ><slot
  /></ColorPlane>
</template>
