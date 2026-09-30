import { colorNames } from './color-names';
import {
  normalizeHex,
  hexAlpha,
  opaqueHex,
  withAlpha,
  hexToRgb,
  hexToHsv,
  hsvToChannels,
  hexToOklch,
  formatColor,
  colorFormats,
  type ColorFormat,
  type HSV,
} from './color';
import { rgbToOklab, type OKLab, type OKLCH } from './oklab';

export interface ColorValues {
  readonly hex: string;
  readonly alpha: number;
  readonly rgb: Readonly<{ r: number; g: number; b: number; alpha: number }>;
  readonly hsl: Readonly<{ h: number; s: number; l: number; alpha: number }>;
  readonly hsv: Readonly<HSV & { alpha: number }>;
  /** L is 0–1; C and hue in degrees use native OKLCH units. */
  readonly oklch: Readonly<OKLCH & { alpha: number }>;
  readonly oklab: Readonly<OKLab & { alpha: number }>;
}
export interface ColorNameMatch {
  readonly name: string;
  readonly slug: string;
  readonly matchedHex: string;
  readonly exact: boolean;
}
export interface ColorInfo extends ColorValues, ColorNameMatch {
  /** Formatted channel strings; wrap hsl/oklch/etc in their CSS function when needed. HSV is not CSS. */
  readonly formats: Readonly<Record<ColorFormat, string>>;
}

// CIELAB D65, matching color-namer's default Euclidean Lab distance.
function lab(hex: string): readonly number[] {
  const [r, g, b] = hexToRgb(hex).map((n) => {
    const c = n / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const f = (t: number) =>
    t > 0.008856452 ? t ** (1 / 3) : t / 0.12841855 + 0.137931034;
  const x = f((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047);
  const y = f(0.2126729 * r + 0.7151522 * g + 0.072175 * b);
  const z = f((0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
let candidates:
  readonly { hex: string; name: string; lab: readonly number[] }[] | undefined;
const cache = new Map<string, ColorNameMatch>();
export function getColorNameMatch(input: string): ColorNameMatch {
  const hex = opaqueHex(input),
    cached = cache.get(hex);
  if (cached) return cached;
  candidates ??= colorNames.map(([hex, name]) => ({
    hex,
    name,
    lab: lab(hex),
  }));
  const value = lab(hex);
  let nearest = candidates[0],
    distance = Infinity;
  for (const candidate of candidates) {
    const d = value.reduce((sum, v, i) => sum + (v - candidate.lab[i]) ** 2, 0);
    if (d < distance) {
      nearest = candidate;
      distance = d;
    }
    if (distance === 0) break;
  }
  const result = Object.freeze({
    name: nearest.name,
    slug: nearest.name.replace(/['/]/g, '').replace(/\s+/g, '-').toLowerCase(),
    matchedHex: nearest.hex,
    exact: hex === nearest.hex,
  });
  if (cache.size >= 256) cache.delete(cache.keys().next().value!);
  cache.set(hex, result);
  return result;
}
export const getColorName = (hex: string): string =>
  getColorNameMatch(hex).name;

/** Numeric values are requested independently; requesting HEX never performs naming or Lab work. */
export function getColorValue<F extends ColorFormat>(
  input: string,
  format: F,
  alpha = hexAlpha(input),
): ColorValues[F] {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1)
    throw new TypeError('Alpha must be between 0 and 1');
  const hex = opaqueHex(input);
  let value: ColorValues[ColorFormat];
  switch (format) {
    case 'hex':
      value = withAlpha(hex, alpha);
      break;
    case 'rgb': {
      const [r, g, b] = hexToRgb(hex);
      value = Object.freeze({ r, g, b, alpha });
      break;
    }
    case 'hsv':
      value = Object.freeze({ ...hexToHsv(hex), alpha });
      break;
    case 'hsl': {
      const [h, s, l] = hsvToChannels(hexToHsv(hex))
        .replace(/%/g, '')
        .split(' ')
        .map(Number);
      value = Object.freeze({ h, s, l, alpha });
      break;
    }
    case 'oklch':
      value = Object.freeze({ ...hexToOklch(hex), alpha });
      break;
    case 'oklab':
      value = Object.freeze({ ...rgbToOklab(hexToRgb(hex)), alpha });
      break;
    default:
      throw new TypeError('Unknown color format');
  }
  return value as ColorValues[F];
}
export function getColor(hex: string, alpha = hexAlpha(hex)): ColorInfo {
  return Object.freeze({
    ...getColorNameMatch(hex),
    alpha,
    ...Object.fromEntries(
      colorFormats.map((format) => [format, getColorValue(hex, format, alpha)]),
    ),
    formats: Object.freeze(
      Object.fromEntries(
        colorFormats.map((format) => [format, formatColor(hex, format, alpha)]),
      ),
    ),
  }) as ColorInfo;
}
