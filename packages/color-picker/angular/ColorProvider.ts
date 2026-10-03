import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  DestroyRef,
  type OnInit,
  type OnChanges,
} from '@angular/core';
import {
  type ColorView,
  subscribeColor,
  createColorStore,
  type ColorStore,
} from '../core';
import { ColorContext } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-provider',
  standalone: true,
  providers: [ColorContext],
  template: `<fieldset
    class="cp-provider-controls"
    [disabled]="state().disabled"
    [attr.inert]="state().disabled ? '' : null"
    [attr.aria-disabled]="state().disabled"
    [attr.data-disabled]="state().disabled"
  >
    <ng-content />
  </fieldset>`,
})
export class ColorProvider implements OnInit, OnChanges {
  @Input() value?: string;
  @Input() disabled?: boolean;
  readonly state = useColor();
  @Input() view: ColorView = 'area';
  @Input() store?: ColorStore;
  @Output() colorChange = new EventEmitter<string>();
  private context = inject(ColorContext);
  private destroyRef = inject(DestroyRef);
  ngOnInit() {
    this.context.configure(
      this.store ??
        createColorStore(this.value, 'hex', this.view, this.disabled),
    );
    if (this.disabled !== undefined)
      this.context.store.setDisabled(this.disabled);
    this.destroyRef.onDestroy(
      subscribeColor(this.context.store, (hex) => this.colorChange.emit(hex)),
    );
  }
  ngOnChanges() {
    if (this.disabled !== undefined)
      this.context.store.setDisabled(this.disabled);
    if (this.value !== undefined) this.context.store.setHex(this.value);
  }
}
