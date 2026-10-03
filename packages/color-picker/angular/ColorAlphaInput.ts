import {
  Component,
  Input,
  inject,
  DestroyRef,
  afterNextRender,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { bindAlphaInput, type ColorPartClasses } from '../core';
import { useColorStore } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-alpha-input',
  standalone: true,
  template: `<label
    data-cp-part="alpha-input"
    [class]="
      'cp-alpha-input cp-channel ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
    >{{ label
    }}<span class="cp-channel-field"
      ><input
        #input
        data-cp-part="input"
        [class]="classes.input ?? ''"
        type="number"
        min="0"
        max="100"
        step="0.1"
        [attr.value]="initial"
        [attr.aria-label]="label"
      /><span>%</span></span
    ></label
  >`,
})
export class ColorAlphaInput {
  @Input() label = 'Alpha';
  @Input() className = '';
  @Input() classes: ColorPartClasses = {};
  @ViewChild('input') input!: ElementRef<HTMLInputElement>;
  readonly store = useColorStore();
  readonly state = useColor();
  get initial() {
    return Number((this.state().alpha * 100).toFixed(1));
  }
  constructor() {
    let cleanup: (() => void) | undefined;
    afterNextRender(
      () => (cleanup = bindAlphaInput(this.input.nativeElement, this.store)),
    );
    inject(DestroyRef).onDestroy(() => cleanup?.());
  }
}
