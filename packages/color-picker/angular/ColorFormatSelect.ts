import {
  Component,
  Input,
  afterRenderEffect,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { colorFormats, type ColorFormat } from '../core';
import { useColorStore } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-format-select',
  standalone: true,
  template: `<label class="cp-format"
    >{{ label
    }}<select #select (change)="change($event)">
      @for (format of formats; track format) {
        <option
          [value]="format"
          [attr.selected]="state().format === format ? '' : null"
        >
          {{ format.toUpperCase() }}
        </option>
      }
    </select></label
  >`,
})
export class ColorFormatSelect {
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  constructor() {
    afterRenderEffect(() => {
      this.select.nativeElement.value = this.state().format;
    });
  }
  @Input() label = 'Color format';
  readonly store = useColorStore();
  readonly state = useColor();
  readonly formats = colorFormats;
  change(event: Event) {
    this.store.setFormat(
      (event.target as HTMLSelectElement).value as ColorFormat,
    );
  }
}
