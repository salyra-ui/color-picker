import { Component, Input } from '@angular/core';
import type { ColorFormat, ColorPartClasses } from '../core';
import { useColor } from './context';
import { ColorField } from './primitives';
@Component({
  selector: 'cp-text-input',
  standalone: true,
  imports: [ColorField],
  template: ` <label
    [class]="
      'cp-input ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
  >
    {{ label || selectedFormat().toUpperCase()
    }}<input
      cpInput
      [format]="selectedFormat()"
      [class]="classes.input ?? ''"
      spellcheck="false"
    />
  </label>`,
})
export class ColorTextInput {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() label = '';
  @Input() format?: ColorFormat;
  readonly state = useColor();
  selectedFormat() {
    return this.format ?? this.state().format;
  }
}
