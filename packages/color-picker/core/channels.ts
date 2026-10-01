import {
  hexToHsv,
  hexToRgb,
  hsvToChannels,
  rgbToHex,
  hexToOklch,
  oklchToHex,
  type ColorFormat,
} from './color';
import { rgbToOklab, oklabToRgb } from './oklab';
import type { ColorStore, ColorSnapshot } from './picker';
export type ChannelIndex = 0 | 1 | 2;
export type ChannelFormat = Exclude<ColorFormat, 'hex'>;
export interface ChannelSpec {
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}
const spec = (
  label: string,
  min: number,
  max: number,
  step = 1,
  unit = '',
): ChannelSpec => ({ label, min, max, step, unit });
export const channelSpecs: Record<
  ChannelFormat,
  readonly [ChannelSpec, ChannelSpec, ChannelSpec]
> = {
  rgb: [spec('R', 0, 255), spec('G', 0, 255), spec('B', 0, 255)],
  hsl: [
    spec('H', 0, 360, 1, '°'),
    spec('S', 0, 100, 0.1, '%'),
    spec('L', 0, 100, 0.1, '%'),
  ],
  hsv: [
    spec('H', 0, 360, 1, '°'),
    spec('S', 0, 100, 0.1, '%'),
    spec('V', 0, 100, 0.1, '%'),
  ],
  oklch: [
    spec('L', 0, 100, 0.1, '%'),
    spec('C', 0, 0.4, 0.001),
    spec('H', 0, 360, 1, '°'),
  ],
  oklab: [
    spec('L', 0, 100, 0.1, '%'),
    spec('a', -0.4, 0.4, 0.001),
    spec('b', -0.4, 0.4, 0.001),
  ],
};
export function getColorChannels(
  state: ColorSnapshot,
  format: ChannelFormat,
): [number, number, number] {
  if (format === 'rgb') return hexToRgb(state.hex);
  if (format === 'hsl')
    return hsvToChannels(state).replace(/%/g, '').split(' ').map(Number) as [
      number,
      number,
      number,
    ];
  if (format === 'hsv') return [state.h, state.s, state.v];
  if (format === 'oklch') {
    const c = hexToOklch(state.hex);
    return [c.l * 100, c.c, c.h];
  }
  const c = rgbToOklab(hexToRgb(state.hex));
  return [c.l * 100, c.a, c.b];
}
export function channelValue(
  state: ColorSnapshot,
  format: ChannelFormat,
  index: ChannelIndex,
): string {
  const step = channelSpecs[format][index].step;
  // Display precision follows the native input step without rounding the stored color.
  const decimals = String(step).split('.')[1]?.length ?? 0;
  return String(
    Number(getColorChannels(state, format)[index].toFixed(decimals)),
  );
}
export function setColorChannel(
  store: ColorStore,
  format: ChannelFormat,
  index: ChannelIndex,
  value: number,
): void {
  const spec = channelSpecs[format][index];
  if (!Number.isFinite(value) || value < spec.min || value > spec.max)
    throw new TypeError(
      `${spec.label} must be between ${spec.min} and ${spec.max}`,
    );
  const values = getColorChannels(store.getSnapshot(), format);
  values[index] = value;
  const [a, b, c] = values;
  if (format === 'rgb') {
    store.setHSV(hexToHsv(rgbToHex(values)));
    return;
  }
  if (format === 'hsv') {
    store.setHSV({ h: a, s: b, v: c });
    return;
  }
  if (format === 'hsl') {
    const l = c / 100,
      s = b / 100,
      v = l + s * Math.min(l, 1 - l);
    store.setHSV({ h: a, s: v === 0 ? 0 : 200 * (1 - l / v), v: v * 100 });
    return;
  }
  store.setHSV(
    hexToHsv(
      format === 'oklch'
        ? oklchToHex({ l: a / 100, c: b, h: c })
        : rgbToHex(oklabToRgb({ l: a / 100, a: b, b: c })),
    ),
  );
}
