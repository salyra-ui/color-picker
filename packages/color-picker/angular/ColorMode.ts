import { Component, ContentChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { colorFormats } from '../core';
import { useColorStore } from './context';
import { useColor } from './context';
@Component({
  selector: 'cp-mode',
  standalone: true,
  imports: [NgTemplateOutlet],
  template: `<button
    type="button"
    class="cp-mode"
    [attr.aria-label]="
      'Next color format (' + state().format.toUpperCase() + ')'
    "
    (click)="next()"
  >
    @if (content) {
      <ng-container
        [ngTemplateOutlet]="content"
        [ngTemplateOutletContext]="{ $implicit: state().format }"
      />
    } @else {
      Next format
    }
  </button>`,
})
export class ColorMode {
  @ContentChild(TemplateRef) content?: TemplateRef<unknown>;
  readonly store = useColorStore();
  readonly state = useColor();
  next() {
    this.store.setFormat(
      colorFormats[
        (colorFormats.indexOf(this.state().format) + 1) % colorFormats.length
      ],
    );
  }
}
