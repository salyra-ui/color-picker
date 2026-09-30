<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import {
  wheelStyle,
  wheelThumbStyle,
  bindColorArea,
  bindMarkerWheel,
  markerWheelStyle,
  markerStyle,
  type ColorMarker,
  type ColorPartClasses,
  type HSV,
} from '../core';
import { useColor, useColorStore } from './context';
const props = withDefaults(
  defineProps<{
    label?: string;
    classes?: ColorPartClasses;
    thumbText?: string;
    markers?: readonly ColorMarker[];
    activeId?: string;
  }>(),
  { label: 'Hue and saturation wheel', classes: () => ({}), thumbText: '' },
);
const emit = defineEmits<{
  select: [id: string];
  markerChange: [id: string, hsv: Partial<HSV>];
}>();
const store = useColorStore(),
  color = useColor(),
  element = ref<HTMLElement>();
let cleanup: (() => void) | undefined;
onMounted(
  () =>
    (cleanup = props.markers
      ? bindMarkerWheel(element.value!, {
          getMarkers: () => props.markers ?? [],
          getActiveId: () => props.activeId ?? props.markers?.[0]?.id ?? '',
          select: (id) => emit('select', id),
          setHSV: (id, hsv) => emit('markerChange', id, hsv),
        })
      : bindColorArea(element.value!, store, 'wheel')),
);
onBeforeUnmount(() => cleanup?.());
</script>
<template>
  <div
    ref="element"
    data-cp-part="surface"
    :class="['cp-wheel', classes.root]"
    role="group"
    tabindex="0"
    :aria-label="label"
    :style="markers ? markerWheelStyle() : wheelStyle(color)"
  >
    <template v-if="markers"
      ><button
        v-for="marker in markers"
        :key="marker.id"
        type="button"
        data-cp-part="marker"
        :data-marker-id="marker.id"
        :data-small="markers.length === 1 || !marker.label ? 'true' : undefined"
        :class="['cp-wheel-marker', classes.marker]"
        :aria-label="marker.ariaLabel ?? `Select ${marker.id} marker`"
        :aria-pressed="activeId === marker.id"
        :style="markerStyle(marker, activeId === marker.id)"
      >
        <span data-cp-part="marker-text" :class="classes.text"
          ><slot
            name="marker"
            :marker="marker"
            :active="activeId === marker.id"
            >{{ marker.label ?? '' }}</slot
          ></span
        >
      </button></template
    ><span
      v-else
      data-cp-part="thumb"
      aria-hidden="true"
      :class="classes.thumb"
      :style="wheelThumbStyle(color)"
      ><span data-cp-part="thumb-text" :class="classes.text"
        ><slot name="thumb">{{ thumbText }}</slot></span
      ></span
    >
  </div>
</template>
