'use client';
import { type CSSProperties } from 'react';
import { colorPreviewStyles } from '../core';
import { useColor } from './context';
export function ColorPreview({ className = '' }: { className?: string }) {
  const state = useColor();
  return (
    <output
      className={`cp-preview ${className}`}
      style={colorPreviewStyles(state.value) as CSSProperties}
      aria-label={`Selected color ${state.value}`}
    >
      {state.value}
    </output>
  );
}
