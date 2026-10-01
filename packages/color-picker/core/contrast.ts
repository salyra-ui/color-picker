import {
  contrast,
  hexAlpha,
  hexToRgb,
  normalizeColorHex,
  opaqueHex,
  rgbToHex,
} from './color';

/** Composite sRGB channels over an opaque canvas before measuring luminance. */
export function compositeColor(color: string, background: string): string {
  const alpha = hexAlpha(normalizeColorHex(color));
  if (hexAlpha(normalizeColorHex(background)) !== 1)
    throw new TypeError('Composite background must be opaque');
  const fg = hexToRgb(color),
    bg = hexToRgb(background);
  return rgbToHex(
    fg.map((channel, i) => channel * alpha + bg[i] * (1 - alpha)) as [
      number,
      number,
      number,
    ],
  );
}
export interface ContrastResult {
  readonly ratio: number;
  readonly aa: boolean;
  readonly aaa: boolean;
  readonly foreground: string;
  readonly background: string;
  /** Suggested opaque text color. The caller chooses whether to apply it. */
  readonly suggestedForeground: string;
}
export function colorContrast(
  foreground: string,
  background: string,
  options: { canvas?: string; text?: 'normal' | 'large' } = {},
): ContrastResult {
  const canvas = normalizeColorHex(options.canvas ?? '#FFFFFF');
  if (hexAlpha(canvas) !== 1)
    throw new TypeError('Contrast canvas must be opaque');
  if (
    options.text !== undefined &&
    options.text !== 'normal' &&
    options.text !== 'large'
  )
    throw new TypeError('Invalid text size');
  const bg = compositeColor(background, canvas),
    fg = compositeColor(foreground, bg),
    ratio = contrast(fg, bg);
  return Object.freeze({
    ratio,
    aa: ratio >= (options.text === 'large' ? 3 : 4.5),
    aaa: ratio >= (options.text === 'large' ? 4.5 : 7),
    foreground: fg,
    background: bg,
    suggestedForeground:
      contrast('#000000', bg) >= contrast('#FFFFFF', bg)
        ? '#000000'
        : '#FFFFFF',
  });
}
