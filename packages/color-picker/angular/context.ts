import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { createColorStore, type ColorStore } from '../core';
@Injectable()
export class ColorContext {
  private current = createColorStore();
  private listeners = new Set<() => void>();
  private forward = () => this.listeners.forEach((fn) => fn());
  private unsubscribe = this.current.subscribe(this.forward);
  readonly store: ColorStore = {
    getColor: () => this.current.getColor(),
    getValue: (format) => this.current.getValue(format),
    getSnapshot: () => this.current.getSnapshot(),
    getServerSnapshot: () => this.current.getServerSnapshot(),
    subscribe: (fn) => {
      this.listeners.add(fn);
      return () => {
        this.listeners.delete(fn);
      };
    },
    setDisabled: (disabled) => this.current.setDisabled(disabled),
    setView: (view) => this.current.setView(view),
    setFormat: (format) => this.current.setFormat(format),
    setAlpha: (alpha) => this.current.setAlpha(alpha),
    setHex: (hex) => this.current.setHex(hex),
    setHSV: (hsv) => this.current.setHSV(hsv),
  };
  constructor() {
    inject(DestroyRef).onDestroy(() => this.unsubscribe());
  }
  configure(store: ColorStore) {
    this.unsubscribe();
    this.current = store;
    this.unsubscribe = store.subscribe(this.forward);
    this.forward();
  }
}
export function useColorStore() {
  return inject(ColorContext).store;
}
export function useColor() {
  const store = useColorStore(),
    state = signal(store.getSnapshot());
  inject(DestroyRef).onDestroy(
    store.subscribe(() => state.set(store.getSnapshot())),
  );
  return state.asReadonly();
}
