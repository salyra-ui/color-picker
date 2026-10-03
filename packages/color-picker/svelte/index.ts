export * from '../core';
export { default as ColorProvider } from './ColorProvider.svelte';
export { default as ColorArea } from './ColorArea.svelte';
export { default as ColorSlider } from './ColorSlider.svelte';
export { default as ColorInput } from './ColorInput.svelte';
export { default as ColorSwatch } from './ColorSwatch.svelte';
export { default as ColorPreview } from './ColorPreview.svelte';
export * from './context';
export { default as ColorCollection } from './ColorCollection.svelte';
export { default as ColorMode } from './ColorMode.svelte';
export { default as ColorFormatSelect } from './ColorFormatSelect.svelte';

export { default as ColorTextInput } from './ColorTextInput.svelte';
export { default as ColorChannelInput } from './ColorChannelInput.svelte';

export { default as ColorWheel } from './ColorWheel.svelte';

export { default as ColorSurface } from './ColorSurface.svelte';
export { default as ColorViewSelect } from './ColorViewSelect.svelte';

export { default as ColorAlphaInput } from './ColorAlphaInput.svelte';

import ColorRoot from './ColorRoot.svelte';
export { ColorRoot };

import ColorPlane from './ColorPlane.svelte';
export { ColorPlane };

import ColorWheelSurface from './ColorWheelSurface.svelte';
export { ColorWheelSurface };

import ColorThumb from './ColorThumb.svelte';
export { ColorThumb };

import ColorMarkerThumb from './ColorMarkerThumb.svelte';
export { ColorMarkerThumb };

import ColorRange from './ColorRange.svelte';
export { ColorRange };

import ColorField from './ColorField.svelte';
export { ColorField };

import ColorFormatTrigger from './ColorFormatTrigger.svelte';
export { ColorFormatTrigger };

export const ColorPicker = {
  Root: ColorRoot,
  Area: ColorPlane,
  Wheel: ColorWheelSurface,
  Thumb: ColorThumb,
  Marker: ColorMarkerThumb,
  Slider: ColorRange,
  Input: ColorField,
  ChannelInput: ColorField,
  FormatTrigger: ColorFormatTrigger,
};
