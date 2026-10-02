import {
  Component,
  Input,
  afterRenderEffect,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { colorViews, type ColorView } from '../core';
import { useColorStore } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-view-select',
  standalone: true,
  template: `<label class="cp-format"
    >{{ label
    }}<select #select (change)="change($event)">
      @for (view of views; track view) {
        <option
          [value]="view"
          [attr.selected]="state().view === view ? '' : null"
        >
          {{ view === 'area' ? 'Rectangle' : 'Wheel' }}
        </option>
      }
    </select></label
  >`,
})
export class ColorViewSelect {
  @ViewChild('select') select!: ElementRef<HTMLSelectElement>;
  constructor() {
    afterRenderEffect(() => {
      this.select.nativeElement.value = this.state().view;
    });
  }
  @Input() label = 'Picker view';
  readonly store = useColorStore();
  readonly state = useColor();
  readonly views = colorViews;
  change(event: Event) {
    this.store.setView((event.target as HTMLSelectElement).value as ColorView);
  }
}
