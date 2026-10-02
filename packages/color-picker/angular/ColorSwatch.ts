import { Component, Input } from '@angular/core';
import { useColorStore } from './context';
@Component({
  selector: 'cp-swatch',
  standalone: true,
  template: `<button
    type="button"
    class="cp-swatch"
    [attr.aria-label]="label || value"
    [style.background]="value"
    (click)="store.setHex(value)"
  ></button>`,
})
export class ColorSwatch {
  @Input() value = '#6366F1';
  @Input() label = '';
  readonly store = useColorStore();
}
