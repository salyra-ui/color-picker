'use client';
import { colorFormats, type ColorFormat } from '../core';
import { useColor, useColorStore } from './context';
export function ColorFormatSelect({
  label = 'Color format',
  className = '',
}: {
  label?: string;
  className?: string;
}) {
  const store = useColorStore(),
    state = useColor();
  return (
    <label className={`cp-format ${className}`}>
      {label}
      <select
        data-cp-part="select"
        value={state.format}
        onChange={(e) => store.setFormat(e.target.value as ColorFormat)}
      >
        {colorFormats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
