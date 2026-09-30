import { getContext, setContext } from 'svelte';
import type { ColorStore, ColorSnapshot } from '../core';
const key = Symbol('@sebytza23/color-picker');
export const provideColor = (store: ColorStore) => setContext(key, store);
export function useColorStore(): ColorStore {
  const store = getContext<ColorStore>(key);
  if (!store) throw new Error('Color components require ColorProvider');
  return store;
}
export function useColor() {
  const store = useColorStore();
  return {
    subscribe(run: (state: ColorSnapshot) => void) {
      run(store.getSnapshot());
      return store.subscribe(() => run(store.getSnapshot()));
    },
  };
}
