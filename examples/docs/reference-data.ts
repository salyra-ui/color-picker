import type { Kit } from './snippets';
export interface ApiField {
  key: string;
  type: string;
  default: string;
  description: string;
  example: string;
  required?: boolean;
}
export interface ApiEntry {
  id: string;
  name: string;
  kind: 'Component' | 'Options' | 'Methods' | 'Return value' | 'Function' | 'Styling';
  description: string;
  note?: string;
  fields: ApiField[];
  example: { file: string; code: string };
}
const f = (key: string, type: string, fallback: string, description: string, example: string, required = false): ApiField => ({ key, type, default: fallback, description, example, required });
const formats = "'hex' | 'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'";
const role = "'primary' | 'secondary' | 'accent'";
const target = "'DEFAULT' | 'input' | 'card' | 'popover' | 'button' | 'table' | 'picker'";
const modes = "'system' | 'light' | 'dark'";
const harmony = "'analogous' | 'triadic' | 'split-complementary'";
const shades = '50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950';
const classField = f('className', 'string', "''", 'Adds a CSS class to the component root. The existing component class stays in place.', 'className="brand-picker"');
const classesField = f('classes', 'ColorPartClasses', '{}', 'Assigns classes to individual parts. See ColorPartClasses below for the supported keys.', "classes={{ root: 'brand-area', thumb: 'brand-dot', text: 'dot-label' }}");
const themeClass = f('className', 'string', "''", 'Adds your CSS class to the root element.', 'className="brand-theme"');
const disabled = f('disabled', 'boolean', 'false', 'Blocks pointer, keyboard and form editing. Values stay visible and programmatic store updates remain available.', 'disabled={true}');
const paletteRole = f('role', role, "'primary'", 'Chooses the theme palette this component reads or edits. Primary is the main color, secondary is the supporting color and accent is the emphasis color.', 'role="accent"');
const react = (kit: Kit, imports: string[], markup: string): ApiEntry['example'] => ({
  file: 'Usage.tsx',
  code: `import { ${[kit === 'color-picker' ? 'ColorProvider' : 'ThemeProvider', ...(kit === 'theme-studio' ? ['generateTheme'] : []), ...imports].filter((v, i, all) => all.indexOf(v) === i).join(', ')} } from '@salyra-ui/${kit}/react';\nimport '@salyra-ui/${kit}/styles.min.css';\n\nexport function Example() {\n  return ${kit === 'color-picker' ? '<ColorProvider value="#5268E0">' : '<ThemeProvider theme={generateTheme("#5268E0")} modeStorage={false}>'}\n    ${markup}\n  </${kit === 'color-picker' ? 'ColorProvider' : 'ThemeProvider'}>;\n}`,
});
const core = (kit: Kit, imports: string[], body: string): ApiEntry['example'] => ({ file: 'usage.ts', code: `import { ${imports.join(', ')} } from '@salyra-ui/${kit}';\n\n${body}` });
const entry = (name: string, kind: ApiEntry['kind'], description: string, fields: ApiField[], example: ApiEntry['example'], note?: string): ApiEntry => ({ id: name === 'ThemeConfiguration' ? 'theme-configuration' : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''), name, kind, description, fields, example, note });
const colorEntries: ApiEntry[] = [
  entry('ColorProvider', 'Component', 'Shares one selected color with its surfaces, sliders, inputs and format controls.', [
    f('value', 'HEX string', "'#6366F1'", 'Sets the initial color. React also applies subsequent value changes. Accepts short or full hex, with optional alpha.', 'value="#5268E080"'),
    f('store', 'ColorStore', 'Created internally', 'Uses an existing store instead of creating one. Supply it when several consumers must share state or you need a starting format other than hex.', "store={createColorStore('#5268E0', 'hsl')}"),
    f('view', "'area' | 'wheel'", "'area'", 'Sets the initial surface for a new store. area shows a rectangle and wheel shows a circle. With a supplied store, its own view is used.', 'view="wheel"'),
    { ...disabled, default: 'false for a new store', description: `${disabled.description} Omitting this property preserves the state of a supplied store.` },
    f('onChange', '(hex: string) => void', 'No callback', 'Receives RGBA hex after an actual color change. Format and view changes do not call it. It does not emit the initial value.', 'onChange={(hex) => console.log(hex)}'),
    f('children', 'ReactNode', 'None', 'The controls that share this color context. A nested ColorProvider creates an independent context.', '<ColorProvider><ColorArea /></ColorProvider>', true),
  ], react('color-picker', ['ColorWheel', 'ColorSlider', 'ColorInput'], '<ColorWheel /><ColorSlider channel="v" /><ColorSlider channel="alpha" /><ColorInput />'), 'Use useColorStore() and useColor() inside a child of the provider. Svelte and Vue expose reactive store reads. Vanilla uses cp-provider.setStore(store) and the color-change DOM event.'),
  entry('ColorArea', 'Component', 'A rectangle that edits saturation horizontally and brightness vertically. Hue and alpha stay unchanged.', [
    classField, classesField,
    f('label', 'string', "'Saturation and brightness'", 'Names the surface for assistive technology. Current saturation and brightness are appended to this label.', 'label="Brand color"'),
    f('style', 'React.CSSProperties', '{}', 'Overrides root dimensions or adds CSS variables. In Svelte and Astro, style is a CSS string.', 'style={{ minHeight: 200 }}'),
    f('thumbText', 'ReactNode', 'No text', 'Renders content inside the single selection dot. Svelte and Astro accept a string. Vue also supports its thumb slot.', 'thumbText="C"'),
    f('renderThumb', '(state: ColorSnapshot) => ReactNode', 'Uses thumbText', 'React render callback for dynamic dot content. Svelte uses a thumb snippet and Vue uses a thumb slot.', 'renderThumb={(state) => Math.round(state.s)}'),
  ], react('color-picker', ['ColorArea', 'ColorSlider'], '<ColorArea thumbText="C" classes={{ thumb: "brand-dot" }} /><ColorSlider channel="h" />')),
  entry('ColorWheel', 'Component', 'A circle that edits hue by angle and saturation by distance from the center. Pair it with a brightness slider.', [
    classField, classesField,
    f('label', 'string', "'Hue and saturation wheel'", 'Accessible name for the picking surface.', 'label="Choose a color"'),
    f('style', 'React.CSSProperties', '{}', 'Adds root styling and CSS variables. It does not change color calculations.', 'style={{ maxWidth: 280 }}'),
    f('thumbText', 'ReactNode', 'No text', 'Content inside the single color dot. It is used when markers is omitted.', 'thumbText="C"'),
    f('markers', 'readonly ColorMarker[]', 'One store-controlled dot', 'Enables multiple independently controlled markers. Each marker needs a unique id and a color. This is a generic color-picker capability, with no theme roles built in.', 'markers={[{ id: "brand", color: { h: 220, s: 60, v: 80, hex: "#527ACC" }, label: "B" }]}'),
    f('activeId', 'string', 'First marker for keyboard editing', 'Identifies the active marker. Pass this explicitly to keep visual selection and keyboard editing in sync.', 'activeId="brand"'),
    f('onSelect', '(id: string) => void', 'No callback', 'Receives the clicked marker id. Update your activeId in response. Selecting a marker does not move it.', 'onSelect={(id) => setActiveId(id)}'),
    f('onMarkerChange', '(id: string, hsv: Partial<HSV>) => void', 'No callback', 'Receives marker edits from a drag or keyboard action. Update that marker in your state.', 'onMarkerChange={(id, hsv) => updateMarker(id, hsv)}'),
    f('renderMarker', '(marker: ColorMarker, active: boolean) => ReactNode', 'Uses marker.label', 'Replaces marker text in React. Svelte uses a marker snippet and Vue a marker slot. A single marker has a small dot by default.', 'renderMarker={(marker) => marker.label}'),
  ], react('color-picker', ['ColorWheel', 'ColorSlider'], '<ColorWheel thumbText="C" /><ColorSlider channel="v" /><ColorSlider channel="alpha" />')),
  entry('ColorSlider', 'Component', 'Edits one HSV or alpha channel while keeping the other channels.', [
    f('channel', "'h' | 's' | 'v' | 'alpha'", "'h'", 'h edits hue from 0 to 359 degrees. s edits saturation, v edits brightness and alpha edits opacity, each from 0 to 100 in the UI.', 'channel="alpha"'),
    f('label', 'string', 'Hue / Saturation / Brightness / Alpha', 'Replaces the visible and accessible label for the selected channel.', 'label="Opacity"'), classField, classesField,
  ], react('color-picker', ['ColorSlider'], '<ColorSlider channel="alpha" label="Opacity" classes={{ track: "opacity-track" }} />')),
  entry('ColorInput', 'Component', 'Displays one HEX field or three separate numeric channel fields for the selected format.', [
    f('format', formats, 'Current store format', 'Locks this input to one format. Omit it to follow ColorFormatSelect or ColorMode. Does not change the store format.', 'format="rgb"'),
    f('label', 'string', 'Uppercase format name', 'Labels the HEX input or the numeric field group. Individual numeric labels remain R/G/B, H/S/L and the corresponding channel names.', 'label="Brand RGB"'), classField, classesField,
  ], react('color-picker', ['ColorInput', 'ColorFormatSelect'], '<ColorFormatSelect /><ColorInput /><ColorInput format="rgb" label="Fixed RGB fields" />')),
  entry('ColorChannelInput', 'Component', 'Displays one numeric channel from a fixed format. Alpha has its own component.', [
    f('format', "'rgb' | 'hsl' | 'hsv' | 'oklch' | 'oklab'", 'None', 'Selects the channel model. HEX is excluded because it has no separate numeric channels. See Channel values for index mappings and ranges.', 'format="hsl"', true),
    f('index', '0 | 1 | 2', 'None', 'Selects a channel in format order. For RGB, 0 is red, 1 is green and 2 is blue.', 'index={1}', true), classField, classesField,
  ], react('color-picker', ['ColorChannelInput'], '<ColorChannelInput format="hsl" index={0} /><ColorChannelInput format="hsl" index={1} /><ColorChannelInput format="hsl" index={2} />')),
  entry('ColorTextInput', 'Component', 'An optional single text field for a full formatted color. Use ColorInput for separate numeric channel fields.', [
    f('format', formats, 'Current store format', 'Chooses how the text is parsed and displayed. Invalid input is marked and restored on blur or Enter.', 'format="oklch"'),
    f('label', 'string', 'Uppercase format name', 'Sets the visible input label.', 'label="CSS color"'), classField, classesField,
  ], react('color-picker', ['ColorTextInput'], '<ColorTextInput format="hex" label="Color value" />')),
  entry('ColorAlphaInput', 'Component', 'Edits opacity numerically as a percentage. The stored alpha uses 0 to 1.', [
    f('label', 'string', "'Alpha'", 'Replaces the visible and accessible label. The percent unit remains visible.', 'label="Opacity"'), classField, classesField,
    f('value range', 'number: 0 to 100', 'Store alpha × 100', 'The input uses a 0.1 step. Empty, non-finite or out-of-range drafts are invalid and restore on blur.', '50% in this field equals store.setAlpha(0.5)'),
  ], react('color-picker', ['ColorAlphaInput'], '<ColorAlphaInput label="Opacity" />'), 'value range describes the input constraint. It is not a component prop.'),
  entry('ColorFormatSelect', 'Component', 'Chooses which format the following ColorInput displays. The selected color does not change.', [
    f('label', 'string', "'Color format'", 'Replaces the dropdown label. The six format choices remain HEX, RGB, HSL, HSV, OKLCH and OKLAB.', 'label="Display format"'), classField,
  ], react('color-picker', ['ColorFormatSelect', 'ColorInput'], '<ColorFormatSelect label="Display format" /><ColorInput />')),
  entry('ColorMode', 'Component', 'A button that cycles through hex, rgb, hsl, hsv, oklch and oklab, then returns to hex.', [
    classField,
    f('children', 'ReactNode | ((format: ColorFormat) => ReactNode)', 'Current format + switch indicator', 'Replaces the button content with text, an icon or dynamic markup. The callback receives the lowercase format key.', '<ColorMode>{(format) => `Change ${format.toUpperCase()}`}</ColorMode>'),
  ], react('color-picker', ['ColorMode', 'ColorInput'], '<ColorInput /><ColorMode>{(format) => `Change ${format.toUpperCase()}`}</ColorMode>'), 'Svelte: children(format) snippet. Vue: default slot with format. Angular: projected template with let-format. Astro: slot content. Vanilla: cp-mode data-custom with your button, and data-color-format on the span that should follow the format.'),
  entry('ColorViewSelect / ColorSurface', 'Component', 'ColorViewSelect chooses a layout. ColorSurface renders the chosen surface and its matching hue or brightness slider.', [
    f('label', 'string on ColorViewSelect', "'Picker view'", 'Labels the view dropdown. area is displayed as Rectangle and wheel as Wheel.', 'label="Layout"'),
    { ...classField, description: 'Adds a root class to ColorViewSelect. ColorSurface has no React props and uses the current store view.' },
  ], react('color-picker', ['ColorViewSelect', 'ColorSurface', 'ColorInput'], '<ColorViewSelect label="Layout" /><ColorSurface /><ColorInput />')),
  entry('ColorSwatch / ColorPreview', 'Component', 'ColorSwatch applies a supplied color on click. ColorPreview displays the selected RGBA value.', [
    f('value', 'HEX string on ColorSwatch', 'None', 'The preset color applied by the swatch. ColorPreview reads the store instead of taking a value.', 'value="#277D59"', true),
    f('label', 'string on ColorSwatch', 'The value string', 'Accessible name for the swatch button.', 'label="Forest green"'), classField,
  ], react('color-picker', ['ColorSwatch', 'ColorPreview'], '<ColorSwatch value="#277D59" label="Forest green" /><ColorPreview />')),
  entry('ColorPartClasses', 'Styling', 'Part-level CSS class names used by the surface, slider and input components. Unsupported keys are ignored by that component.', [
    f('root', 'string', "''", 'Adds a class to the control root. Supported by surfaces, sliders and inputs.', "classes={{ root: 'brand-control' }}"),
    f('thumb', 'string', "''", 'Styles the single selection dot in ColorArea or ColorWheel.', "classes={{ thumb: 'square-dot' }}"),
    f('marker', 'string', "''", 'Styles each interactive marker in a multi-marker ColorWheel.', "classes={{ marker: 'brand-marker' }}"),
    f('text', 'string', "''", 'Styles surface dot/marker text or a numeric channel label.', "classes={{ text: 'dot-text' }}"),
    f('label', 'string', "''", 'Adds a class to the label wrapper in sliders and inputs.', "classes={{ label: 'field-label' }}"),
    f('track', 'string', "''", 'Adds a class to the range input in ColorSlider.', "classes={{ track: 'wide-track' }}"),
    f('input', 'string', "''", 'Adds a class to the actual text, numeric or range input.', "classes={{ input: 'brand-input' }}"),
  ], react('color-picker', ['ColorArea', 'ColorSlider'], '<ColorArea classes={{ root: "brand-area", thumb: "square-dot", text: "dot-text" }} thumbText="C" /><ColorSlider classes={{ label: "field-label", track: "wide-track" }} />')),
  entry('Channel values', 'Return value', 'The accepted input ranges and channel order for numeric controls. OKLCH and OKLab lightness is displayed as a percentage but returned as a 0 to 1 number.', [
    f('rgb', '{ r, g, b, alpha }', 'Current color', 'Indexes 0/1/2 map to R/G/B, each from 0 to 255. Input step is 1. Returned alpha is 0 to 1.', "store.getValue('rgb').r"),
    f('hsl', '{ h, s, l, alpha }', 'Current color', 'Indexes 0/1/2 map to H/S/L. Hue is 0 to 360 degrees, saturation and lightness are 0 to 100%. Percent input step is 0.1.', "store.getValue('hsl').l"),
    f('hsv', '{ h, s, v, alpha }', 'Current color', 'Indexes 0/1/2 map to H/S/V. Hue is 0 to 360 degrees, saturation and brightness are 0 to 100%. HSV is a picker model, not a CSS color function.', "store.getValue('hsv').v"),
    f('oklch', '{ l, c, h, alpha }', 'Current color', 'Indexes 0/1/2 map to L/C/H. Input L is 0 to 100%, C is 0 to 0.4 and H is 0 to 360 degrees. Returned l is 0 to 1.', "store.getValue('oklch').l"),
    f('oklab', '{ l, a, b, alpha }', 'Current color', 'Indexes 0/1/2 map to L/a/b. Input L is 0 to 100%, a and b are -0.4 to 0.4. Returned l is 0 to 1. Chroma-axis input step is 0.001.', "store.getValue('oklab').a"),
  ], core('color-picker', ['createColorStore'], "const store = createColorStore('#5268E080');\nconst rgb = store.getValue('rgb');\nconst oklch = store.getValue('oklch');\nconsole.log(rgb.r, rgb.alpha, oklch.l);")),
  entry('createColorStore', 'Function', 'Creates color state without mounting a UI. Arguments are positional.', [
    f('value (argument 1)', 'HEX string', "'#6366F1'", 'Seeds the selected color and alpha. The opaque RGB base and alpha are stored separately.', "createColorStore('#5268E080')"),
    f('format (argument 2)', formats, "'hex'", 'Seeds the displayed format. Use lowercase keys.', "createColorStore('#5268E0', 'hsl')"),
    f('view (argument 3)', "'area' | 'wheel'", "'area'", 'Seeds the initial surface layout.', "createColorStore('#5268E0', 'hex', 'wheel')"),
    f('disabled (argument 4)', 'boolean', 'false', 'Seeds the interaction state. You can change it later with setDisabled().', "createColorStore('#5268E0', 'hex', 'area', true)"),
  ], core('color-picker', ['createColorStore'], "const store = createColorStore('#5268E080', 'hsl', 'wheel');\nconsole.log(store.getValue('hsl'));")),
  entry('ColorStore', 'Methods', 'Read color state, subscribe to changes or update it programmatically.', [
    f('getColor()', '() => ColorInfo', 'Current color', 'Returns the nearest name, matching metadata, all numeric formats and formatted strings. See ColorInfo for every field.', 'const color = store.getColor()'),
    f('getValue(format)', `(format: ${formats}) => string | channel object`, 'None', 'Reads only the requested format. hex returns RGBA hex. Other formats return numeric channel objects with alpha.', "store.getValue('hex')"),
    f('getSnapshot()', '() => ColorSnapshot', 'Current state', 'Reads h, s, v, alpha, hex, value, format, view and disabled. hex is opaque RGB, value includes alpha when needed.', 'const { value, alpha } = store.getSnapshot()'),
    f('getServerSnapshot()', '() => ColorSnapshot', 'Initial state', 'Returns the immutable initial seed for server rendering and hydration.', 'store.getServerSnapshot().value'),
    f('subscribe(listener)', '(() => void) => unsubscribe', 'None', 'Runs after a state update, including format or disabled changes. Call the returned function when removing the consumer.', 'const unsubscribe = store.subscribe(() => console.log(store.getSnapshot()))'),
    f('setHex(value)', '(HEX string) => void', 'None', 'Replaces RGB and alpha. Opaque hex resets alpha to 1.', "store.setHex('#277D5980')"),
    f('setHSV(patch)', '(Partial<{ h: number, s: number, v: number }>) => void', 'None', 'Updates only supplied HSV channels. Hue wraps around 360, saturation and brightness clamp to 0 to 100. Alpha stays unchanged.', 'store.setHSV({ h: 140, s: 60 })'),
    f('setAlpha(alpha)', '(number: 0 to 1) => void', 'None', 'Changes only opacity. Rejects non-finite or out-of-range values.', 'store.setAlpha(0.5)'),
    f('setFormat(format)', `(${formats}) => void`, 'None', 'Changes the displayed format without changing the color.', "store.setFormat('oklch')"),
    f('setView(view)', "('area' | 'wheel') => void", 'None', 'Switches layout for components that follow the store view.', "store.setView('wheel')"),
    f('setDisabled(disabled)', '(boolean) => void', 'None', 'Disables editing. Programmatic methods still work so external data can update a disabled preview.', 'store.setDisabled(true)'),
  ], core('color-picker', ['createColorStore'], "const store = createColorStore('#5268E0');\nconst unsubscribe = store.subscribe(() => console.log(store.getColor()));\nstore.setHSV({ h: 140 });\nstore.setAlpha(0.5);\nunsubscribe();")),
  entry('ColorInfo', 'Return value', 'The object returned by getColor(). Naming compares the opaque color against the bundled list and does not depend on alpha.', [
    f('name', 'string', 'Nearest named color', 'Display name from the bundled color list.', 'store.getColor().name'),
    f('slug', 'string', 'Normalized name', 'Lowercase name with spaces replaced by hyphens and apostrophes/slashes removed.', 'store.getColor().slug'),
    f('matchedHex', 'HEX string', 'Nearest named RGB color', 'The named color used for the match. It can differ from the selected hex.', 'store.getColor().matchedHex'),
    f('exact', 'boolean', 'Computed', 'True when the opaque selected RGB color exactly matches the named entry.', 'store.getColor().exact'),
    f('hex', 'string', 'Current RGBA color', 'Returns #RRGGBB for full opacity or #RRGGBBAA when alpha is below 1.', 'store.getColor().hex'),
    f('alpha', 'number: 0 to 1', 'Current opacity', 'Opacity as a numeric fraction.', 'store.getColor().alpha'),
    ...['rgb', 'hsl', 'hsv', 'oklch', 'oklab'].map(format => f(format, 'Numeric channel object + alpha', 'Current color', 'Returns the numeric channels for this format. See Channel values for the individual field names and units.', `store.getColor().${format}`)),
    f('formats', 'Record<ColorFormat, string>', 'Current formatted values', 'Formatted channel strings. Wrap hsl, oklch, oklab and rgb in the matching CSS function when using them in styles. HSV has no CSS function.', '`hsl(${store.getColor().formats.hsl})`'),
  ], core('color-picker', ['createColorStore'], "const color = createColorStore('#5268E080').getColor();\nconsole.log(color.name, color.exact, color.hex);\nconst background = `hsl(${color.formats.hsl})`;\nconsole.log(background);")),
  entry('mountColorPicker', 'Function', 'Mounts a complete Vanilla picker into a DOM element and returns its store, value readers and cleanup.', [
    f('element (argument 1)', 'HTMLElement', 'None', 'The DOM container that receives the generated provider and controls.', "document.querySelector<HTMLElement>('#picker')!", true),
    f('options.value', 'HEX string', "'#6366F1'", 'Initial color for an internally created store.', "{ value: '#5268E0' }"),
    f('options.format', formats, "'hex'", 'Initial input format for an internally created store.', "{ format: 'rgb' }"),
    f('options.view', "'area' | 'wheel'", "'area'", 'Initial layout for an internally created store.', "{ view: 'wheel' }"),
    f('options.store', 'ColorStore', 'Created internally', 'Shares an existing store. Its value, view and format take priority over the initial options.', '{ store }'),
    f('options.disabled', 'boolean', 'Supplied store state / false', 'Overrides disabled when provided. Omitting it preserves a supplied store state.', '{ disabled: true }'),
    f('options.className', 'string', "''", 'Class applied to the generated cp-provider.', "{ className: 'brand-picker' }"),
    f('options.onChange', '(color: ColorInfo) => void', 'No callback', 'Receives the initial ColorInfo immediately and then actual color changes. Unlike ColorProvider, this callback receives the full object.', '{ onChange: (color) => console.log(color.name, color.hex) }'),
    f('return value', '{ element, store, getColor, getValue, destroy }', 'Mounted instance', 'Call destroy() to remove the generated provider and its listeners before mounting again into the same container.', 'picker.destroy()'),
  ], { file: 'usage.ts', code: "import { mountColorPicker } from '@salyra-ui/color-picker/vanilla';\nimport '@salyra-ui/color-picker/vanilla/styles.css';\n\nconst picker = mountColorPicker(document.querySelector<HTMLElement>('#picker')!, {\n  value: '#5268E080', format: 'rgb', view: 'wheel',\n  onChange: (color) => console.log(color.name, color.hex),\n});\n// When the host is removed:\npicker.destroy();" }),
];
const themeOptions: ApiField[] = [
  f('theme', 'Theme', 'Built-in Indigo theme', 'Supplies a complete theme that renders immediately. It takes priority over the stored cache. Use store.setTheme() for later changes to an initialized provider.', "theme={generateTheme('#277D59')}"),
  f('fallbackTheme', 'Theme', 'Built-in Indigo theme', 'Applies when loading rejects, returns invalid theme data or times out. It must be a complete valid Theme. It does not define loading content.', "fallbackTheme={generateTheme('#5268E0')}"),
  f('loadTheme', '(signal: AbortSignal) => unknown | Promise<unknown>', 'No request', 'Loads a complete theme. Pass the signal to fetch so stop() and superseded requests can cancel it. Invalid responses use fallbackTheme.', 'loadTheme={createHttpThemeLoader("/api/theme")}'),
  f('mode', modes, "'system'", 'system follows the device after mount. light and dark force a fixed appearance. Saved mode storage can replace this seed when the provider mounts.', 'mode="dark"'),
  f('systemMode', "'light' | 'dark'", "'light'", 'Provides a deterministic SSR appearance when mode is system. Browser media preference replaces it after mount. Has no visible effect while mode is fixed.', 'systemMode="dark"'),
  f('modeStorage', 'ModeStorage | false', "browserModeStorage('theme-studio:mode')", 'Saves the appearance preference independently from theme data. false disables storage, while system still follows the device. See ModeStorage for its methods.', 'modeStorage={false}'),
  f('storage', 'ThemeStorage', 'No theme cache', 'Reads and writes full theme data. With no supplied theme, the cache can seed the context before the loader revalidates. See ThemeStorage for its methods.', 'storage={browserStorage("app:theme")}'),
  f('background', "'neutral' | 'tinted'", 'Uses the supplied theme', 'neutral generates grayscale surfaces. tinted gives light and dark surfaces a subtle hue from primary. Omitting it preserves the supplied background configuration.', 'background="tinted"'),
  f('selection', 'TokenSelection', 'Mounted fields, or full export', 'Limits theme, JSON and CSS exports. Explicit selection takes priority over automatically registered fields and is available during SSR. See TokenSelection for each key.', 'selection={{ roles: ["primary"], radius: ["card"], width: ["button"] }}'),
  disabled,
  f('timeoutMs', 'Positive finite number, milliseconds', '10000', 'Maximum loader duration. A request that never completes uses the fallback when this timer expires.', 'timeoutMs={5000}'),
  f('revalidateOnFocus', 'boolean', 'false', 'Reloads through loadTheme when the page becomes active again. The current usable theme stays visible during refresh.', 'revalidateOnFocus={true}'),
  f('revalidateIntervalMs', 'Positive finite number, milliseconds', 'No polling', 'Reloads at this interval while the page is visible. The HTTP loader can use ETag and 304 responses to avoid downloading unchanged themes.', 'revalidateIntervalMs={60000}'),
];
const themeSeed = "const store = createThemeStore({ theme: generateTheme('#5268E0'), mode: 'light', modeStorage: false });";
const themeCore = (body: string, more: string[] = []) => core('theme-studio', ['createThemeStore', 'generateTheme', ...more], `${themeSeed}\n${body}`);
const themeEntries: ApiEntry[] = [
  entry('ThemeProvider', 'Component', 'Creates a shared theme context and scopes its CSS variables to the content inside it.', [
    ...themeOptions,
    f('store', 'ThemeStore', 'Created from options', 'Uses an existing store. Its snapshot seeds the provider. Pass matching lifecycle options for loading, cache and mode persistence.', 'store={store}'), themeClass,
    f('style', 'React.CSSProperties', '{}', 'Adds root styling. Explicit style properties override generated CSS variables on this scope.', 'style={{ padding: 24 }}'),
    f('children', 'ReactNode', 'None', 'The application and controls that share this theme. A nested provider creates an independent scope.', '<ThemeProvider><ThemePicker /></ThemeProvider>', true),
  ], react('theme-studio', ['ThemePicker', 'ThemePalette', 'ThemeExport'], '<ThemePicker roles={["primary"]} controls={false} /><ThemePalette /><ThemeExport />'), 'React passes ThemeOptions directly as props. Svelte, Vue and Angular pass an options object. Initial options seed the store once. For later edits use store methods. Astro replaces loader and cache functions with src, storageKey and modeStorageKey.'),
  entry('Astro provider options', 'Options', 'Astro supports the serializable ThemeOptions plus these browser loading and persistence keys.', [
    f('src', 'URL string', 'No client fetch', 'Starts a browser request for theme JSON. It replaces loadTheme, which cannot be serialized into HTML.', 'src="/api/theme"'),
    f('storageKey', 'string', 'No theme cache', 'Creates a browser theme cache with this key. It replaces a custom ThemeStorage object.', 'storageKey="app:theme"'),
    f('modeStorageKey', 'string', "'theme-studio:mode'", 'Chooses the appearance persistence key for the browser.', 'modeStorageKey="app:mode"'),
    f('modeStorage', 'false', 'Browser persistence enabled', 'Disables browser appearance persistence. Custom function-based ModeStorage is not an Astro prop.', 'modeStorage={false}'),
    f('class', 'string', "''", 'Adds a class to the generated tk-provider element.', 'class="brand-theme"'),
  ], { file: 'options.ts', code: "import { generateTheme } from '@salyra-ui/theme-studio';\n\nconst props = {\n  fallbackTheme: generateTheme('#5268E0'),\n  src: '/api/theme', storageKey: 'app:theme', modeStorageKey: 'app:mode',\n};\n// Pass these serializable props to Astro ThemeProvider.\nconsole.log(props);" }),
  entry('ThemePicker', 'Component', 'Edits the selected theme roles with a rectangle, separate wheel or shared wheel.', [
    f('roles', `readonly (${role})[]`, "['primary', 'secondary', 'accent']", 'Chooses editable palettes. At least one unique role is required. A one-role picker uses a small unlabeled dot and hides role tabs.', 'roles={["primary", "accent"]}'),
    f('activeRole', role, 'First selected role', 'Chooses the color initially connected to brightness and format fields. It must be included in roles.', 'activeRole="accent"'),
    f('view', "'area' | 'wheel' | 'shared-wheel'", "'shared-wheel'", 'area shows a rectangle for the active role. wheel shows one active color on a circle. shared-wheel shows all selected role markers together.', 'view="shared-wheel"'),
    f('controls', 'boolean', 'false for one role, true otherwise', 'Shows or hides the view and visible-role selectors. Set false for a fixed editor composition.', 'controls={false}'), disabled,
    f('picker', 'ThemePickerStore', 'Created internally', 'Uses a picker controller created with createThemePickerStore(themeStore, options). It keeps role, active-role and view state separate from the theme.', 'picker={picker}'),
    f('children', 'ReactNode', 'Slider, format select, inputs and format button', 'Replaces the default lower control group. The role controls and picking surface still render.', '<ThemePicker><ColorSlider channel="v" /><ColorInput /></ThemePicker>'),
  ], react('theme-studio', ['ThemePicker'], '<ThemePicker roles={["primary", "accent"]} activeRole="accent" view="shared-wheel" controls={false} />'), 'React creates its picker controller from initial props. Use picker.setRoles(), selectRole() and setView() for programmatic changes after mount. Disabled can be local to this picker or inherited from ThemeProvider.'),
  entry('ThemeGenerator / ThemeColor', 'Component', 'Connects a color-picker composition to one theme palette. ThemeColor is an alias of ThemeGenerator.', [
    paletteRole,
    f('wheel', 'boolean', 'false', 'Chooses the initial wheel instead of area when the generator creates its color context.', 'wheel={true}'), disabled, themeClass,
    f('children', 'ReactNode', 'View selector, surface and format controls', 'Replaces the default composition. Put color-picker components inside to use the linked color store.', '<ThemeGenerator role="accent"><ColorWheel /><ColorInput /></ThemeGenerator>'),
  ], react('theme-studio', ['ThemeGenerator'], '<ThemeGenerator role="accent" wheel disabled={false} />'), 'Import custom color controls from the matching color-picker adapter. In Angular, set [custom]="true" when projecting your own generator composition. Mounted generators register their role for automatic export selection.'),
  entry('ThemeHarmony', 'Component', 'Selects a color harmony. The Generate action derives secondary and accent from primary.', [
    f('label', 'string', "'Color harmony'", 'Replaces the harmony dropdown label.', 'label="Palette relationship"'),
    f('harmony values', harmony, "Theme harmony / 'analogous'", 'analogous rotates secondary by -30° and accent by +30°. triadic uses +120° and +240°. split-complementary uses +150° and +210°. Choosing a formula alone does not regenerate the colors.', 'store.setHarmony("triadic"); store.generateHarmony()'),
  ], react('theme-studio', ['ThemeHarmony'], '<ThemeHarmony label="Palette relationship" />'), 'harmony values describes the dropdown choices, not a component prop. For programmatic control, use setHarmony() followed by generateHarmony(). Manual edits remain possible afterward.'),
  entry('ThemeBackground', 'Component', 'A checkbox that enables a primary-tinted surface palette or restores neutral surfaces.', [
    f('label', 'string', "'Tint background with primary'", 'Replaces the checkbox text. Checked applies tinted and unchecked applies neutral.', 'label="Use brand-colored surfaces"'), themeClass,
  ], react('theme-studio', ['ThemeBackground'], '<ThemeBackground label="Use brand-colored surfaces" />'), 'Mounting this control registers background and foreground fields for export. The active appearance is exported unless selection.modes includes both light and dark.'),
  entry('ThemeBorder / ThemeRadius / ThemeBorderWidth', 'Component', 'Edits one radius or border-width token. Each target is independent and each mounted field is registered for export.', [
    f('kind', "'width' | 'radius'", "'width' on ThemeBorder", 'width uses px with step 1. radius uses rem with step 0.125. ThemeRadius fixes kind to radius and ThemeBorderWidth fixes it to width.', 'kind="radius"'),
    f('target', target, "'DEFAULT'", 'Chooses the token to edit. DEFAULT is the shared default token. The named targets affect their own CSS variables, not the other targets.', 'target="button"'),
    f('label', 'string', 'Target + border + kind', 'Replaces the input label. Units still appear next to the field.', 'label="Button corner radius"'),
    f('numeric range', 'number: 0 to 1000', 'Current theme token', 'Rejects negative, non-finite and out-of-range edits. A newly generated theme starts at 0.5 rem radius and 1 px width for every target.', 'store.setBorder("radius", "button", 0.75)'),
  ], react('theme-studio', ['ThemeRadius', 'ThemeBorderWidth'], '<ThemeRadius target="button" label="Button corner radius" /><ThemeBorderWidth target="card" label="Card border width" />'), 'numeric range describes the input constraint. It is not a prop. Geometry selection uses the same targets as the controls and does not export omitted fields.'),
  entry('ThemePalette', 'Component', 'Displays eleven generated shades for one role. Color values always come from the current theme.', [
    paletteRole,
    f('shape', "'square' | 'circle' | 'joined'", "'square'", 'square gives separate swatches. circle makes round swatches. joined removes the gap and rounds only the strip ends.', 'shape="joined"'), themeClass,
    f('classes', 'PaletteClasses', '{}', 'Assigns root, item, swatch and label classes. See Palette styling for each nested key.', 'classes={{ root: "brand-palette", label: "shade-label" }}'),
    f('labels', 'Partial<Record<Shade, string>>', 'Shade number', `Replaces the text for individual shade labels. Shade keys are ${shades}. Unspecified shades keep their numbers.`, 'labels={{ 500: "Brand", 950: "Ink" }}'),
    f('shadeClasses', 'Partial<Record<Shade, string>>', '{}', 'Adds a class to the item wrapper for a specific shade, including its label and swatch.', 'shadeClasses={{ 500: "featured-shade" }}'),
  ], react('theme-studio', ['ThemePalette'], '<ThemePalette role="primary" shape="joined" labels={{ 500: "Brand" }} classes={{ root: "brand-palette", label: "shade-label" }} />')),
  entry('Palette styling', 'Styling', 'Nested PaletteClasses keys and CSS variables. Class names are strings, while geometry is set with CSS variables.', [
    f('classes.root', 'string', "''", 'Styles the palette grid and hosts its sizing variables.', 'classes={{ root: "brand-palette" }}'),
    f('classes.item', 'string', "''", 'Styles every shade wrapper, including the label and swatch.', 'classes={{ item: "shade-item" }}'),
    f('classes.swatch', 'string', "''", 'Styles the color surface shape, outline and size. The background color is supplied by the theme.', 'classes={{ swatch: "shade-surface" }}'),
    f('classes.label', 'string', "''", 'Styles the shade label text.', 'classes={{ label: "shade-caption" }}'),
    f('--tk-palette-gap', 'CSS length', '4px', 'Spacing between separate swatches. joined always uses zero gap.', '.brand-palette { --tk-palette-gap: 8px; }'),
    f('--tk-swatch-height', 'CSS length', '48px', 'Height of each swatch. Circle width is limited to this height.', '.brand-palette { --tk-swatch-height: 64px; }'),
    f('--tk-swatch-radius', 'CSS length', '4px square / 8px joined', 'Corner radius for square swatches and joined strip ends. Circle stays round.', '.brand-palette { --tk-swatch-radius: 10px; }'),
    f('--tk-shade-label-size', 'CSS font-size', '11px', 'Font size of the shade labels.', '.brand-palette { --tk-shade-label-size: 12px; }'),
  ], react('theme-studio', ['ThemePalette'], '<ThemePalette shape="circle" classes={{ root: "brand-palette", item: "shade-item", swatch: "shade-surface", label: "shade-caption" }} />')),
  entry('ThemeMode', 'Component', 'A customizable appearance button. Give it a value for a fixed choice or omit value to cycle.', [
    f('value', modes, 'Cycle on click', 'With value, the button selects that mode and indicates whether it is active. Without value, clicks cycle system, light, dark and back to system.', 'value="dark"'),
    f('labels', 'Record<ModePreference, ReactNode>', 'System / Light mode / Dark mode', 'Replaces the default content for each mode when children is omitted.', 'labels={{ system: "Device", light: "Day", dark: "Night" }}'),
    f('children', 'ReactNode | ((mode: ReturnType<typeof useThemeMode>) => ReactNode)', 'Uses labels', 'Replaces button content with text, an icon or a render callback. The callback can read preference and resolvedMode.', '<ThemeMode value="dark">Night</ThemeMode>'), themeClass,
  ], react('theme-studio', ['ThemeMode'], '<ThemeMode value="system">Device</ThemeMode><ThemeMode value="light">Day</ThemeMode><ThemeMode value="dark">Night</ThemeMode>'), 'Svelte uses a children(mode) snippet and Vue a scoped slot. React labels is a convenience prop. Angular and Astro use projected content or slots. The provider owns mode persistence.'),
  entry('useThemeMode', 'Return value', 'Reads the current appearance and provides actions for your own buttons, toggles or dropdowns.', [
    f('preference', modes, 'Provider preference', 'The saved user choice. system remains system even when resolvedMode is dark.', 'const mode = useThemeMode(); mode.preference'),
    f('resolvedMode', "'light' | 'dark'", 'Resolved appearance', 'The mode currently applied to CSS variables and color-scheme.', 'mode.resolvedMode'),
    f('setMode(value)', `(${modes}) => void`, 'None', 'Applies a specific preference and persists it through the provider mode storage.', 'mode.setMode("system")'),
    f('cycle()', '() => void', 'None', 'Advances system to light, light to dark and dark to system.', 'mode.cycle()'),
  ], { file: 'Usage.tsx', code: "import { useThemeMode } from '@salyra-ui/theme-studio/react';\n\n// Render inside ThemeProvider.\nexport function AppearanceButton() {\n  const mode = useThemeMode();\n  return <button aria-pressed={mode.preference === 'dark'} onClick={() => mode.setMode('dark')}>Night</button>;\n}" }),
  entry('ThemeName', 'Component', 'Edits the theme name while keeping a suggested name based on primary available.', [
    f('label', 'string', "'Theme name'", 'Replaces the input label.', 'label="Theme title"'), themeClass,
    f('children', '(value: { name, suggestedName, setName }) => ReactNode', 'Default name input', 'React callback for a custom input. name is the current title, suggestedName is the primary color name and setName changes the title. Empty string is a custom name until reset.', '<ThemeName>{({ name }) => <span>{name}</span>}</ThemeName>'),
  ], react('theme-studio', ['ThemeName'], '<ThemeName label="Theme title" />'), 'Custom names survive later color edits. Calling store.setName() with no argument restores automatic naming. The default input limits names to 200 characters and resets an empty name on blur.'),
  entry('ThemeSelect / ThemeSwatch', 'Component', 'Applies a complete theme from a dropdown or a preset button.', [
    f('themes', 'readonly Theme[] on ThemeSelect', 'None', 'Preset list. Each theme must have a unique id. Empty lists disable the dropdown. Presets apply full theme data but keep the appearance preference.', 'themes={[generateTheme("#5268E0"), generateTheme("#277D59")]}', true),
    f('theme', 'Theme on ThemeSwatch', 'None', 'The full theme applied when this button is clicked.', 'theme={generateTheme("#277D59", { name: "Forest" })}', true),
    f('label', 'string on ThemeSelect', "'Saved themes'", 'Replaces the dropdown label.', 'label="Choose a theme"'),
    f('children', 'ReactNode on ThemeSwatch', 'theme.name', 'Custom preset button content. ThemeSelect uses theme names for its options.', '<ThemeSwatch theme={theme}>Use this theme</ThemeSwatch>'), themeClass,
  ], react('theme-studio', ['ThemeSelect', 'ThemeSwatch'], '<ThemeSelect themes={[generateTheme("#5268E0"), generateTheme("#277D59")]} /><ThemeSwatch theme={generateTheme("#277D59", { name: "Forest" })}>Forest</ThemeSwatch>')),
  entry('ThemeLoading / ThemeReady / ThemeError', 'Component', 'Separates loading content, usable theme content and error recovery. Ready and Error can be visible together when a fallback is applied.', [
    f('ThemeLoading.children', 'ReactNode', 'None', 'Renders only while status is loading and no usable theme is available. A background refresh keeps current content visible.', '<ThemeLoading><p>Loading theme</p></ThemeLoading>', true),
    f('ThemeReady.children', 'ReactNode', 'None', 'Renders when status is ready or fallback. It includes the application that should use the theme.', '<ThemeReady><p>Application content</p></ThemeReady>', true),
    f('ThemeError.children', '(error: Error, retry: () => Promise<void>) => ReactNode', 'None', 'Renders when the context has an error. retry runs store.reload(). Use it for your own message and retry button.', '<ThemeError>{(error, retry) => <button onClick={() => void retry()}>Retry</button>}</ThemeError>', true),
  ], react('theme-studio', ['ThemeLoading', 'ThemeReady', 'ThemeError'], '<ThemeLoading><p>Loading theme</p></ThemeLoading><ThemeReady><p>Application content</p></ThemeReady><ThemeError>{(error, retry) => <button onClick={() => void retry()}>{error.message}: Retry</button>}</ThemeError>'), 'In Svelte and Vue, error and retry are snippet/slot values. Angular exposes a projected error template. Vanilla uses tk-loading, tk-ready and tk-error, with data-tk-retry on your retry button.'),
  entry('ThemeExport', 'Component', 'Displays the selected JSON or CSS output, or passes the full configuration to your own UI.', [
    f('format', "'json' | 'css'", "'json'", 'Chooses which string is displayed by the default output. Does not affect the fields in the configuration.', 'format="css"'),
    f('selection', 'TokenSelection', 'Provider selection / mounted fields', 'Overrides the export selection for this component. Omitted selection uses the snapshot selection, or full output when no fields are registered.', 'selection={{ roles: ["primary"], radius: ["card"] }}'),
    f('onChange', '(configuration: ThemeConfiguration) => void', 'No callback', 'React callback receives the initial configuration and subsequent theme or appearance updates.', 'onChange={(config) => console.log(config.json)}'),
    f('children', '(configuration: ThemeConfiguration) => ReactNode', 'pre containing output string', 'Renders your own export UI. configuration includes selected theme data, tokens, JSON and CSS.', '<ThemeExport>{(config) => <pre>{config.json}</pre>}</ThemeExport>'), themeClass,
  ], react('theme-studio', ['ThemeExport'], '<ThemeExport format="json" selection={{ roles: ["primary"], radius: ["card"], width: ["button"] }} />')),
  entry('TokenSelection', 'Options', 'Chooses which fields are exported. A selection filters theme, JSON and CSS without discarding the full internal theme.', [
    f('roles', `readonly (${role})[]`, "['primary']", 'Includes these palettes. [] excludes all color palettes. Each included role still contains its shades, DEFAULT and foreground.', '{ roles: ["primary", "accent"] }'),
    f('radius', `readonly (${target})[]`, '[]', 'Includes only these radius tokens. Each target is independent.', '{ radius: ["card", "input"] }'),
    f('width', `readonly (${target})[]`, '[]', 'Includes only these border-width tokens.', '{ width: ["button"] }'),
    f('background', 'boolean', 'false', 'Includes background, foreground and color-scheme. Without it, website surface colors are omitted.', '{ background: true }'),
    f('mode', "'light' | 'dark'", 'Resolved active mode', 'Chooses the surface mode used by CSS and by a single-mode JSON export. Does not change the active context.', '{ background: true, mode: "dark" }'),
    f('modes', "readonly ('light' | 'dark')[]", 'Only mode / resolved active mode', 'Select one or both background/foreground branches for JSON. An empty array is invalid. Both modes keep mode preference and systemMode metadata. CSS declarations still describe one mode.', '{ background: true, modes: ["light", "dark"] }'),
  ], themeCore('const config = themeConfiguration(store.getSnapshot(), {\n  roles: ["primary"], radius: ["card"], width: ["button"],\n  background: true, modes: ["dark"], mode: "dark",\n});\nconsole.log(config.json);', ['themeConfiguration']), 'These defaults apply when a selection object is supplied. Without a selection or registered editor fields, themeConfiguration returns the full theme. Explicit provider selection is the reliable way to seed a partial SSR export.'),
  entry('ThemeConfiguration', 'Return value', 'Call themeConfiguration(snapshot, selection?) to read export data. The result retains the full theme separately from the selected output.', [
    f('theme', 'SelectedTheme', 'Selected fields / full theme', 'The theme fields chosen by selection. Omitted roles, geometry and appearance branches are absent.', 'config.theme.structure.userPreset?.primary'),
    f('sourceTheme', 'Theme', 'Full internal theme', 'Complete context for application rendering. It is not serialized into config.json.', 'config.sourceTheme.structure.userPreset.accent'),
    f('mode', "'light' | 'dark'", 'Snapshot resolved mode', 'The current resolved context appearance. selection.mode can override exported surface values without changing this field.', 'config.mode'),
    f('modePreference', modes, 'Snapshot preference', 'The selected system/light/dark preference.', 'config.modePreference'),
    f('systemMode', "'light' | 'dark'", 'Snapshot system appearance', 'Device appearance, or the server seed before mount.', 'config.systemMode'),
    f('tokens', 'Readonly<Record<string, string>>', 'Selected CSS tokens', 'Map of variable names to values, such as --primary and --border-radius-card. Values retain their CSS units.', 'config.tokens["--border-radius-card"]'),
    f('css', 'string', 'Selected declarations', 'CSS declarations without a selector. Wrap them in your chosen scope or apply them as an inline style.', '`.app { ${config.css} }`'),
    f('json', 'string', 'Selected theme + mode metadata', 'Serialized export. A partial theme must be merged into a full base before loading it as a complete Theme.', 'mergeThemeConfiguration(config.sourceTheme, config.json)'),
  ], themeCore('const config = themeConfiguration(store.getSnapshot(), { roles: ["primary"] });\nconst updated = mergeThemeConfiguration(config.sourceTheme, config.json);\nstore.setTheme(updated);', ['themeConfiguration', 'mergeThemeConfiguration'])),
  entry('ThemeStore', 'Methods', 'The framework-independent state shared by providers, editors and application consumers.', [
    f('getSnapshot()', '() => ThemeSnapshot', 'Current state', 'Reads full theme, mode, modePreference, systemMode, background, status, pending, error, style, selection and disabled.', 'const { theme, pending } = store.getSnapshot()'),
    f('getServerSnapshot()', '() => ThemeSnapshot', 'Initial immutable snapshot', 'Reads the original seed used for server rendering and hydration. Create a separate store for each request.', 'store.getServerSnapshot().style'),
    f('subscribe(listener)', '(() => void) => unsubscribe', 'None', 'Notifies after state changes. Call the returned cleanup when removing the consumer.', 'const stop = store.subscribe(() => console.log(store.getSnapshot()))'),
    f('start()', '() => Promise<void>', 'None', 'Reads the cache and runs the loader. Framework providers mount this automatically.', 'await store.start()'),
    f('reload()', '() => Promise<void>', 'None', 'Runs the loader again without restoring cache. Keeps the current usable theme visible while pending.', 'await store.reload()'),
    f('stop()', '() => void', 'None', 'Cancels in-flight loading. Provider cleanup also removes browser listeners.', 'store.stop()'),
    f('setTheme(theme)', '(Theme) => void', 'None', 'Validates and applies a complete theme. Keeps the current appearance preference.', 'store.setTheme(generateTheme("#277D59"))'),
    f('setColor(role, hex)', `(${role}, HEX string) => void`, 'None', 'Regenerates only that role palette. Changing primary updates automatic naming and generated backgrounds, but does not regenerate sibling colors.', 'store.setColor("accent", "#C25D3D")'),
    f('setBorder(kind, target, value)', "('radius' | 'width', Target, number: 0 to 1000) => void", 'None', 'Updates one geometry token. radius is rem and width is px. See geometry controls for target names.', 'store.setBorder("radius", "card", 0.75)'),
    f('setName(name?)', '(string | undefined) => void', 'Suggested name when omitted', 'Sets a custom name or resets it to the primary color suggestion.', 'store.setName("Project theme")'),
    f('setMode(mode)', `(${modes}) => void`, 'None', 'Changes appearance preference. Persistence is handled by the mounted provider.', 'store.setMode("dark")'),
    f('setSystemMode(mode)', "('light' | 'dark') => void", 'None', 'Updates the resolved system appearance. Affects visible mode only when preference is system.', 'store.setSystemMode("dark")'),
    f('setBackground(mode)', "('neutral' | 'tinted') => void", 'None', 'Regenerates surface colors using the current primary color.', 'store.setBackground("tinted")'),
    f('setHarmony(harmony)', `(${harmony}) => void`, 'None', 'Stores a harmony choice without changing palette colors.', 'store.setHarmony("triadic")'),
    f('generateHarmony()', '() => void', 'None', 'Regenerates secondary and accent from current primary using the chosen harmony.', 'store.generateHarmony()'),
    f('generate(seed, options?)', '(HEX string, { roles?, harmony?, name? }) => void', 'All roles when roles omitted', 'Generates new palettes against the current theme base. Omitted roles keep their palettes when roles is supplied. Existing geometry remains.', 'store.generate("#277D59", { roles: ["primary"], name: "Forest" })'),
    f('setSelection(selection)', '(TokenSelection) => void', 'None', 'Sets an explicit export scope that takes priority over mounted field registrations.', 'store.setSelection({ roles: ["primary"], width: ["button"] })'),
    f('registerFields(selection)', '(TokenSelection) => { update, destroy }', 'None', 'Registers mounted editor fields for automatic export scope. update changes its fields and destroy removes the registration.', 'const fields = store.registerFields({ radius: ["card"], roles: [] })'),
    f('setDisabled(disabled)', '(boolean) => void', 'None', 'Changes global editing state while keeping theme data available.', 'store.setDisabled(true)'),
  ], themeCore('store.setColor("primary", "#277D59");\nstore.setBorder("radius", "card", 0.75);\nstore.setName("Forest");\nstore.setSelection({ roles: ["primary"], radius: ["card"] });')),
  entry('ThemeSnapshot', 'Return value', 'State read through getSnapshot(), useTheme() or the adapter reactive context.', [
    f('theme', 'Theme', 'Current full theme', 'The complete internal theme even when exports select only some fields.', 'store.getSnapshot().theme'),
    f('mode', "'light' | 'dark'", 'Resolved appearance', 'The appearance currently used by the scope.', 'store.getSnapshot().mode'),
    f('modePreference', modes, "Initial 'system' unless configured", 'The selected appearance preference, before system resolution.', 'store.getSnapshot().modePreference'),
    f('systemMode', "'light' | 'dark'", "Initial 'light' unless configured", 'The server seed or mounted browser preference.', 'store.getSnapshot().systemMode'),
    f('background', "'neutral' | 'tinted' | 'preserve'", 'Theme background mode', 'preserve means supplied surface colors are kept. neutral and tinted regenerate surfaces when primary changes.', 'store.getSnapshot().background'),
    f('status', "'loading' | 'ready' | 'fallback'", 'Determined by options', 'loading has no usable resolved theme. ready uses supplied, cached or loaded data. fallback uses fallbackTheme after a failure.', 'store.getSnapshot().status === "fallback"'),
    f('pending', 'boolean', 'Loader state', 'True while a request is running, including background refresh. It can be true while status is ready.', 'store.getSnapshot().pending'),
    f('error', 'Error | null', 'null', 'The last loader failure when present. A fallback theme can remain usable while this is non-null.', 'store.getSnapshot().error?.message'),
    f('style', 'string', 'Full theme CSS declarations', 'Declarations for the complete active theme scope. Export filtering does not limit application styling.', 'store.getSnapshot().style'),
    f('selection', 'TokenSelection | undefined', 'Explicit or mounted selection', 'Current export scope. undefined means no explicit or registered selection.', 'store.getSnapshot().selection?.roles'),
    f('disabled', 'boolean', 'false', 'Whether user editing is blocked by this context.', 'store.getSnapshot().disabled'),
  ], themeCore('const { status, pending, error, mode } = store.getSnapshot();\nconsole.log(status, pending, error?.message, mode);')),
  entry('createThemeStore', 'Function', 'Creates theme state without a DOM scope. Accepts the ThemeOptions documented under ThemeProvider.', [
    f('options', 'ThemeOptions', '{}', 'Includes theme, fallbackTheme, loader, mode, storage, selection and disabled options. Constructing a store does not start a fetch or read browser storage.', 'createThemeStore({ theme: generateTheme("#5268E0"), mode: "dark" })'),
    f('return value', 'ThemeStore', 'New isolated state', 'Use with a provider, or mount its lifecycle manually through mountThemeStore(). Core generation and read methods work on the server.', 'const cleanup = mountThemeStore(store, options.storage, options)'),
  ], core('theme-studio', ['createThemeStore', 'generateTheme'], 'const store = createThemeStore({\n  theme: generateTheme("#5268E0"), mode: "dark", modeStorage: false,\n  selection: { roles: ["primary"], radius: ["card"] },\n});\nconsole.log(store.getSnapshot().theme.name);')),
  entry('generateTheme', 'Function', 'Builds a full Theme from a seed color. Export selection is a separate step.', [
    f('seed (argument 1)', 'Opaque HEX string', 'None', 'The primary color used to generate the theme. Theme palettes use opaque HSL channels.', 'generateTheme("#5268E0")', true),
    f('options.id', 'string', 'custom- + seed hex', 'Stable theme identifier for selection and persistence.', '{ id: "brand-blue" }'),
    f('options.name', 'string', 'Suggested color name / custom base name', 'Sets a custom theme name. Omit to use the primary color suggestion or preserve a custom base name.', '{ name: "Brand blue" }'),
    f('options.harmony', harmony, "Base harmony / 'analogous'", 'Formula used to generate secondary and accent. See ThemeHarmony for exact hue offsets.', '{ harmony: "triadic" }'),
    f('options.base', 'Theme', 'New default geometry and surfaces', 'Keeps existing geometry and unselected palettes. Used with roles to update part of a full theme.', '{ base: existingTheme, roles: ["primary"] }'),
    f('options.roles', `readonly (${role})[]`, 'All three roles', 'Selects palettes to regenerate. With a base, unselected roles stay unchanged. This does not create a partial exported Theme.', '{ roles: ["primary"] }'),
    f('options.background', "'neutral' | 'tinted' | 'preserve'", "Base setting / 'neutral'", 'neutral creates grayscale surfaces, tinted uses primary hue and preserve keeps supplied base surfaces.', '{ background: "tinted" }'),
  ], core('theme-studio', ['generateTheme'], 'const theme = generateTheme("#5268E0", {\n  id: "brand-blue", name: "Brand blue", harmony: "triadic", background: "tinted",\n});\nconsole.log(theme.structure.userPreset.primary[500]);')),
  entry('ThemeStorage / ModeStorage', 'Options', 'Storage contracts passed to ThemeProvider. ThemeStorage saves complete themes, while ModeStorage saves system/light/dark preferences.', [
    f('ThemeStorage.read', '() => unknown | Promise<unknown>', 'None', 'Returns a cached theme or saved snapshot. Invalid data is ignored and loading can continue.', 'read: () => JSON.parse(localStorage.getItem("app:theme") ?? "null")', true),
    f('ThemeStorage.write', '(theme: Theme) => void | Promise<void>', 'None', 'Persists a complete theme after changes. It receives full context data, not a partial editor export.', 'write: (theme) => localStorage.setItem("app:theme", JSON.stringify(theme))', true),
    f('ThemeStorage.subscribe', '(listener: (value: unknown) => void) => cleanup', 'No remote notifications', 'Passes external cache changes into the mounted context. The browser adapter uses same-origin storage events.', 'subscribe: (listener) => subscribeToThemeCache(listener)'),
    f('ModeStorage.read', '() => unknown', 'None', 'Returns system, light or dark. Invalid values are ignored.', 'read: () => localStorage.getItem("app:mode")', true),
    f('ModeStorage.write', `(mode: ${modes}) => void`, 'None', 'Saves appearance preference when it changes.', 'write: (mode) => localStorage.setItem("app:mode", mode)', true),
    f('ModeStorage.subscribe', '(listener: (value: unknown) => void) => cleanup', 'No remote notifications', 'Notifies the context when another tab changes the saved preference.', 'subscribe: (listener) => subscribeToModeCache(listener)'),
  ], themeCore('const options = {\n  theme: store.getSnapshot().theme, storage: browserStorage("app:theme"),\n  modeStorage: browserModeStorage("app:mode"),\n};\nconsole.log(options);', ['browserStorage', 'browserModeStorage']), 'browserStorage(key) defaults to @salyra-ui/theme-studio. browserModeStorage(key) defaults to theme-studio:mode. Both are safe to construct during SSR because browser access is deferred until mount.'),
  entry('createHttpThemeLoader', 'Function', 'Creates an abortable HTTP loader with ETag revalidation and 304 support. Instantiate one loader per context.', [
    f('url (argument 1)', 'URL string', 'None', 'Endpoint that returns a complete Theme as JSON. Invalid JSON, invalid themes and unsuccessful responses reject and use provider fallback.', 'createHttpThemeLoader("/api/theme")', true),
    f('options.fetch', 'typeof fetch', 'Global fetch', 'Overrides the request function, for example for a supplied fetch implementation.', '{ fetch: customFetch }'),
    f('options.headers', 'HeadersInit', 'No extra headers', 'Adds request headers. The loader supplies If-None-Match when a previous ETag is available.', '{ headers: { Accept: "application/json" } }'),
    f('options.credentials', "'omit' | 'same-origin' | 'include'", 'Browser fetch default', 'Controls whether cookies and credentials are sent.', '{ credentials: "include" }'),
    f('invalidate()', '() => void on returned loader', 'None', 'Clears the in-memory cached theme and ETag. The next call makes a fresh request.', 'loader.invalidate()'),
  ], core('theme-studio', ['createThemeStore', 'createHttpThemeLoader', 'generateTheme'], 'const loader = createHttpThemeLoader("/api/theme", { credentials: "same-origin" });\nconst store = createThemeStore({ loadTheme: loader, fallbackTheme: generateTheme("#5268E0") });\n// A provider mounts this lifecycle automatically.\nvoid store.start();')),
  entry('watchThemeUpdates', 'Function', 'Connects refresh to focus, polling or external notifications and returns a cleanup function.', [
    f('store (argument 1)', 'ThemeStore', 'None', 'Context reloaded by the watcher. It should have a loadTheme function.', 'watchThemeUpdates(store)', true),
    f('options.onFocus', 'boolean', 'true', 'Refreshes when the page becomes active and is not hidden. This helper defaults to true, unlike ThemeOptions.revalidateOnFocus.', '{ onFocus: false }'),
    f('options.intervalMs', 'Positive finite number, milliseconds', 'No polling', 'Refreshes at this interval while the page is visible.', '{ intervalMs: 60000 }'),
    f('options.subscribe', '(invalidate: () => void) => cleanup', 'No external notifications', 'Calls invalidate when another application, SSE stream or WebSocket reports a theme change. Returns your subscription cleanup.', '{ subscribe: (invalidate) => connectThemeEvents(invalidate) }'),
    f('return value', '() => void', 'Cleanup', 'Removes timers, focus listeners and the external subscription.', 'stopWatching()'),
  ], themeCore('const stopWatching = watchThemeUpdates(store, { onFocus: true, intervalMs: 60000 });\n// When the consumer unmounts:\nstopWatching();', ['watchThemeUpdates'])),
  entry('mountThemeKit', 'Function', 'Mounts the complete Vanilla editor. ThemeOptions are accepted alongside these composition options.', [
    f('element (argument 1)', 'HTMLElement', 'None', 'DOM container for the generated tk-provider and editor.', 'document.querySelector<HTMLElement>("#theme-editor")!', true),
    f('options.store', 'ThemeStore', 'Created internally', 'Connects the editor to an existing theme context.', '{ store }'),
    f('options.themes', 'readonly Theme[]', '[]', 'Supplies preset dropdown entries. With one picker role, the default complete layout hides presets and harmony controls.', '{ themes: [generateTheme("#5268E0"), generateTheme("#277D59")] }'),
    f('options.picker', 'ThemePickerOptions', 'All roles, shared-wheel', 'Sets picker roles, activeRole, view, controls and local disabled. See ThemePicker for these keys.', '{ picker: { roles: ["primary"], view: "wheel", controls: false } }'),
    f('options.radius', `readonly (${target})[]`, "['card']", 'Adds exactly these radius fields. [] adds none.', '{ radius: ["card", "button"] }'),
    f('options.width', `readonly (${target})[]`, "['card']", 'Adds exactly these border-width fields. [] adds none.', '{ width: ["input"] }'),
    f('options.backgroundControl', 'boolean', 'true', 'Shows the surface tint checkbox. false omits it and its automatic export registration.', '{ backgroundControl: false }'),
    f('options.className', 'string', "''", 'Adds a CSS class to the generated tk-provider scope.', '{ className: "brand-editor" }'),
    f('options.onChange', '(configuration: ThemeConfiguration) => void', 'No callback', 'Receives configuration after theme-change events. It does not emit the initial configuration. Read getConfiguration() for the initial output.', '{ onChange: (config) => console.log(config.json) }'),
    f('return value', '{ element, store, getConfiguration, destroy }', 'Mounted instance', 'getConfiguration(selection?) returns the selected output. destroy() removes the generated provider and listeners.', 'editor.getConfiguration({ roles: ["primary"] })'),
  ], { file: 'usage.ts', code: 'import { mountThemeKit, generateTheme } from "@salyra-ui/theme-studio/vanilla";\nimport "@salyra-ui/theme-studio/vanilla/styles.css";\n\nconst editor = mountThemeKit(document.querySelector<HTMLElement>("#theme-editor")!, {\n  theme: generateTheme("#5268E0"), modeStorage: false,\n  picker: { roles: ["primary"], controls: false },\n  radius: ["card"], width: ["button"], backgroundControl: false,\n});\nconsole.log(editor.getConfiguration().json);\n// When the host is removed:\neditor.destroy();' }),
];
colorEntries.push(
  entry('ColorMarker', 'Options', 'One controlled marker supplied to ColorWheel.markers. Position follows HSV, while hex supplies its displayed background.', [
    f('id', 'string', 'None', 'Unique identifier used by activeId and marker callbacks.', '{ id: "brand" }', true),
    f('color.h', 'number: hue in degrees', 'None', 'Controls the marker angle. Use normalized hue from 0 to 360.', '{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }', true),
    f('color.s', 'number: 0 to 100', 'None', 'Controls distance from the center. Zero sits in the center and 100 on the edge.', '{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }', true),
    f('color.v', 'number: 0 to 100', 'None', 'Brightness retained when the marker is edited.', '{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }', true),
    f('color.hex', 'Opaque HEX string', 'None', 'Color displayed on the marker. Keep it in sync with its HSV coordinates.', '{ color: { h: 220, s: 60, v: 80, hex: "#527ACC" } }', true),
    f('label', 'string', 'No text', 'Text inside a marker. An omitted label or a single-marker list uses the smaller dot shape.', '{ label: "B" }'),
    f('ariaLabel', 'string', 'Select + id + marker', 'Accessible button name independent of the visible marker label.', '{ ariaLabel: "Edit brand color" }'),
  ], core('color-picker', ['createColorStore', 'type ColorMarker'], 'const store = createColorStore("#527ACC");\nconst markers: ColorMarker[] = [{ id: "brand", color: store.getSnapshot(), label: "B", ariaLabel: "Edit brand color" }];\nconsole.log(markers);')),
  entry('ColorSnapshot', 'Return value', 'Immutable state returned by getSnapshot() and read by useColor(). hex is opaque and value includes alpha.', [
    f('h', 'number: 0 to 360', 'Initial color hue', 'HSV hue in degrees. Hue is retained for gray colors where it cannot be inferred from RGB.', 'store.getSnapshot().h'),
    f('s', 'number: 0 to 100', 'Initial color saturation', 'HSV saturation as a percentage.', 'store.getSnapshot().s'),
    f('v', 'number: 0 to 100', 'Initial color brightness', 'HSV brightness as a percentage.', 'store.getSnapshot().v'),
    f('hex', 'Opaque #RRGGBB string', 'Initial RGB color', 'Opaque base used for channel conversions and gradient rendering.', 'store.getSnapshot().hex'),
    f('value', '#RRGGBB or #RRGGBBAA string', 'Initial color including alpha', 'Full selected color ready for a CSS hex value.', 'store.getSnapshot().value'),
    f('alpha', 'number: 0 to 1', 'Parsed from initial hex', 'Opacity fraction. Independent from HSV channels.', 'store.getSnapshot().alpha'),
    f('format', formats, "'hex'", 'The format followed by ColorInput and format controls.', 'store.getSnapshot().format'),
    f('view', "'area' | 'wheel'", "'area'", 'The layout followed by ColorSurface.', 'store.getSnapshot().view'),
    f('disabled', 'boolean', 'false', 'Editing state used by the provider and picking surface.', 'store.getSnapshot().disabled'),
  ], core('color-picker', ['createColorStore'], 'const store = createColorStore("#5268E080", "rgb", "wheel");\nconst { hex, value, alpha, format, view } = store.getSnapshot();\nconsole.log(hex, value, alpha, format, view);')),
);
themeEntries.push(
  entry('Theme', 'Return value', 'The complete data object used by providers, presets, loaders and persistence. Generate one with generateTheme(), or validate supplied data with parseTheme().', [
    f('id', 'Non-empty string, at most 128 characters', 'Generated from seed', 'Stable identifier used by preset selection.', 'theme.id'),
    f('name', 'string, at most 200 characters', 'Suggested color name', 'Human-readable theme title. It may be customized.', 'theme.name'),
    f('nameSource', "'suggested' | 'custom' | undefined", 'Set by generation / naming', 'custom preserves the name as primary changes. suggested allows automatic naming.', 'theme.nameSource'),
    f('backgroundMode', "'neutral' | 'tinted' | 'preserve' | undefined", 'neutral for a new generated theme', 'Controls how surface colors respond to primary edits. Missing mode is treated as preserve by the context.', 'theme.backgroundMode'),
    f('harmony', harmony + ' | undefined', "'analogous' for a new theme", 'Formula used when secondary and accent are explicitly regenerated.', 'theme.harmony'),
    f('structure.userPreset.primary', 'Palette', 'Generated primary shades', 'Main color palette, including shade keys, DEFAULT and foreground.', 'theme.structure.userPreset.primary[500]'),
    f('structure.userPreset.secondary', 'Palette', 'Generated secondary shades', 'Supporting palette with the same keys as primary.', 'theme.structure.userPreset.secondary.DEFAULT'),
    f('structure.userPreset.accent', 'Palette', 'Generated accent shades', 'Emphasis palette with the same keys as primary.', 'theme.structure.userPreset.accent.foreground'),
    f('Palette shade keys', shades, 'Generated HSL channels', 'Each numeric shade contains HSL channels without the hsl() wrapper. DEFAULT is the base color, and foreground is its contrasting text color.', '`hsl(${theme.structure.userPreset.primary[500]})`'),
    f('structure.websitePreset.background', "Record<'light' | 'dark', string>", 'Generated surfaces', 'Light and dark background colors stored as HSL channel strings.', 'theme.structure.websitePreset.background.dark'),
    f('structure.websitePreset.foreground', "Record<'light' | 'dark', string>", 'Generated text colors', 'Light and dark foreground colors stored as HSL channel strings.', 'theme.structure.websitePreset.foreground.light'),
    f('structure.websitePreset.border.radius', 'Record<Target, number: 0 to 1000>', '0.5 for every target', 'Corner radius in rem for DEFAULT, input, card, popover, button, table and picker.', 'theme.structure.websitePreset.border.radius.card'),
    f('structure.websitePreset.border.width', 'Record<Target, number: 0 to 1000>', '1 for every target', 'Border thickness in px for DEFAULT, input, card, popover, button, table and picker.', 'theme.structure.websitePreset.border.width.button'),
  ], core('theme-studio', ['generateTheme', 'parseTheme'], 'const theme = parseTheme(generateTheme("#5268E0", { name: "Brand blue" }));\nconsole.log(theme.name, theme.structure.userPreset.primary.DEFAULT);')),
  entry('createThemePickerStore / ThemePickerStore', 'Methods', 'A controller for active role, visible roles and layout. Create it with createThemePickerStore(themeStore, options), using the options documented under ThemePicker.', [
    f('mount()', '() => cleanup', 'Not mounted', 'Starts theme synchronization and registers editable roles. The ThemePicker component handles this automatically.', 'const unmount = picker.mount()'),
    f('getSnapshot()', '() => ThemePickerSnapshot', 'Current picker state', 'Returns roles, activeRole, view and colors. colors is a record of ColorSnapshot values for all theme roles, even when some are not visible.', 'picker.getSnapshot().activeRole'),
    f('getServerSnapshot()', '() => ThemePickerSnapshot', 'Initial picker state', 'Returns the original seed for server rendering and hydration.', 'picker.getServerSnapshot().roles'),
    f('subscribe(listener)', '(() => void) => cleanup', 'None', 'Notifies after role, view, selection or color changes.', 'const stop = picker.subscribe(() => console.log(picker.getSnapshot()))'),
    f('setRoles(roles)', `readonly (${role})[]`, 'None', 'Replaces the visible editable roles. Requires at least one unique role. If activeRole is removed, the first remaining role becomes active.', 'picker.setRoles(["primary", "accent"])'),
    f('selectRole(role)', role, 'None', 'Changes which color feeds the shared brightness and input controls. The role must be currently selected.', 'picker.selectRole("accent")'),
    f('setView(view)', "'area' | 'wheel' | 'shared-wheel'", 'None', 'Changes surface layout without changing theme colors.', 'picker.setView("wheel")'),
    f('setHSV(role, patch)', '(Role, Partial<{ h, s, v }>) => void', 'None', 'Edits one role and synchronizes its palette with the theme store.', 'picker.setHSV("accent", { h: 30 })'),
    f('activeColor', 'ColorStore', 'Current active role', 'A stable color-store bridge used by the input and slider composition. It follows role changes.', 'picker.activeColor.getValue("hex")'),
  ], themeCore('const picker = createThemePickerStore(store, { roles: ["primary", "accent"], view: "shared-wheel" });\nconst unmount = picker.mount();\npicker.selectRole("accent");\npicker.setHSV("accent", { h: 30 });\nunmount();', ['createThemePickerStore'])),
);
themeEntries.push(
  entry('themeConfiguration', 'Function', 'Builds export data from a theme snapshot, using an explicit selection or the current context selection.', [
    f('snapshot (argument 1)', 'ThemeSnapshot', 'None', 'The state to export. Use getSnapshot() for current data or getServerSnapshot() for the initial server seed.', 'themeConfiguration(store.getSnapshot())', true),
    f('selection (argument 2)', 'TokenSelection', 'snapshot.selection / full theme', 'Overrides context export fields. See TokenSelection for each nested key and its accepted values.', 'themeConfiguration(store.getSnapshot(), { roles: ["primary"], width: ["button"] })'),
    f('return value', 'ThemeConfiguration', 'Selected export', 'Contains theme, sourceTheme, mode, modePreference, systemMode, tokens, css and json.', 'const config = themeConfiguration(store.getSnapshot())'),
  ], themeCore('const config = themeConfiguration(store.getSnapshot(), { roles: ["primary"], width: ["button"] });\nconsole.log(config.json, config.css);', ['themeConfiguration'])),
  entry('mergeThemeConfiguration', 'Function', 'Applies selected export fields to a complete base theme, preserving fields absent from the export.', [
    f('base (argument 1)', 'Theme', 'None', 'Full theme that supplies omitted palettes, geometry and appearance data.', 'mergeThemeConfiguration(store.getSnapshot().theme, config.json)', true),
    f('value (argument 2)', 'JSON string | { theme: SelectedTheme }', 'None', 'Serialized editor output or a parsed object with a theme field. Unsupported roles, geometry keys or invalid values are rejected.', 'mergeThemeConfiguration(base, JSON.parse(config.json))', true),
    f('return value', 'Theme', 'Validated merged theme', 'A complete theme ready for setTheme(), presets or persistence. The separate appearance preference is not applied by this function.', 'store.setTheme(mergeThemeConfiguration(base, config.json))'),
  ], themeCore('const base = store.getSnapshot().theme;\nconst config = themeConfiguration(store.getSnapshot(), { roles: ["primary"] });\nstore.setTheme(mergeThemeConfiguration(base, config.json));', ['themeConfiguration', 'mergeThemeConfiguration'])),
  entry('browserStorage / browserModeStorage', 'Function', 'Creates lazy browser localStorage adapters. Constructing either adapter during SSR does not access the browser.', [
    f('browserStorage key', 'string', "'@salyra-ui/theme-studio'", 'Storage key for the full versioned theme payload. It receives changes from other tabs on the same origin.', 'browserStorage("app:theme")'),
    f('browserModeStorage key', 'string', "'theme-studio:mode'", 'Independent storage key for the system, light or dark preference.', 'browserModeStorage("app:mode")'),
    f('browserStorage return value', 'ThemeStorage', 'New storage adapter', 'Supplies read(), write(theme) and subscribe(listener). Access happens when the provider lifecycle mounts.', 'storage: browserStorage("app:theme")'),
    f('browserModeStorage return value', 'ModeStorage', 'New storage adapter', 'Supplies read(), write(mode) and subscribe(listener). Pass false instead of this adapter to disable appearance persistence.', 'modeStorage: browserModeStorage("app:mode")'),
  ], core('theme-studio', ['createThemeStore', 'generateTheme', 'browserStorage', 'browserModeStorage'], 'const options = {\n  fallbackTheme: generateTheme("#5268E0"),\n  storage: browserStorage("app:theme"), modeStorage: browserModeStorage("app:mode"),\n};\nconst store = createThemeStore(options);\nconsole.log(store.getSnapshot());')),
  entry('mountThemeStore', 'Function', 'Mounts cache writes, loading, mode persistence and refresh listeners for consumers without a framework provider.', [
    f('store (argument 1)', 'ThemeStore', 'None', 'Store whose lifecycle should start. Framework providers call this helper automatically.', 'mountThemeStore(store)', true),
    f('storage (argument 2)', 'ThemeStorage', 'No theme writes', 'Theme cache used for writes and same-origin subscription. Pass the same storage adapter used in createThemeStore options.', 'mountThemeStore(store, options.storage)'),
    f('options (argument 3)', '{ modeStorage?, revalidateOnFocus?, revalidateIntervalMs? }', '{}', 'Enables appearance persistence and refresh behavior. Keys use the same values as ThemeProvider options. Loader options belong to createThemeStore.', 'mountThemeStore(store, options.storage, options)'),
    f('return value', '() => void', 'Cleanup', 'Stops requests, timers and listeners, then flushes any queued theme write. Call on unmount.', 'cleanup()'),
  ], core('theme-studio', ['createThemeStore', 'generateTheme', 'browserStorage', 'mountThemeStore'], 'const options = { theme: generateTheme("#5268E0"), storage: browserStorage("app:theme"), modeStorage: false as const };\nconst store = createThemeStore(options);\nconst cleanup = mountThemeStore(store, options.storage, options);\n// When the consumer unmounts:\ncleanup();')),
);
export function referenceEntries(kit: Kit): ApiEntry[] {
  return kit === 'color-picker' ? colorEntries : themeEntries;
}
