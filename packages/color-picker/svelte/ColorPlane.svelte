<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    surfaceStyles,
    styleText,
    bindColorArea,
    bindMarkerWheel,
    type ColorView,
    type ColorMarker,
    type HSV,
  } from '../core';
  import { useColor, useColorStore } from './context';
  import { provideSurface } from './surface-context';
  let {
    view = 'area',
    markers,
    activeId,
    onSelect,
    onMarkerChange,
    children,
    style = '',
    ref = $bindable(),
    ...attributes
  }: HTMLAttributes<HTMLDivElement> & {
    view?: ColorView;
    markers?: readonly ColorMarker[];
    activeId?: string;
    onSelect?: (id: string) => void;
    onMarkerChange?: (id: string, hsv: Partial<HSV>) => void;
    children?: Snippet;
    ref?: HTMLDivElement;
  } = $props();
  const store = useColorStore(),
    color = useColor();
  provideSurface(() => view);
  const multi = $derived(markers !== undefined);
  $effect(() => {
    if (!ref) return;
    const node = ref,
      currentView = view,
      isMulti = multi;
    return untrack(() => {
      return isMulti
        ? bindMarkerWheel(node, {
            getMarkers: () => markers ?? [],
            getActiveId: () => activeId ?? markers?.[0]?.id ?? '',
            select: (id) => onSelect?.(id),
            setHSV: (id, hsv) => onMarkerChange?.(id, hsv),
          })
        : bindColorArea(node, store, currentView);
    });
  });
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex (Two-axis keyboard surface, with native sliders available.) -->
<div
  role="group"
  aria-label={view === 'wheel'
    ? 'Hue and saturation'
    : 'Saturation and brightness'}
  {...attributes}
  bind:this={ref}
  data-cp-part="surface"
  data-view={view}
  aria-disabled={$color.disabled}
  tabindex={$color.disabled ? -1 : (attributes.tabindex ?? 0)}
  style={`${styleText(surfaceStyles(markers ? { ...$color, v: 100 } : $color, view))};${style}`}
>
  {#if children}{@render children()}{/if}
</div>
