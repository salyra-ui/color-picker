'use client';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  createColorStore,
  subscribeColor,
  type ColorStore,
  type ColorView,
} from '../core';
import { Context } from './context';
export function ColorProvider({
  value,
  view = 'area',
  onChange,
  children,
  disabled,
  store: provided,
}: {
  value?: string;
  disabled?: boolean;
  view?: ColorView;
  onChange?: (hex: string) => void;
  children: ReactNode;
  store?: ColorStore;
}) {
  const [store] = useState(() => {
    const initial = provided ?? createColorStore(value, 'hex', view, disabled);
    if (disabled !== undefined) initial.setDisabled(disabled);
    return initial;
  });
  const state = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  useEffect(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  }, [store, disabled]);
  const callback = useRef(onChange);
  callback.current = onChange;
  useEffect(() => {
    if (value !== undefined) store.setHex(value);
  }, [store, value]);
  useEffect(
    () => subscribeColor(store, (hex) => callback.current?.(hex)),
    [store],
  );
  return (
    <Context.Provider value={store}>
      <fieldset
        className="cp-provider-controls"
        disabled={state.disabled}
        {...(state.disabled ? { inert: '' } : {})}
        aria-disabled={state.disabled}
        data-disabled={state.disabled}
      >
        {children}
      </fieldset>
    </Context.Provider>
  );
}
