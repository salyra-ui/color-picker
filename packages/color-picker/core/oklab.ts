/** Oklab matrices: https://bottosson.github.io/posts/oklab/ (D65, linear sRGB). */
export interface OKLab {
  l: number;
  a: number;
  b: number;
}
export interface OKLCH {
  l: number;
  c: number;
  h: number;
}
const linear = (c: number) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const gamma = (c: number) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
export function rgbToOklab(rgb: readonly number[]): OKLab {
  const [r, g, b] = rgb.map((c) => linear(c / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return {
    l: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}
export function oklabToOklch({ l, a, b }: OKLab): OKLCH {
  const c = Math.hypot(a, b);
  return {
    l,
    c,
    h: c < 1e-7 ? 0 : ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360,
  };
}
export function oklchToOklab({ l, c, h }: OKLCH): OKLab {
  return {
    l,
    a: c * Math.cos((h * Math.PI) / 180),
    b: c * Math.sin((h * Math.PI) / 180),
  };
}
function linearRgb({ l, a, b }: OKLab): number[] {
  const x = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    y = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    z = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
    -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
    -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z,
  ];
}
/** Map out-of-sRGB colors by reducing chroma, preserving lightness and hue. */
export function oklchToRgb(color: OKLCH): [number, number, number] {
  if (
    ![color.l, color.c, color.h].every(Number.isFinite) ||
    color.l < 0 ||
    color.l > 1 ||
    color.c < 0
  )
    throw new TypeError('Invalid OKLCH color');
  const inGamut = (rgb: number[]) =>
    rgb.every((c) => c >= -1 / 255 / 12.92 / 2 && c <= 1 + 1 / 255 / 12.92 / 2);
  let rgb = linearRgb(oklchToOklab(color));
  if (!inGamut(rgb)) {
    let low = 0,
      high = color.c;
    for (let i = 0; i < 24; i++) {
      const c = (low + high) / 2;
      if (inGamut(linearRgb(oklchToOklab({ ...color, c })))) low = c;
      else high = c;
    }
    rgb = linearRgb(oklchToOklab({ ...color, c: low }));
  }
  return rgb.map((c) =>
    Math.round(Math.max(0, Math.min(1, gamma(c))) * 255),
  ) as [number, number, number];
}
export function oklabToRgb(color: OKLab): [number, number, number] {
  return oklchToRgb(oklabToOklch(color));
}
