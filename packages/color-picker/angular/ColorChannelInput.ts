import { Component, Input } from '@angular/core';
import {
  channelSpecs,
  type ChannelFormat,
  type ChannelIndex,
  type ColorPartClasses,
} from '../core';
import { ColorField } from './primitives';
@Component({
  selector: 'cp-channel-input',
  standalone: true,
  imports: [ColorField],
  template: ` <label
    [class]="
      'cp-channel ' +
      className +
      ' ' +
      (classes.root ?? '') +
      ' ' +
      (classes.label ?? '')
    "
  >
    <span>{{ spec().label }}</span
    ><span class="cp-channel-field"
      ><input
        cpInput
        [format]="format"
        [index]="index"
        [class]="classes.input ?? ''"
        [attr.aria-label]="format.toUpperCase() + ' ' + spec().label"
      />
      <span aria-hidden="true">{{ spec().unit }}</span></span
    ></label
  >`,
})
export class ColorChannelInput {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() format: ChannelFormat = 'rgb';
  @Input() index: ChannelIndex = 0;
  spec() {
    return channelSpecs[this.format][this.index];
  }
}
