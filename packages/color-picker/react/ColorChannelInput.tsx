'use client';
import type { InputHTMLAttributes } from 'react';
import {
  channelSpecs,
  type ChannelFormat,
  type ChannelIndex,
  type ColorPartClasses,
} from '../core';
import { ColorField } from './primitives';
export function ColorChannelInput({
  format,
  index,
  className = '',
  classes = {},
  ...attributes
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue'> & {
  format: ChannelFormat;
  index: ChannelIndex;
  classes?: ColorPartClasses;
}) {
  const spec = channelSpecs[format][index];
  return (
    <label
      className={`cp-channel ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
    >
      <span className={classes.text}>{spec.label}</span>
      <span className="cp-channel-field">
        <ColorField
          {...attributes}
          className={classes.input}
          format={format}
          index={index}
        />
        <span aria-hidden="true">{spec.unit}</span>
      </span>
    </label>
  );
}
