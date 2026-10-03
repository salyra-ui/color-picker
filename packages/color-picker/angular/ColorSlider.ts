import { Component, Input } from '@angular/core';
import {
  sliderLabels,
  type SliderChannel,
  type ColorPartClasses,
} from '../core';
import { ColorRange } from './primitives';
@Component({
  selector: 'cp-slider',
  standalone: true,
  imports: [ColorRange],
  template: ` <label
    data-cp-part="slider"
    [attr.data-channel]="channel"
    [class]="
      'cp-slider ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
  >
    {{ label || labels[channel]
    }}<input
      [cpSlider]="channel"
      [attr.aria-label]="label || labels[channel]"
      [class]="(classes.track ?? '') + ' ' + (classes.input ?? '')"
  /></label>`,
})
export class ColorSlider {
  @Input() channel: SliderChannel = 'h';
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() label = '';
  readonly labels = sliderLabels;
}
