'use client';
import type { ReactNode } from 'react';
import type { ColorPartClasses, ColorSnapshot } from '../core';
import { useColor } from './context';
import { ColorPlane, ColorThumb, type ColorPlaneProps } from './primitives';
export function ColorArea({
  className = '',
  classes = {},
  thumbText,
  renderThumb,
  label = 'Saturation and brightness',
  style,
  ...attributes
}: Omit<ColorPlaneProps, 'view'> & {
  classes?: ColorPartClasses;
  thumbText?: ReactNode;
  renderThumb?: (state: ColorSnapshot) => ReactNode;
  label?: string;
}) {
  const state = useColor();
  return (
    <ColorPlane
      {...attributes}
      className={`cp-area ${className} ${classes.root ?? ''}`}
      aria-label={label}
      style={{
        width: '100%',
        minHeight: 'var(--cp-area-height,180px)',
        ...style,
      }}
    >
      <ColorThumb className={`cp-thumb ${classes.thumb ?? ''}`}>
        <span data-cp-part="thumb-text" className={classes.text}>
          {renderThumb ? renderThumb(state) : thumbText}
        </span>
      </ColorThumb>
    </ColorPlane>
  );
}
