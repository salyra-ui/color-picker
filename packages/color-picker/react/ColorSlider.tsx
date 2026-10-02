'use client';
import type { ComponentProps } from 'react';
import { sliderLabels, type ColorPartClasses } from '../core';
import { ColorRange } from './primitives';
export function ColorSlider({
  channel = 'h',
  label,
  className = '',
  classes = {},
  ...attributes
}: ComponentProps<typeof ColorRange> & {
  label?: string;
  classes?: ColorPartClasses;
}) {
  return (
    <label
      className={`cp-slider ${className} ${classes.root ?? ''} ${classes.label ?? ''}`}
      data-cp-part="slider"
      data-channel={channel}
    >
      {label ?? sliderLabels[channel]}
      <ColorRange
        {...attributes}
        channel={channel}
        aria-label={label ?? sliderLabels[channel]}
        className={`${classes.track ?? ''} ${classes.input ?? ''}`}
      />
    </label>
  );
}
