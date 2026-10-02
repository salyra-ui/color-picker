import type { ApiEntry, ApiField } from './reference-data';
const field = (
  key: string,
  type: string,
  fallback: string,
  description: string,
  example: string,
): ApiField => ({ key, type, default: fallback, description, example });

// Only differences are listed here. Native classes, labels and events remain on Angular's host.
const angular: Record<string, [string, string, string]> = {
  'ColorPicker.Root': [
    '[cpRoot], [store], [value], [disabled], (valueChange)',
    'ColorStore, HEX string, boolean, string event',
    '<section cpRoot [value]="color" (valueChange)="color=$event">...</section>',
  ],
  'ColorPicker.Area / Wheel': [
    '[cpArea] or [cpWheel], [cpMarkers], [cpActiveId], (markerSelect), (markerChange)',
    'ColorMarker[], string, string event, {id, hsv} event',
    '<div cpWheel [cpMarkers]="markers" [cpActiveId]="active" (markerSelect)="active=$event">...</div>',
  ],
  'ColorPicker.Thumb / Marker': [
    'cpThumb',
    'Native span directive',
    '<span cpThumb class="my-dot"></span>',
  ],
  'ColorPicker.Slider': [
    '[cpSlider], [disabled], aria-label',
    "'h' | 's' | 'v' | 'alpha', boolean, string",
    '<input cpSlider="alpha" aria-label="Opacity" />',
  ],
  'ColorPicker.Input / ChannelInput': [
    'cpInput, [format], [index], [disabled], aria-label',
    'ColorFormat, 0 | 1 | 2, boolean, string',
    '<input cpInput format="rgb" [index]="0" aria-label="Red" />',
  ],
  'ColorPicker.FormatTrigger': [
    'cpFormatTrigger, [format], [disabled]',
    'ColorFormat, boolean',
    '<button cpFormatTrigger format="rgb">RGB channels</button>',
  ],
  'ThemeStudio.Root / Scope': [
    'tkRoot with [store] / [options], tkScope',
    'ThemeStore / ThemeOptions',
    '<section tkRoot [store]="store"><div tkScope>...</div></section>',
  ],
  'ThemeStudio.PickerRoot': [
    'tkPickerRoot with [picker] / [options]',
    'ThemePickerStore / ThemePickerOptions',
    '<section tkPickerRoot [options]="{roles:[\'primary\']}">...</section>',
  ],
  'ThemeStudio.RoleTrigger': [
    '[tkRoleTrigger], [disabled]',
    "'primary' | 'secondary' | 'accent', boolean",
    '<button tkRoleTrigger="accent">Highlight</button>',
  ],
  'ThemeStudio.GeometryInput': [
    '[tkGeometry], [target], [disabled], aria-label',
    "'radius' | 'width', Target, boolean, string",
    '<input tkGeometry="width" target="card" aria-label="Card border" />',
  ],
};
export function withAdapterFields(entry: ApiEntry): ApiEntry {
  const binding = angular[entry.name];
  const additions: ApiField[] = [];
  if (binding)
    additions.push(
      field(
        'Angular bindings',
        binding[0] + ' / ' + binding[1],
        'Declared directive defaults',
        entry.name === 'ColorPicker.Thumb / Marker'
          ? 'cpThumb positions a single thumb. Angular has no ColorMarkerThumb export. Put your own buttons with data-marker-id inside a cpWheel with cpMarkers for multiple markers.'
          : 'Import the named directive in the standalone component imports array. Angular bindings use these names rather than the React compound component syntax. Put classes, styles, ARIA labels and event handlers on your native host element.',
        binding[2],
      ),
    );
  if (entry.name === 'ColorPicker.Root')
    additions.push(
      field(
        'Astro Root props',
        'value?: HEX string, disabled?: boolean, native div attributes',
        "'#6366F1' / false",
        'ColorRoot.astro seeds a cp-provider and a cp-compose binding boundary. It accepts serializable props and a slot, not a store or change callback. Use the custom element store in browser code. Angular uses value rather than defaultValue. Vue also accepts modelValue through v-model.',
        '<ColorRoot value="#5268E080"><ColorField value="#5268E080" /></ColorRoot>',
      ),
    );
  if (
    ['ColorPicker.Slider', 'ColorPicker.Input / ChannelInput'].includes(
      entry.name,
    )
  )
    additions.push(
      field(
        'Astro value',
        'HEX string',
        "'#6366F1'",
        'Seeds the native range or input during server rendering. Match the root seed. A form value attribute is a color seed here, rather than the slider channel number.',
        'value="#5268E080"',
      ),
    );
  if (entry.name === 'ThemeStudio.Wheel')
    additions.push(
      field(
        'Angular / Vanilla wheel',
        'data-tk-control="wheel" with data-marker-id buttons',
        'Your own markup',
        'There is no Angular ThemePickerWheel directive. Use the ready ThemeWheel with an explicit picker, or mountThemeControls() on an owned DOM subtree with wheel and marker attributes. Destroy those bindings with the owning component.',
        '<div data-tk-control="wheel"><button data-marker-id="primary">Brand</button></div>',
      ),
    );
  return additions.length
    ? { ...entry, fields: [...entry.fields, ...additions] }
    : entry;
}
