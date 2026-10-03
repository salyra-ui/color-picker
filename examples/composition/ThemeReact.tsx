import { ColorPicker } from '@salyra-ui/color-picker/react';
import {
  ThemeStudio,
  ThemeExport,
  ThemePalette,
  generateTheme,
} from '@salyra-ui/theme-studio/react';
const options = {
  theme: generateTheme('#5268E0'),
  mode: 'dark' as const,
  modeStorage: false as const,
  selection: {
    roles: ['primary', 'accent'] as const,
    radius: ['card'] as const,
    width: ['button'] as const,
  },
};
export default function ThemeExample() {
  return (
    <ThemeStudio.Root options={options}>
      <ThemeStudio.Scope>
        <ThemeStudio.PickerRoot roles={['primary', 'accent']}>
          <div className="composition-editor" data-composition="theme">
            <ThemeStudio.Wheel className="composition-wheel" />
            <div className="composition-fields">
              <div className="composition-roles">
                <ThemeStudio.RoleTrigger role="primary">
                  Brand color
                </ThemeStudio.RoleTrigger>
                <ThemeStudio.RoleTrigger role="accent">
                  Highlight
                </ThemeStudio.RoleTrigger>
              </div>
              <label>
                <span>Brightness</span>
                <ColorPicker.Slider channel="v" />
              </label>
              <label>
                <span>Active color</span>
                <ColorPicker.Input format="hex" />
              </label>
              <label>
                <span>Card corners in rem</span>
                <ThemeStudio.GeometryInput kind="radius" target="card" />
              </label>
              <label>
                <span>Button border in px</span>
                <ThemeStudio.GeometryInput kind="width" target="button" />
              </label>
              <ColorPicker.EyeDropper>
                Pick active color from screen
              </ColorPicker.EyeDropper>
              <article className="composition-preview">
                <h3>Live theme</h3>
                <button type="button">Continue</button>
              </article>
            </div>
          </div>
        </ThemeStudio.PickerRoot>
        <ThemePalette role="primary" shape="joined" />
        <details>
          <summary>Selected configuration</summary>
          <ThemeExport />
        </details>
      </ThemeStudio.Scope>
    </ThemeStudio.Root>
  );
}
