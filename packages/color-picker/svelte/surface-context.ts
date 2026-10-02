import { getContext, setContext } from 'svelte';
import type { ColorView } from '../core';
const surfaceKey = Symbol('color-surface');
export function provideSurface(view: () => ColorView) {
  setContext(surfaceKey, view);
}
export function useSurface() {
  return getContext<() => ColorView>(surfaceKey) ?? (() => 'area');
}
