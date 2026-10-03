'use client';
import type { InputHTMLAttributes } from 'react';
import type { ColorFormat, ColorPartClasses } from '../core';
import { useColor } from './context';
import { ColorField } from './primitives';
export function ColorTextInput({
  format: override,
  label,
  className = '',
  classes = {},
  ...attributes
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> & {
  format?: ColorFormat;
  label?: string;
  classes?: ColorPartClasses;
}) {
  const state = useColor(),
    format = override ?? state.format;
  return (
    <label
      className={`cp-input ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
    >
      {label ?? format.toUpperCase()}
      <ColorField {...attributes} className={classes.input} format={format} />
    </label>
  );
}
