import type { ApiEntry, ApiField } from './reference-data';
import type { Kit } from './snippets';

// Aliases are searchable so individual imports lead to the same documented behavior.
export const componentAliases: Record<Kit, Record<string, string[]>> = {
  'color-picker': {
    'ColorPicker.Root': ['ColorRoot', 'ColorPicker'],
    'ColorPicker.Area / Wheel': ['ColorPlane', 'ColorWheelSurface'],
    'ColorPicker.Thumb / Marker': ['ColorThumb', 'ColorMarkerThumb'],
    'ColorPicker.Slider': ['ColorRange'],
    'ColorPicker.Input / ChannelInput': ['ColorField'],
    'ColorPicker.FormatTrigger': ['ColorFormatTrigger'],
    ColorProvider: ['ColorProvider'],
    ColorArea: ['ColorArea'],
    ColorWheel: ['ColorWheel'],
    ColorSlider: ['ColorSlider'],
    ColorInput: ['ColorInput'],
    ColorChannelInput: ['ColorChannelInput'],
    ColorTextInput: ['ColorTextInput'],
    ColorAlphaInput: ['ColorAlphaInput'],
    ColorFormatSelect: ['ColorFormatSelect'],
    ColorMode: ['ColorMode'],
    'ColorEyeDropper / ColorPicker.EyeDropper': ['ColorEyeDropper'],
    'ColorViewSelect / ColorSurface': ['ColorViewSelect', 'ColorSurface'],
    'ColorSwatch / ColorPreview': ['ColorSwatch', 'ColorPreview'],
    ColorCollection: ['ColorCollection'],
    'useColorStore / useColor': ['useColorStore', 'useColor'],
    'Context setup': [
      'provideColor',
      'watchColor',
      'ColorContext',
      'ColorSurfaceContext',
      'colorPickerPrimitives',
    ],
  },
  'theme-studio': {
    'ThemeStudio.Root / Scope': [
      'ThemeRoot',
      'ThemeVariableScope',
      'ThemeStudio',
    ],
    'ThemeStudio.PickerRoot': ['ThemePickerRoot'],
    'ThemeStudio.RoleTrigger': ['ThemeRoleTrigger'],
    'ThemeStudio.Wheel': ['ThemePickerWheel'],
    'ThemeStudio.GeometryInput': ['ThemeGeometryInput'],
    ThemeProvider: ['ThemeProvider'],
    ThemePicker: ['ThemePicker'],
    'ThemeGenerator / ThemeColor': ['ThemeGenerator', 'ThemeColor'],
    ThemeHarmony: ['ThemeHarmony'],
    ThemeBackground: ['ThemeBackground'],
    'ThemeBorder / ThemeRadius / ThemeBorderWidth': [
      'ThemeBorder',
      'ThemeRadius',
      'ThemeBorderWidth',
    ],
    ThemePalette: ['ThemePalette'],
    ThemeMode: ['ThemeMode'],
    useThemeMode: ['useThemeMode'],
    ThemeName: ['ThemeName'],
    'ThemeSelect / ThemeSwatch': ['ThemeSelect', 'ThemeSwatch'],
    'ThemeLoading / ThemeReady / ThemeError': [
      'ThemeLoading',
      'ThemeReady',
      'ThemeError',
    ],
    ThemeExport: ['ThemeExport'],
    ThemeWheel: ['ThemeWheel'],
    'useThemeStore / useTheme': ['useThemeStore', 'useTheme'],
    'useThemePickerStore / useThemePicker': [
      'useThemePickerStore',
      'useThemePicker',
    ],
    'Context setup': [
      'provideTheme',
      'watchTheme',
      'provideThemePicker',
      'ThemeContext',
      'ThemePickerContext',
      'themeStudioPrimitives',
    ],
  },
};
const field = (
  key: string,
  type: string,
  fallback: string,
  description: string,
  example: string,
): ApiField => ({
  key,
  type,
  default: fallback,
  description,
  example,
  required: fallback === 'Required',
});
const entry = (
  name: string,
  kind: ApiEntry['kind'],
  description: string,
  fields: ApiField[],
  kit: Kit,
  imports: string,
  code: string,
  note?: string,
): ApiEntry => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  kind,
  description,
  fields,
  note,
  example: {
    file: 'Context.tsx',
    code: `import { ${imports} } from '@salyra-ui/${kit}/react';\n\n${code}`,
  },
});
const reactiveNote =
  'Call context helpers inside a descendant component, not the component that creates the Root. React returns a snapshot and rerenders on changes. Svelte returns a readable store, accessed with $state in markup. Vue returns a shallow ref, accessed with state.value in setup and unwrapped in templates. Angular returns a readonly signal, read with state(). Call Svelte helpers during component initialization, Vue helpers in setup and Angular helpers in an injection context. Astro and Vanilla use store.getSnapshot() and store.subscribe() in browser code instead of these hooks.';
export function contextReferenceEntries(kit: Kit): ApiEntry[] {
  const color = kit === 'color-picker',
    prefix = color ? 'Color' : 'Theme';
  const result: ApiEntry[] = [
    entry(
      `use${prefix}Store / use${prefix}`,
      'Function',
      `Read the nearest ${color ? 'ColorProvider or ColorPicker.Root' : 'ThemeProvider or ThemeStudio.Root'} context. The store provides actions and the snapshot provides reactive values.`,
      [
        field(
          `use${prefix}Store()`,
          `${prefix}Store`,
          'Nearest root',
          'Returns the stable context store. Calling outside a root throws. This helper does not subscribe or create a store.',
          `const store = use${prefix}Store()`,
        ),
        field(
          `use${prefix}()`,
          `${prefix}Snapshot (adapter-specific reactive wrapper)`,
          'Current snapshot',
          'Subscribes to changes and cleans up with the framework component. See the adapter rules below.',
          `const state = use${prefix}()`,
        ),
      ],
      kit,
      `use${prefix}Store, use${prefix}`,
      color
        ? 'export function SelectedColor() {\n  const state = useColor();\n  const store = useColorStore();\n  return <button onClick={() => store.setHex("#277D59")}>{state.value}</button>;\n}'
        : 'export function SelectedTheme() {\n  const state = useTheme();\n  const store = useThemeStore();\n  return <button onClick={() => store.setMode("dark")}>{state.theme.name}</button>;\n}',
      reactiveNote,
    ),
  ];
  if (!color)
    result.push(
      entry(
        'useThemePickerStore / useThemePicker',
        'Function',
        'Read the active role and controller inside ThemeStudio.PickerRoot. Theme context alone is not a picker context.',
        [
          field(
            'useThemePickerStore()',
            'ThemePickerStore',
            'Nearest PickerRoot',
            'Returns actions such as selectRole(), setRoles(), setHSV() and activeColor. Throws outside a picker root.',
            'const picker = useThemePickerStore()',
          ),
          field(
            'useThemePicker()',
            'ThemePickerSnapshot (adapter-specific reactive wrapper)',
            'Current picker snapshot',
            'Reads roles, activeRole, view and colors. Each color snapshot contains its own disabled state. Uses the same adapter subscription rules as useTheme().',
            'const state = useThemePicker()',
          ),
        ],
        kit,
        'useThemePickerStore, useThemePicker',
        'export function ActiveRole() {\n  const picker = useThemePickerStore();\n  const state = useThemePicker();\n  return <button onClick={() => picker.selectRole(state.roles[0])}>{state.activeRole}</button>;\n}',
        reactiveNote,
      ),
      entry(
        'ThemeWheel',
        'Component',
        'Ready-made shared wheel driven by an explicit picker controller. Use ThemeStudio.Wheel when you want native attributes, custom classes and marker children.',
        [
          field(
            'picker',
            'ThemePickerStore',
            'Required',
            'Use the same mounted picker as your role controls. This component subscribes to it but does not mount it or own its lifecycle.',
            'picker={picker}',
          ),
        ],
        kit,
        'ThemeStudio, ThemeWheel, useThemePickerStore',
        'function Wheel() {\n  const picker = useThemePickerStore();\n  return <ThemeWheel picker={picker} />;\n}\nexport function Editor() {\n  return <ThemeStudio.Root><ThemeStudio.PickerRoot roles={["primary", "accent"]}><Wheel /></ThemeStudio.PickerRoot></ThemeStudio.Root>;\n}',
        'Available in React, Svelte, Vue and Angular. Astro uses ThemePickerWheel.astro. Vanilla uses data-tk-control="wheel" under mountThemeControls(). ThemeWheel is a preset and uses the optional package CSS.',
      ),
    );
  result.push(
    entry(
      'Context setup',
      'Function',
      'Advanced adapter helpers for supplying context from your own wrapper. Root is the usual entry point because it also owns lifecycle.',
      [
        field(
          `provide${prefix}(store)`,
          `Svelte / Vue: ${prefix}Store`,
          'No context until supplied',
          'Call during Svelte initialization or Vue setup. Supplies context only. Does not mount loading, storage or browser listeners.',
          `provide${prefix}(store)`,
        ),
        field(
          `watch${prefix}(store)`,
          `Vue: ShallowRef<${prefix}Snapshot>`,
          'Current snapshot',
          'Subscribes to an explicit store in Vue setup and unsubscribes on scope disposal. Does not require an injected root.',
          `const state = watch${prefix}(store)`,
        ),
        field(
          `${prefix}Context`,
          'Angular injectable',
          'Provided by the matching Root or Provider',
          'Infrastructure for directives and components. configure(store) changes its backing store. Use use' +
            prefix +
            'Store() in application code rather than configuring a shared service.',
          `const store = use${prefix}Store()`,
        ),
        ...(color
          ? [
              field(
                'ColorSurfaceContext',
                'Angular injectable',
                'Provided by cpArea / cpWheel',
                'Shares the surface view with cpThumb. Provided by the surface directive, not the color root.',
                '<div cpWheel><span cpThumb></span></div>',
              ),
            ]
          : [
              field(
                'provideThemePicker(picker)',
                'Svelte / Vue: ThemePickerStore',
                'No picker context until supplied',
                'Provides picker context only. A custom wrapper must also provide the active color store and mount/clean up the picker. Prefer ThemeStudio.PickerRoot.',
                'provideThemePicker(picker)',
              ),
              field(
                'ThemePickerContext',
                'Angular injectable',
                'Provided by tkPickerRoot',
                'Holds the nearest picker controller. configure(picker) changes the backing controller. Prefer useThemePickerStore() for actions.',
                'const picker = useThemePickerStore()',
              ),
            ]),
        field(
          color ? 'colorPickerPrimitives' : 'themeStudioPrimitives',
          'Angular: readonly directive array',
          'All headless directives',
          'Spread into a standalone component imports array to register the primitive directives. Ready-made components are imported separately.',
          `imports: [...${color ? 'colorPickerPrimitives' : 'themeStudioPrimitives'}]`,
        ),
      ],
      kit,
      `use${prefix}Store`,
      `export function CustomAction() {\n  const store = use${prefix}Store();\n  return <button onClick={() => store.setDisabled(true)}>Lock editing</button>;\n}`,
      'These are adapter-specific exports. provide*/watch* are Svelte or Vue helpers, injectable context classes and primitive arrays belong to Angular. React context hooks need a matching Root above the calling component. They are not Astro or Vanilla APIs.',
    ),
    entry(
      color ? 'mountColorControls' : 'mountThemeControls',
      'Function',
      'Bind existing HTML without generating a layout. Your application owns labels, classes, content and teardown.',
      [
        field(
          'root',
          'HTMLElement',
          'Required',
          'Container holding the data attributes below. Mount once and destroy before remounting or replacing its markup.',
          'document.querySelector<HTMLElement>("#editor")!',
        ),
        field(
          'store',
          `${prefix}Store`,
          'Required',
          'Existing store shared with the rest of your application.',
          `create${prefix}Store()`,
        ),
        ...(!color
          ? [
              field(
                'options',
                'ThemePickerOptions',
                '{}',
                'roles, activeRole, view, disabled and controls options for the picker controller. The function registers roles and each mounted geometry field for export.',
                '{roles:["primary"],activeRole:"primary"}',
              ),
            ]
          : []),
        field(
          'data-cp-control',
          "'area' | 'wheel' | 'slider' | 'input' | 'format'",
          'No behavior without an attribute',
          'Surfaces contain data-cp-part="thumb". Sliders use data-channel h/s/v/alpha. Inputs optionally use data-format and data-index. A format button with no data-format cycles formats.',
          '<input data-cp-control="slider" data-channel="alpha" />',
        ),
        ...(!color
          ? [
              field(
                'data-tk-control',
                "'wheel' | 'role' | 'geometry'",
                'No behavior without an attribute',
                'Role buttons use data-role. Geometry inputs use data-kind radius/width and data-target. Wheel children use data-marker-id matching selected roles. Other color controls connect to the active role.',
                '<input data-tk-control="geometry" data-kind="radius" data-target="card" />',
              ),
            ]
          : []),
        field(
          'return value',
          color
            ? '{store, destroy()}'
            : '{store, picker, getConfiguration(), destroy()}',
          'One bound editor',
          'destroy() removes subscriptions and handlers. It does not remove your HTML or stop the externally owned theme store. Theme getConfiguration() exports only registered or explicitly selected fields.',
          'controls.destroy()',
        ),
      ],
      kit,
      `create${prefix}Store`,
      `const store = create${prefix}Store();\nconsole.log(store.getSnapshot());`,
      'Vanilla export. Astro primitives use these bindings internally. Native attributes and your own click handlers stay on the actual elements. Call preventDefault() to cancel the default format or role action.',
    ),
  );
  if (!color) {
    const snapshot = entry(
      'ThemePickerSnapshot',
      'Return value',
      'Reactive picker state returned by getSnapshot() and useThemePicker(). All colors are available internally, while roles controls the visible and exported subset.',
      [
        field(
          'roles',
          "readonly ('primary' | 'secondary' | 'accent')[]",
          'Configured roles',
          'Nonempty unique list of visible roles. Switching roles does not recolor their palettes.',
          'state.roles',
        ),
        field(
          'activeRole',
          "'primary' | 'secondary' | 'accent'",
          'First configured role',
          'The selected role edited by activeColor. Always belongs to roles.',
          'state.activeRole',
        ),
        field(
          'view',
          "'area' | 'wheel' | 'shared-wheel'",
          "'shared-wheel'",
          'The selected view state. Custom compositions decide what markup to render for it.',
          'state.view',
        ),
        field(
          'colors',
          'Readonly<Record<Role, ColorSnapshot>>',
          'All three role snapshots',
          'Color, alpha, format, view and disabled state for each role. These internal snapshots are not an export selection.',
          'state.colors[state.activeRole].hex',
        ),
      ],
      kit,
      'createThemeStore, createThemePickerStore',
      'const store = createThemeStore({modeStorage:false});\nconst picker = createThemePickerStore(store,{roles:["primary"]});\nconsole.log(picker.getSnapshot().colors.primary.hex);',
    );
    snapshot.example.file = 'PickerSnapshot.ts';
    result.push(snapshot);
  }
  const mount = result.find(
    (item) =>
      item.name === (color ? 'mountColorControls' : 'mountThemeControls'),
  )!;
  mount.example = {
    file: 'NativeControls.ts',
    code: `import { create${prefix}Store, mount${prefix}Controls${color ? '' : ', bindThemeScope'} } from '@salyra-ui/${kit}/vanilla';

const root = document.createElement('section');
root.innerHTML = '${color ? '<label>Opacity<input data-cp-control="slider" data-channel="alpha" /></label>' : '<label>Primary<input data-cp-control="input" data-format="hex" /></label><label>Card corners<input data-tk-control="geometry" data-kind="radius" data-target="card" /></label>'}';
const store = create${prefix}Store(${color ? "'#5268E080'" : '{modeStorage:false}'});
${color ? '' : 'const detachScope = bindThemeScope(root, store);'}
const controls = mount${prefix}Controls(root, store${color ? '' : ', {roles:["primary"]}'});
document.body.append(root);
// When this editor is removed:
controls.destroy();
${color ? '' : 'detachScope();'}
root.remove();`,
  };
  if (!color)
    result.push(
      entry(
        'bindThemeScope',
        'Function',
        'Apply the theme variables to an existing HTML container independently of editor controls.',
        [
          field(
            'element',
            'HTMLElement',
            'Required',
            'CSS inheritance is limited to this subtree. Portals outside it need a separate scope binding.',
            'document.querySelector<HTMLElement>("#preview")!',
          ),
          field(
            'store',
            'ThemeStore',
            'Required',
            'The state used for CSS variables and data-mode, data-mode-preference, data-theme, data-theme-status and data-disabled attributes. Binding a scope does not create an isolated store.',
            'bindThemeScope(element, store)',
          ),
          field(
            'return value',
            '() => void',
            'Active subscription',
            'Call to unsubscribe and restore previous values of theme-owned CSS properties. Other inline styles are preserved. Scope data attributes are left on the element.',
            'detach()',
          ),
        ],
        kit,
        'createThemeStore, bindThemeScope',
        'const store = createThemeStore({modeStorage:false});\nconst element = document.createElement("section");\nconst detach = bindThemeScope(element, store);\nstore.setMode("dark");\ndetach();',
      ),
    );
  const scope = result.find((item) => item.name === 'bindThemeScope');
  if (scope) {
    scope.example.file = 'Scope.ts';
    scope.example.code = scope.example.code.replace('/react', '/vanilla');
  }
  return result;
}
