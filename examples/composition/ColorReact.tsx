import { useState } from 'react';
import { ColorPicker } from '@salyra-ui/color-picker/react';
export default function ColorExample() {
  const [value, setValue] = useState('#5268E080');
  return (
    <ColorPicker.Root value={value} onValueChange={setValue}>
      <div className="composition-editor" data-composition="color">
        <ColorPicker.Wheel className="composition-wheel">
          <ColorPicker.Thumb className="composition-dot">
            <span className="composition-dot-text">Pick</span>
          </ColorPicker.Thumb>
        </ColorPicker.Wheel>
        <div className="composition-fields">
          <label>
            <span>Brightness</span>
            <ColorPicker.Slider channel="v" />
          </label>
          <label>
            <span>Opacity</span>
            <ColorPicker.Slider channel="alpha" />
          </label>
          <div className="composition-channels">
            {(['Red', 'Green', 'Blue'] as const).map((label, index) => (
              <label key={label}>
                <span>{label}</span>
                <ColorPicker.ChannelInput
                  format="rgb"
                  index={index as 0 | 1 | 2}
                />
              </label>
            ))}
          </div>
          <label>
            <span>Color value</span>
            <ColorPicker.Input />
          </label>
          <ColorPicker.FormatTrigger
            render={(color) =>
              `Show next format (${color.format.toUpperCase()})`
            }
          />
          <ColorPicker.EyeDropper>Pick from screen</ColorPicker.EyeDropper>
          <output>{value}</output>
        </div>
      </div>
    </ColorPicker.Root>
  );
}
