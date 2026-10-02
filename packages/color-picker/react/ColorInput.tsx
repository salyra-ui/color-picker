'use client';
import { type ColorFormat, type ColorPartClasses } from '../core';
import { ColorChannelInput } from './ColorChannelInput';
import { ColorTextInput } from './ColorTextInput';
import { useColor } from './context';
export function ColorInput({
  format: override,
  label,
  className = '',
  classes = {},
}: {
  format?: ColorFormat;
  label?: string;
  className?: string;
  classes?: ColorPartClasses;
}) {
  const state = useColor(),
    format = override ?? state.format;
  return format === 'hex' ? (
    <ColorTextInput
      format="hex"
      label={label ?? 'HEX'}
      className={className}
      classes={classes}
    />
  ) : (
    <div
      className={`cp-channels ${className}`}
      role="group"
      aria-label={label ?? format.toUpperCase()}
    >
      {([0, 1, 2] as const).map((index) => (
        <ColorChannelInput
          key={`${format}-${index}`}
          classes={classes}
          format={format}
          index={index}
        />
      ))}
    </div>
  );
}
