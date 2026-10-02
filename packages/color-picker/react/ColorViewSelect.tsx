'use client';
import { colorViews, type ColorView } from '../core';
import { useColor, useColorStore } from './context';
export function ColorViewSelect({
  label = 'Picker view',
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
        value={state.view}
        onChange={(e) => store.setView(e.target.value as ColorView)}
      >
        {colorViews.map((view) => (
          <option key={view} value={view}>
            {view === 'area' ? 'Rectangle' : 'Wheel'}
          </option>
        ))}
      </select>
    </label>
  );
}
