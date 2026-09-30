import type { Kit } from './snippets';
const code = (s: string) => `<code>${s}</code>`;
export function referenceTable(kit: Kit) {
  const rows: string[][] =
    kit === 'color-picker'
      ? [
          [
            'ColorProvider',
            'Shares one color store with its children.',
            'value: HEX string · store: ColorStore · view: area | wheel',
            'Create separate providers for independent colors. Provide a store to choose the initial format.',
          ],
          [
            'ColorArea / ColorWheel',
            'Area edits saturation/brightness; wheel edits hue/saturation.',
            'classes · thumbText · label',
            'Use a hue slider with the area and a brightness slider with the wheel. Both support pointer and keyboard input.',
          ],
          [
            'ColorSlider',
            'Edits one channel without replacing the other channels.',
            'channel: h | s | v | alpha · label',
            'Hue uses degrees. Saturation, brightness and the alpha control use percentages.',
          ],
          [
            'ColorInput',
            'Shows the fields for the currently selected format.',
            'className / class · classes',
            'HEX has one text input. RGB, HSL, HSV, OKLCH and OKLab have separate numeric fields.',
          ],
          [
            'ColorChannelInput',
            'Renders one specific numeric field.',
            'format: rgb | hsl | hsv | oklch | oklab · index: 0 | 1 | 2',
            'Useful for a fixed-format layout that does not follow the format selector.',
          ],
          [
            'ColorAlphaInput',
            'Edits transparency as a percentage.',
            'label · classes',
            'The store uses alpha from 0 to 1; the UI displays 0 to 100.',
          ],
          [
            'ColorFormatSelect / ColorMode',
            'Selects a format or cycles through the six formats.',
            'ColorFormatSelect: label',
            'Changing format changes the fields and output representation; it does not change the selected color.',
          ],
          [
            'ColorViewSelect / ColorSurface',
            'Switches between area and wheel in one composition.',
            'Provider view: area | wheel',
            'ColorSurface follows the store view. Include the appropriate channel sliders in your composition.',
          ],
          [
            'createColorStore(value, format, view)',
            'Creates the framework-independent color state.',
            'Defaults: #6366F1, hex, area',
            'getColor() returns names and all formats. getValue(format) returns typed channel data. subscribe(listener) returns an unsubscribe function.',
          ],
          [
            'mountColorPicker(element, options)',
            'Mounts a complete Vanilla layout.',
            'value · format · view · className · onChange',
            'Returns store, getColor(), getValue(format) and destroy(). Call destroy() when removing the picker.',
          ],
        ]
      : [
          [
            'ThemeProvider',
            'Scopes the theme store and CSS variables to its children.',
            'theme · fallbackTheme · loadTheme · mode · systemMode · storage · modeStorage',
            'React accepts options as props. Svelte, Vue and Angular accept an options object. Astro uses serializable props and src for a client request.',
          ],
          [
            'ThemePicker',
            'Edits the selected roles using one active color store.',
            'view: area | wheel | shared-wheel · roles · activeRole',
            'roles contains primary, secondary and/or accent. A shared wheel with one role shows an anonymous dot.',
          ],
          [
            'ThemeGenerator',
            'Connects a color-picker composition to one theme role.',
            'role: primary | secondary | accent · custom children',
            'Place ColorArea, ColorSlider and ColorInput inside it. Angular custom content requires [custom]="true".',
          ],
          [
            'ThemeHarmony',
            'Generates secondary and accent from primary.',
            'label · store.setHarmony() · store.generateHarmony()',
            'Supported harmonies: analogous, triadic and split-complementary. Manual role editing remains available afterward.',
          ],
          [
            'ThemeBackground',
            'Controls whether surfaces use a tint from primary.',
            'label · store.setBackground(neutral | tinted)',
            'Tinting is optional. It changes generated light and dark backgrounds.',
          ],
          [
            'ThemeRadius / ThemeBorderWidth',
            'Edits a geometry token for one target.',
            'target: DEFAULT | input | card | popover | button | table | picker',
            'Radius is measured in rem; border width in px. Export selections can include either independently.',
          ],
          [
            'ThemeMode / useThemeMode()',
            'Controls the saved appearance preference.',
            'value: system | light | dark · custom content',
            'Default persistence key: theme-kit:mode. Pass modeStorage: false to disable it or browserModeStorage(key) to use your own key.',
          ],
          [
            'ThemeName / ThemeSelect',
            'Edits a custom name or applies a preset theme.',
            'ThemeName: label · ThemeSelect: themes: Theme[]',
            'Custom names survive subsequent color edits. store.setName() restores a suggested name.',
          ],
          [
            'ThemeLoading / ThemeReady / ThemeError',
            'Renders content based on loading and failure state.',
            'Custom children · ThemeError retry callback',
            'ThemeReady also displays fallback content. A failure can display both the fallback theme and an error/retry control.',
          ],
          [
            'ThemeExport / themeConfiguration()',
            'Reads JSON, CSS, tokens and the current theme.',
            'format: json | css · selection: roles, radius, width, background',
            'CSS selection does not remove data from the full theme JSON. config.css contains declarations; wrap them in a selector for a CSS file.',
          ],
          [
            'createThemeStore(options)',
            'Creates the state without mounting a UI.',
            'timeoutMs: 10000 by default · revalidateOnFocus · revalidateIntervalMs',
            'start()/reload() run the loader. stop() cancels pending work. Framework providers mount the lifecycle automatically.',
          ],
          [
            'mountThemeKit(element, options)',
            'Mounts the complete Vanilla theme editor.',
            'ThemeOptions + themes · picker · onChange',
            'Returns store, getConfiguration(selection) and destroy(). Nested editors can share an existing store.',
          ],
        ];
  return `<table class="api-table"><thead><tr><th>Component / helper</th><th>Usage</th></tr></thead><tbody>${rows.map(([name, purpose, props, note]) => `<tr><td>${code(name)}</td><td><p>${purpose}</p><p>${code(props.replaceAll('<', '&lt;').replaceAll('>', '&gt;'))}</p><small>${note}</small></td></tr>`).join('')}</tbody></table>`;
}
