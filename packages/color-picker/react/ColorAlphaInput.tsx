'use client';
import { useEffect, useRef } from 'react';
import { bindAlphaInput, type ColorPartClasses } from '../core';
import { useColorStore } from './context';
export function ColorAlphaInput({
  label = 'Alpha',
  className = '',
  classes = {},
}: {
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const store = useColorStore(),
    ref = useRef<HTMLInputElement>(null);
  useEffect(() => bindAlphaInput(ref.current!, store), [store]);
  return (
    <label
      className={`cp-alpha-input cp-channel ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
      data-cp-part="alpha-input"
    >
      {label}
      <span className="cp-channel-field">
        <input
          ref={ref}
          data-cp-part="input"
          className={classes.input}
          type="number"
          min={0}
          max={100}
          step={0.1}
          defaultValue={Number((store.getSnapshot().alpha * 100).toFixed(1))}
          aria-label={label}
        />
        <span>%</span>
      </span>
    </label>
  );
}
