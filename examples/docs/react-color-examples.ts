import type { ColorVariant, CustomSettings } from './snippets';
export function reactColorExample(
  variant: ColorVariant,
  settings: CustomSettings,
  customCss: string,
) {
  const custom = variant === 'custom';
  const wheel = variant === 'wheel';
  const surface = wheel ? 'Wheel' : 'Area';
  const layout = `.picker-parts { display: grid; gap: 16px; width: 100%; max-width: 360px; }
.picker-parts label { display: grid; gap: 8px; min-width: 0; }
.picker-parts .channel-fields { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.picker-parts input, .picker-parts select, .picker-parts button { box-sizing: border-box; width: 100%; min-width: 0; font: inherit; }
.picker-parts input:not([type="range"]), .picker-parts select, .picker-parts button { min-height: 40px; padding: 8px 12px; border: 1px solid #d8d8df; border-radius: 4px; background: transparent; color: inherit; }
.picker-parts input[type="range"] { accent-color: #e4002b; }
.picker-parts :disabled { opacity: .45; cursor: default; }`;
  return `import { useEffect, useRef, useState } from 'react';
import { ColorPicker as Color, createColorStore, useColor, useColorStore, channelSpecs, colorFormats, bindAlphaInput } from '@salyra-ui/color-picker/react';
import '@salyra-ui/color-picker/styles.min.css';

function AlphaField() {
  const store = useColorStore();
  const state = useColor();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => bindAlphaInput(input.current!, store), [store]);
  return <input ref={input} type="number" min="0" max="100" step="0.1"
    defaultValue={Number((state.alpha * 100).toFixed(1))} disabled={state.disabled} />;
}

function Fields() {
  const state = useColor();
  const store = useColorStore();
  const format = state.format;
  return <>
    <label>Format<select value={format} disabled={state.disabled}
      onChange={event => store.setFormat(event.currentTarget.value as typeof format)}>
      {colorFormats.map(value => <option key={value} value={value}>{value.toUpperCase()}</option>)}
    </select></label>
    {format === 'hex' ? <label>HEX<Color.Input format="hex" /></label> :
      <div className="channel-fields">
        {([0, 1, 2] as const).map(index => <label key={format + index}>
          {channelSpecs[format][index].label}
          <Color.ChannelInput format={format} index={index} />
        </label>)}
      </div>}
    <label>Alpha %<AlphaField /></label>
    <Color.FormatTrigger${custom ? ' render={state => <span>Change {state.format.toUpperCase()} format</span>}' : '>Switch format</Color.FormatTrigger>'}${custom ? ' />' : ''}
  </>;
}

export function Picker() {
  const [store] = useState(() => createColorStore('#5268E080', '${variant === 'channels' ? 'rgb' : 'hex'}'));
  return <Color.Root store={store}${variant === 'disabled' ? ' disabled' : ''} onValueChange={() => {
    const color = store.getColor();
    console.log(color.name, color.hex, color.hsl, color.formats);
  }}>
    <div className="picker-parts${custom ? ' custom-picker' : ''}">
      ${
        variant === 'channels'
          ? ''
          : `<Color.${surface} className="${wheel ? 'cp-wheel' : 'cp-area'}">
        <Color.Thumb className="cp-thumb">${custom ? `<span data-cp-part="thumb-text">{${JSON.stringify(settings.text)}}</span>` : ''}</Color.Thumb>
      </Color.${surface}>
      <label className="cp-slider" data-channel="${wheel ? 'v' : 'h'}">${wheel ? 'Brightness' : 'Hue'}<Color.Slider channel="${wheel ? 'v' : 'h'}" /></label>`
      }
      <label className="cp-slider" data-channel="alpha">Opacity<Color.Slider channel="alpha" /></label>
      <Fields />
    </div>
  </Color.Root>;
}
/* Add to your stylesheet: */
${layout}${custom ? '\n' + customCss : ''}`;
}
