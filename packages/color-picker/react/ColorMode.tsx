'use client';
import { type ReactNode } from 'react';
import { colorFormats, type ColorFormat } from '../core';
import { useColor, useColorStore } from './context';
export function ColorMode({
  className = '',
  children,
}: {
  className?: string;
  children?: ReactNode | ((format: ColorFormat) => ReactNode);
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <button
      type="button"
      className={`cp-mode ${className}`}
      aria-label={`Next color format (${state.format.toUpperCase()})`}
      onClick={() =>
        store.setFormat(
          colorFormats[
            (colorFormats.indexOf(state.format) + 1) % colorFormats.length
          ],
        )
      }
    >
      {typeof children === 'function'
        ? children(state.format)
        : (children ?? 'Next format')}
    </button>
  );
}
