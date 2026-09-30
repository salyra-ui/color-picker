import {
  rgbToOklab,
  oklabToOklch,
  oklabToRgb,
  oklchToRgb,
  type OKLCH,
} from './oklab';
export interface HSV {
  h: number;
  s: number;
  v: number;
}
export const clamp = (n: number, min = 0, max = 100) =>
  Math.min(max, Math.max(min, Number.isFinite(n) ? n : min));
export const hue = (h: number) =>
  (((Number.isFinite(h) ? h : 0) % 360) + 360) % 360;
export function normalizeHex(input: string): string {
  if (
    typeof input !== 'string' ||
    !/^#?(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(input.trim())
  )
    throw new TypeError('Expected a 3 or 6 digit hex color');
  let value = input.trim().replace('#', '').toUpperCase();
  if (value.length === 3) value = value.replace(/./g, '$&$&');
  return `#${value}`;
}
/** RGBA hex input; alpha is last, matching CSS #RGBA/#RRGGBBAA. */
export function normalizeColorHex(input: string): string {
  if (
    typeof input !== 'string' ||
    !/^#?(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(input.trim())
  )
    throw new TypeError('Expected a 3, 4, 6 or 8 digit hex color');
  let value = input.trim().replace('#', '').toUpperCase();
  if (value.length === 3 || value.length === 4)
    value = value.replace(/./g, '$&$&');
  if (value.length === 8 && value.endsWith('FF')) value = value.slice(0, 6);
  return '#' + value;
}
export const opaqueHex = (input: string): string =>
  normalizeColorHex(input).slice(0, 7);
export function hexAlpha(input: string): number {
  const hex = normalizeColorHex(input);
  return hex.length === 9 ? parseInt(hex.slice(7), 16) / 255 : 1;
}
export function withAlpha(input: string, alpha: number): string {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
    throw new TypeError('Alpha must be between 0 and 1');
  const hex = opaqueHex(input);
  return alpha === 1
    ? hex
    : hex +
        Math.round(alpha * 255)
          .toString(16)
          .padStart(2, '0')
          .toUpperCase();
}
export function hexToRgb(input: string): [number, number, number] {
  const hex = opaqueHex(input).slice(1);
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
}
export function hsvToHex({ h, s, v }: HSV): string {
  h = hue(h) / 60;
  s = clamp(s) / 100;
  v = clamp(v) / 100;
  const c = v * s,
    x = c * (1 - Math.abs((h % 2) - 1)),
    m = v - c;
  const rgb =
    h < 1
      ? [c, x, 0]
      : h < 2
        ? [x, c, 0]
        : h < 3
          ? [0, c, x]
          : h < 4
            ? [0, x, c]
            : h < 5
              ? [x, 0, c]
              : [c, 0, x];
  return (
    '#' +
    rgb
      .map((n) =>
        Math.round((n + m) * 255)
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
      .toUpperCase()
  );
}
export function hexToHsv(input: string, previousHue = 0): HSV {
  const [r, g, b] = hexToRgb(input).map((n) => n / 255);
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min;
  const h =
    d === 0
      ? previousHue
      : 60 *
        (max === r
          ? (g - b) / d
          : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4);
  return { h: hue(h), s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}
export function hsvToChannels({ h, s, v }: HSV): string {
  s = clamp(s) / 100;
  v = clamp(v) / 100;
  const l = v * (1 - s / 2),
    saturation = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
  const round = (n: number) => Math.round(n * 1000) / 1000;
  return `${round(hue(h))} ${round(saturation * 100)}% ${round(l * 100)}%`;
}
export function channelsToHex(channels: string): string {
  const [h, s, l] = channels.replace(/%/g, '').split(/\s+/).map(Number);
  const light = clamp(l) / 100,
    sat = clamp(s) / 100,
    v = light + sat * Math.min(light, 1 - light);
  return hsvToHex({ h, s: v === 0 ? 0 : 200 * (1 - light / v), v: v * 100 });
}
export function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export function foreground(hex: string): string {
  return contrast(hex, '#FFFFFF') >= contrast(hex, '#000000')
    ? '0 0% 100%'
    : '0 0% 0%';
}
/** Constant work and memory regardless of picker size. */
export function colorAtPoint(
  h: number,
  x: number,
  y: number,
  width: number,
  height: number,
): HSV {
  return {
    h: hue(h),
    s: clamp(width > 0 ? (x / width) * 100 : 0),
    v: 100 - clamp(height > 0 ? (y / height) * 100 : 0),
  };
}

export const colorFormats = [
  'hex',
  'rgb',
  'hsl',
  'hsv',
  'oklch',
  'oklab',
] as const;
export type ColorFormat = (typeof colorFormats)[number];
export function hexToOklch(hex: string): OKLCH {
  return oklabToOklch(rgbToOklab(hexToRgb(hex)));
}
export function oklchToHex(color: OKLCH): string {
  return rgbToHex(oklchToRgb(color));
}
export function rgbToHex(rgb: readonly [number, number, number]): string {
  if (rgb.some((n) => !Number.isFinite(n) || n < 0 || n > 255))
    throw new TypeError('RGB channels must be between 0 and 255');
  return (
    '#' +
    rgb
      .map((n) => Math.round(n).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}
export function parseColor(text: string, format: ColorFormat = 'hex'): string {
  if (format === 'hex') return normalizeColorHex(text);
  const raw = text
    .trim()
    .replace(new RegExp(`^${format}(?:a)?\\((.*)\\)$`, 'i'), '$1')
    .replace(/\s*,\s*/g, ' ');
  const parts = raw.replace(/\s*\/\s*/g, ' ').split(/\s+/);
  if (parts.length !== 3 && parts.length !== 4)
    throw new TypeError('Expected three color channels and optional alpha');
  let alpha = 1;
  if (parts.length === 4) {
    const part = parts.pop()!;
    if (!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(part))
      throw new TypeError('Invalid alpha');
    alpha = Number(part.replace('%', '')) / (part.endsWith('%') ? 100 : 1);
    if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
      throw new TypeError('Alpha must be between 0 and 1');
  }
  return withAlpha(parseOpaqueColor(parts.join(' '), format), alpha);
}
function parseOpaqueColor(text: string, format: ColorFormat): string {
  const raw = text
    .trim()
    .replace(new RegExp(`^${format}\\((.*)\\)$`), '$1')
    .replace(/\s*,\s*/g, ' ');
  const parts = raw.split(/\s+/);
  if (
    parts.length !== 3 ||
    parts.some((p) => !/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)%?$/.test(p))
  )
    throw new TypeError('Expected three color channels');
  const values = parts.map((p) => Number(p.replace('%', '')));
  if (format === 'rgb') {
    if (parts.some((p) => p.endsWith('%')))
      throw new TypeError('RGB input uses 0–255 channels');
    return rgbToHex(values as [number, number, number]);
  }
  if (format === 'oklch' || format === 'oklab') {
    const [rawL, a, b] = values,
      l = parts[0].endsWith('%') ? rawL / 100 : rawL;
    if (
      l < 0 ||
      l > 1 ||
      parts[1].endsWith('%') ||
      parts[2].endsWith('%') ||
      Math.abs(a) > 1 ||
      Math.abs(b) > (format === 'oklab' ? 1 : 360)
    )
      throw new TypeError('Perceptual color channel out of range');
    return rgbToHex(
      format === 'oklch'
        ? oklchToRgb({ l, c: a, h: b })
        : oklabToRgb({ l, a, b }),
    );
  }
  const [h, s, last] = values;
  if (
    h < 0 ||
    h > 360 ||
    s < 0 ||
    s > 100 ||
    last < 0 ||
    last > 100 ||
    parts[0].endsWith('%')
  )
    throw new TypeError('Color channel out of range');
  return format === 'hsv'
    ? hsvToHex({ h, s, v: last })
    : channelsToHex(`${h} ${s}% ${last}%`);
}
export function formatColor(
  input: string,
  format: ColorFormat = 'hex',
  alpha = hexAlpha(input),
): string {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
    throw new TypeError('Alpha must be between 0 and 1');
  if (format === 'hex') return withAlpha(input, alpha);
  const value = formatOpaqueColor(opaqueHex(input), format);
  return alpha === 1 ? value : `${value} / ${Number(alpha.toFixed(8))}`;
}
function formatOpaqueColor(hex: string, format: ColorFormat): string {
  const round = (n: number) => Number(n.toFixed(5));
  if (format === 'hex') return normalizeHex(hex);
  if (format === 'rgb') return hexToRgb(hex).join(', ');
  if (format === 'hsl') return hsvToChannels(hexToHsv(hex));
  if (format === 'hsv') {
    const { h, s, v } = hexToHsv(hex);
    return `${round(h)} ${round(s)}% ${round(v)}%`;
  }
  const lab = rgbToOklab(hexToRgb(hex));
  if (format === 'oklab')
    return `${round(lab.l)} ${round(lab.a)} ${round(lab.b)}`;
  const lch = oklabToOklch(lab);
  return `${round(lch.l)} ${round(lch.c)} ${round(lch.h)}`;
}
