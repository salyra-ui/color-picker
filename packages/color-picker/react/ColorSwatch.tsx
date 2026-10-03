'use client';
import { useColorStore } from './context';
export function ColorSwatch({
  value,
  label = value,
  className = '',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const store = useColorStore();
  return (
    <button
      type="button"
      className={`cp-swatch ${className}`}
      aria-label={label}
      style={{ background: value }}
      onClick={() => store.setHex(value)}
    />
  );
}
