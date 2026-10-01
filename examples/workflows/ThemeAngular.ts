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
  ThemeProvider,
  ThemePicker,
  ThemeName,
  ThemeRadius,
  ThemeBorderWidth,
  ThemeHarmony,
  ThemeBackground,
  ThemeSelect,
} from '@salyra-ui/theme-studio/angular';
import { createDemo } from './theme-controller';
@Component({
  selector: 'theme-workflow',
  standalone: true,
  imports: [
    ThemeProvider,
    ThemePicker,
    ThemeName,
    ThemeRadius,
    ThemeBorderWidth,
    ThemeHarmony,
    ThemeBackground,
    ThemeSelect,
  ],
  template: `<div #root class="recipe">
    <tk-provider [store]="demo.editor.store" [options]="{ modeStorage: false }">
      <tk-picker view="shared-wheel" /><tk-name /><tk-radius
        target="card"
      /><tk-border-width target="card" /> <tk-harmony /><tk-background />
      <tk-select
        [themes]="view().collection.recent"
        label="Recent themes"
      /><tk-select
        [themes]="view().collection.favorites"
        label="Favorite themes"
      />
    </tk-provider>
    <label
      ><input
        type="checkbox"
        [checked]="view().session.locked.includes('accent')"
        (change)="demo.editor.setLocked('accent', checked($event))"
      />Lock accent during generation</label
    >
    <label
      ><input
        type="checkbox"
        [checked]="view().session.live"
        (change)="demo.editor.setLive(checked($event))"
      />Apply changes live</label
    >
    <div class="recipe-actions">
      <button
        type="button"
        [disabled]="!view().history.canUndo"
        (click)="demo.editor.history.undo()"
      >
        Undo
      </button>
      <button
        type="button"
        [disabled]="!view().history.canRedo"
        (click)="demo.editor.history.redo()"
      >
        Redo
      </button>
      <button
        type="button"
        [disabled]="!view().session.dirty || view().session.conflict"
        (click)="demo.apply()"
      >
        Apply
      </button>
      <button
        type="button"
        [disabled]="!view().session.dirty && !view().session.conflict"
        (click)="demo.editor.cancel()"
      >
        Cancel
      </button>
      <button
        type="button"
        (click)="
          demo.collection.toggleFavorite(demo.target.getSnapshot().theme)
        "
      >
        Favorite applied theme
      </button>
    </div>
    <p role="status">
      {{
        view().session.conflict
          ? 'The applied theme changed. Cancel to load it.'
          : view().session.dirty
            ? 'Unapplied changes'
            : 'Up to date'
      }}
    </p>
    <p>
      Primary text contrast: {{ view().contrast.ratio.toFixed(2) }}:1 ·
      {{ view().contrast.aa ? 'AA passes' : 'AA fails' }}
    </p>
    <tk-provider [store]="demo.target" [options]="{ modeStorage: false }"
      ><article class="recipe-preview">
        <h2>Applied theme</h2>
        <button type="button">Example button</button>
      </article></tk-provider
    >
    <details>
      <summary>Tailwind CSS</summary>
      <pre class="recipe-output">{{ view().tailwind }}</pre>
    </details>
  </div>`,
})
export class ThemeWorkflow {
  readonly demo = createDemo();
  readonly view = signal(this.demo.getSnapshot());
  @ViewChild('root') root!: ElementRef<HTMLDivElement>;
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
