import {
  Directive,
  Input,
  Output,
  EventEmitter,
  inject,
  DestroyRef,
  afterNextRender,
  signal,
  type OnChanges,
} from '@angular/core';
import {
  createColorEyeDropper,
  type ColorEyeDropperController,
  type ColorEyeDropperState,
} from '../core';
import { useColor, useColorStore } from './context';
@Directive({
  selector: 'button[cpEyeDropper]',
  standalone: true,
  host: {
    '[attr.type]': '"button"',
    '[attr.data-cp-part]': '"eyedropper"',
    '[attr.data-cp-supported]': 'eyeState().supported',
    '[attr.aria-busy]': 'eyeState().pending',
    '[disabled]':
      'disabled || color().disabled || !eyeState().supported || eyeState().pending',
    '(click)': 'pick($event)',
  },
})
export class ColorEyeDropper implements OnChanges {
  @Input() preserveAlpha = true;
  @Input() disabled = false;
  @Output() colorPick = new EventEmitter<string>();
  @Output() colorPickError = new EventEmitter<Error>();
  readonly color = useColor();
  readonly eyeState = signal<ColorEyeDropperState>({
    supported: false,
    pending: false,
    error: undefined,
  });
  private store = useColorStore();
  private eye?: ColorEyeDropperController;
  constructor() {
    let stop: (() => void) | undefined;
    afterNextRender(() => {
      const eye = (this.eye = createColorEyeDropper(this.store));
      stop = eye.subscribe(() => this.eyeState.set(eye.getSnapshot()));
      eye.mount();
    });
    inject(DestroyRef).onDestroy(() => {
      stop?.();
      this.eye?.destroy();
    });
  }
  ngOnChanges() {
    if (this.disabled) this.eye?.cancel();
  }
  pick(event: Event) {
    if (event.defaultPrevented || this.disabled) return;
    void this.eye
      ?.pick({ preserveAlpha: this.preserveAlpha })
      .then((hex) => {
        if (hex) this.colorPick.emit(hex);
      })
      .catch((error) => this.colorPickError.emit(error));
  }
}
