import { Component } from '@angular/core';
import { colorPreviewStyle } from '../core';
import { useColor } from './context';
@Component({
  selector: 'cp-preview',
  standalone: true,
  template: `<output
    class="cp-preview"
    [style]="colorPreviewStyle(state().value)"
    [attr.aria-label]="'Selected color ' + state().value"
    >{{ state().value }}</output
  >`,
})
export class ColorPreview {
  readonly colorPreviewStyle = colorPreviewStyle;
  readonly state = useColor();
}
