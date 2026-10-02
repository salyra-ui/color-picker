<script setup lang="ts">
import type { ColorMarker, ColorPartClasses, HSV } from '../core';
import ColorWheelSurface from './ColorWheelSurface.vue';
import ColorThumb from './ColorThumb.vue';
import ColorMarkerThumb from './ColorMarkerThumb.vue';
defineOptions({ inheritAttrs: false });
withDefaults(
  defineProps<{
    classes?: ColorPartClasses;
    thumbText?: string;
    label?: string;
    markers?: readonly ColorMarker[];
    activeId?: string;
  }>(),
  { label: 'Hue and saturation wheel' },
);
const emit = defineEmits<{
  select: [id: string];
  markerChange: [id: string, hsv: Partial<HSV>];
}>();
</script>
<template>
  <ColorWheelSurface
    v-bind="$attrs"
    :class="['cp-wheel', $attrs.class, classes?.root]"
    :aria-label="label"
    :markers="markers"
    :active-id="activeId"
    :on-select="(id) => emit('select', id)"
    :on-marker-change="(id, hsv) => emit('markerChange', id, hsv)"
  >
    <template v-if="markers"
      ><ColorMarkerThumb
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        :active="marker.id === activeId"
        :class="['cp-wheel-marker', classes?.marker]"
      >
        <span data-cp-part="marker-text" :class="classes?.text"
          ><slot
            name="marker"
            :marker="marker"
            :active="marker.id === activeId"
            >{{ marker.label }}</slot
          ></span
        >
      </ColorMarkerThumb></template
    ><ColorThumb v-else :class="['cp-thumb', classes?.thumb]"
      ><span data-cp-part="thumb-text" :class="classes?.text"
        ><slot name="thumb">{{ thumbText }}</slot></span
      ></ColorThumb
    >
  </ColorWheelSurface>
</template>
