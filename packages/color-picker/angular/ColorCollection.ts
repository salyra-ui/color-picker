import {
  Component,
  Input,
  inject,
  signal,
  DestroyRef,
  type OnChanges,
} from '@angular/core';
import { useColorStore } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-collection',
  standalone: true,
  template: `<fieldset
    [class]="'cp-collection ' + (classes.root || '')"
    [disabled]="color().disabled"
  >
    <legend [class]="classes.label || ''">{{ label }}</legend>
    @for (value of state()[kind]; track value) {
      <button
        type="button"
        [class]="'cp-swatch ' + (classes.item || '')"
        [style.background]="value"
        [attr.aria-label]="value"
        (click)="store.setHex(value)"
      ></button>
    }
  </fieldset>`,
})
export class ColorCollection implements OnChanges {
  @Input({ required: true })
  collection!: import('../core').ColorCollectionStore;
  @Input() kind: 'recent' | 'favorites' = 'recent';
  @Input() label = 'Recent colors';
  @Input() classes: import('../core').ColorCollectionClasses = {};
  readonly store = useColorStore();
  readonly color = useColor();
  readonly state = signal<import('../core').ColorCollectionSnapshot>({
    recent: [],
    favorites: [],
  });
  private unsubscribe?: () => void;
  constructor() {
    inject(DestroyRef).onDestroy(() => this.unsubscribe?.());
  }
  ngOnChanges() {
    this.unsubscribe?.();
    this.state.set(this.collection.getSnapshot());
    this.unsubscribe = this.collection.subscribe(() =>
      this.state.set(this.collection.getSnapshot()),
    );
  }
}
