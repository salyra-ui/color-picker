'use client';
import { useSyncExternalStore, type ReactNode } from 'react';
import {
  type ColorCollectionClasses,
  type ColorCollectionStore,
} from '../core';
import { useColor, useColorStore } from './context';
/** Recent or favorite colors, using the nearest color context. */
export function ColorCollection({
  collection,
  kind = 'recent',
  label = kind === 'recent' ? 'Recent colors' : 'Favorite colors',
  classes = {},
  renderLabel,
}: {
  collection: ColorCollectionStore;
  kind?: 'recent' | 'favorites';
  label?: string;
  classes?: ColorCollectionClasses;
  renderLabel?: (color: string) => ReactNode;
}) {
  const store = useColorStore(),
    color = useColor();
  const state = useSyncExternalStore(
    collection.subscribe,
    collection.getSnapshot,
    collection.getSnapshot,
  );
  return (
    <fieldset
      className={`cp-collection ${classes.root ?? ''}`}
      disabled={color.disabled}
    >
      <legend className={classes.label}>{label}</legend>
      {state[kind].map((value) => (
        <button
          key={value}
          type="button"
          className={`cp-swatch ${classes.item ?? ''}`}
          style={{ background: value }}
          aria-label={value}
          onClick={() => store.setHex(value)}
        >
          {renderLabel?.(value)}
        </button>
      ))}
    </fieldset>
  );
}
