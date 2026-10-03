<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  surfaceStyles,
  bindColorArea,
  bindMarkerWheel,
  type ColorView,
  type ColorMarker,
  type HSV,
} from '../core';
import { useColor, useColorStore } from './context';
import { provideSurface } from './surface-context';
defineOptions({ inheritAttrs: false });
const props = withDefaults(
  defineProps<{
    view?: ColorView;
    markers?: readonly ColorMarker[];
    activeId?: string;
    onSelect?: (id: string) => void;
    onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
  }>(),
  { view: 'area' },
);
const store = useColorStore(),
  state = useColor(),
  element = ref<HTMLDivElement>();
provideSurface(computed(() => props.view));
const multi = computed(() => props.markers !== undefined);
watch(
  [element, () => props.view, multi],
  ([node], _old, cleanup) => {
    if (!node) return;
    cleanup(
      multi.value
        ? bindMarkerWheel(node, {
            getMarkers: () => props.markers ?? [],
            getActiveId: () => props.activeId ?? props.markers?.[0]?.id ?? '',
            select: (id) => props.onSelect?.(id),
            setHSV: (id, hsv) => props.onMarkerChange?.(id, hsv),
          })
        : bindColorArea(node, store, props.view),
    );
  },
  { flush: 'post' },
);
defineExpose({ element });
</script>
<template>
  <div
    role="group"
    :aria-label="
      view === 'wheel' ? 'Hue and saturation' : 'Saturation and brightness'
    "
    :style="surfaceStyles(markers ? { ...state, v: 100 } : state, view)"
    v-bind="$attrs"
    ref="element"
    data-cp-part="surface"
    :data-view="view"
    :aria-disabled="state.disabled"
    :tabindex="
      state.disabled ? -1 : (($attrs.tabindex as number | undefined) ?? 0)
    "
  >
    <slot />
  </div>
</template>
