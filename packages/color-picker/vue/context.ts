import {
  inject,
  provide,
  shallowRef,
  onScopeDispose,
  type InjectionKey,
} from 'vue';
import type { ColorStore } from '../core';
const key: InjectionKey<ColorStore> = Symbol('@salyra-ui/color-picker');
export function provideColor(store: ColorStore) {
  provide(key, store);
  return store;
}
export function useColorStore() {
  const store = inject(key);
  if (!store) throw new Error('Color components require ColorProvider');
  return store;
}
export function useColor() {
  return watchColor(useColorStore());
}
export function watchColor(store: ColorStore) {
  const state = shallowRef(store.getSnapshot());
  onScopeDispose(
    store.subscribe(() => {
      state.value = store.getSnapshot();
    }),
  );
  return state;
}
