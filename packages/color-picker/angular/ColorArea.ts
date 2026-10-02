import { Component, Input } from '@angular/core';
import type { ColorPartClasses } from '../core';
import { ColorPlane, ColorThumb } from './primitives';
@Component({
  selector: 'cp-area',
  standalone: true,
  imports: [ColorPlane, ColorThumb],
  template: ` <div
    cpArea
    [class]="'cp-area ' + className + ' ' + (classes.root ?? '')"
    [attr.aria-label]="label"
    style="width:100%;min-height:var(--cp-area-height,180px)"
  >
    <span cpThumb [class]="'cp-thumb ' + (classes.thumb ?? '')"
      ><span data-cp-part="thumb-text" [class]="classes.text ?? ''"
        >{{ thumbText }}<ng-content select="[cpThumb]" /></span
    ></span>
  </div>`,
})
export class ColorArea {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() label = 'Saturation and brightness';
  @Input() thumbText = '';
}
