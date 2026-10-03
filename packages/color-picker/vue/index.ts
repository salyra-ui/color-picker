export * from '../core';
export { default as ColorProvider } from './ColorProvider.vue';
export { default as ColorArea } from './ColorArea.vue';
export { default as ColorSlider } from './ColorSlider.vue';
export { default as ColorInput } from './ColorInput.vue';
export { default as ColorSwatch } from './ColorSwatch.vue';
export { default as ColorPreview } from './ColorPreview.vue';
export * from './context';
export { default as ColorCollection } from './ColorCollection.vue';
export { default as ColorMode } from './ColorMode.vue';
export { default as ColorFormatSelect } from './ColorFormatSelect.vue';

export { default as ColorTextInput } from './ColorTextInput.vue';
export { default as ColorChannelInput } from './ColorChannelInput.vue';

export { default as ColorWheel } from './ColorWheel.vue';

export { default as ColorSurface } from './ColorSurface.vue';
export { default as ColorViewSelect } from './ColorViewSelect.vue';

export { default as ColorAlphaInput } from './ColorAlphaInput.vue';

import ColorRoot from './ColorRoot.vue';
export { ColorRoot };

import ColorPlane from './ColorPlane.vue';
export { ColorPlane };

import ColorWheelSurface from './ColorWheelSurface.vue';
export { ColorWheelSurface };

import ColorThumb from './ColorThumb.vue';
export { ColorThumb };

import ColorMarkerThumb from './ColorMarkerThumb.vue';
export { ColorMarkerThumb };

import ColorRange from './ColorRange.vue';
export { ColorRange };

import ColorField from './ColorField.vue';
export { ColorField };

import ColorFormatTrigger from './ColorFormatTrigger.vue';
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
