import {
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  ColorProvider,
  ColorArea,
  ColorSlider,
  ColorInput,
  ColorCollection,
} from '@salyra-ui/color-picker/angular';
import { createDemo } from './color-controller';
@Component({
  selector: 'color-workflow',
  standalone: true,
  imports: [ColorProvider, ColorArea, ColorSlider, ColorInput, ColorCollection],
  template: `<form
    #root
    class="recipe"
    (submit)="$event.preventDefault(); demo.submit(root)"
  >
    <cp-provider [store]="demo.store"
      ><cp-area /><cp-slider channel="h" /><cp-slider
        channel="alpha" /><cp-input /><cp-collection
        [collection]="demo.collection"
        kind="favorites"
        label="Favorite colors" /><cp-collection [collection]="demo.collection"
    /></cp-provider>
    <div class="recipe-actions">
      <button
        type="button"
        (click)="demo.collection.remember(view().color.value)"
      >
        Save color</button
      ><button
        type="button"
        (click)="demo.collection.toggleFavorite(view().color.value)"
      >
        Toggle favorite</button
      ><button
        type="button"
        [disabled]="!view().history.canUndo"
        (click)="demo.history.undo()"
      >
        Undo</button
      ><button
        type="button"
        [disabled]="!view().history.canRedo"
        (click)="demo.history.redo()"
      >
        Redo</button
      ><button type="reset">Reset</button><button type="submit">Submit</button>
    </div>
    <p>
      Text on white: {{ view().contrast.ratio.toFixed(2) }}:1 ·
      {{ view().contrast.aa ? 'AA passes' : 'AA fails' }}
    </p>
    <output class="recipe-output" aria-live="polite">{{
      view().submitted
    }}</output>
  </form>`,
})
export class ColorWorkflow {
  readonly demo = createDemo();
  readonly view = signal(this.demo.getSnapshot());
  @ViewChild('root') root!: ElementRef<HTMLFormElement>;
  checked(event: Event) {
    return (event.target as HTMLInputElement).checked;
  }
  constructor() {
    const stop = this.demo.subscribe(() =>
      this.view.set(this.demo.getSnapshot()),
    );
    let detach: (() => void) | undefined;
    afterNextRender(() => {
      detach = this.demo.mount(this.root.nativeElement);
    });
    inject(DestroyRef).onDestroy(() => {
      stop();
      detach?.();
      this.demo.destroy();
    });
  }
}
