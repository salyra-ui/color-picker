import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  ColorEyeDropper,
  ColorField,
  ColorRange,
  ColorPlane,
  thumbPosition,
} from '@salyra-ui/color-picker/angular';
import {
  ThemeRoot,
  ThemeVariableScope,
  ThemePickerRoot,
  ThemeRoleTrigger,
  ThemeGeometryInput,
  ThemeExport,
  generateTheme,
  createThemeStore,
  createThemePickerStore,
  themePickerMarkers,
} from '@salyra-ui/theme-studio/angular';
@Component({
  selector: 'theme-composition',
  standalone: true,
  imports: [
    ThemeRoot,
    ThemeVariableScope,
    ThemePickerRoot,
    ThemeRoleTrigger,
    ThemeGeometryInput,
    ThemeExport,
    ColorEyeDropper,
    ColorField,
    ColorRange,
    ColorPlane,
  ],
  template: ` <section tkRoot [store]="store">
    <div tkScope>
      <div tkPickerRoot [picker]="picker">
        <div class="composition-editor" data-composition="theme">
          <div
            cpWheel
            class="composition-wheel"
            [cpMarkers]="markers()"
            [cpActiveId]="state().activeRole"
            (markerSelect)="select($event)"
            (markerChange)="change($event)"
          >
            @for (marker of markers(); track marker.id) {
              <button
                type="button"
                class="cp-wheel-marker"
                [attr.data-marker-id]="marker.id"
                [attr.aria-label]="marker.ariaLabel"
                [attr.aria-pressed]="state().activeRole === marker.id"
                [disabled]="state().colors[state().activeRole].disabled"
                [style.position]="'absolute'"
                [style.transform]="'translate(-50%,-50%)'"
                [style.left]="position(marker).left"
                [style.top]="position(marker).top"
                [style.background]="marker.color.hex"
              >
                {{ marker.label }}
              </button>
            }
          </div>
          <div class="composition-fields">
            <div class="composition-roles">
              <button tkRoleTrigger="primary">Brand color</button
              ><button tkRoleTrigger="accent">Highlight</button>
            </div>
            <label><span>Brightness</span><input cpSlider="v" /></label
            ><label
              ><span>Active color</span><input cpInput format="hex"
            /></label>
            <label
              ><span>Card corners in rem</span
              ><input tkGeometry="radius" target="card" /></label
            ><label
              ><span>Button border in px</span
              ><input tkGeometry="width" target="button"
            /></label>
            <button cpEyeDropper>Pick active color from screen</button>
            <article class="composition-preview">
              <h3>Live theme</h3>
              <button type="button">Continue</button>
            </article>
          </div>
        </div>
        <details>
          <summary>Selected configuration</summary>
          <tk-export />
        </details>
      </div>
    </div>
  </section>`,
})
export class ThemeComposition {
  readonly store = createThemeStore({
    theme: generateTheme('#5268E0'),
    mode: 'dark',
    modeStorage: false,
    selection: {
      roles: ['primary', 'accent'],
      radius: ['card'],
      width: ['button'],
    },
  });
  readonly picker = createThemePickerStore(this.store, {
    roles: ['primary', 'accent'],
  });
  readonly state = signal(this.picker.getSnapshot());
  constructor() {
    inject(DestroyRef).onDestroy(
      this.picker.subscribe(() => this.state.set(this.picker.getSnapshot())),
    );
  }
  readonly markers = () => themePickerMarkers(this.state());
  readonly position = (marker: ReturnType<typeof themePickerMarkers>[number]) =>
    thumbPosition(marker.color, 'wheel');
  select(id: string) {
    this.picker.selectRole(id as 'primary' | 'accent');
  }
  change(event: {
    id: string;
    hsv: Partial<{ h: number; s: number; v: number }>;
  }) {
    this.picker.setHSV(event.id as 'primary' | 'accent', event.hsv);
  }
}
