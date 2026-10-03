'use client';
import { createContext, useContext, useSyncExternalStore } from 'react';
import type { ColorStore } from '../core';
export const Context = createContext<ColorStore | null>(null);
export function useColorStore() {
  const store = useContext(Context);
  if (!store) throw new Error('Color components require ColorProvider');
  return store;
}
export function useColor() {
  const store = useColorStore();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}
