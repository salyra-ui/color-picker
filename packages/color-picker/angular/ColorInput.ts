import { Component, Input } from '@angular/core';
import {
  type ColorPartClasses,
  type ChannelFormat,
  type ChannelIndex,
  type ColorFormat,
} from '../core';
import { useColor } from './context';
import { ColorTextInput } from './ColorTextInput';
import { ColorChannelInput } from './ColorChannelInput';
@Component({
  selector: 'cp-input',
  standalone: true,
  imports: [ColorTextInput, ColorChannelInput],
  template: `@if (selectedFormat() === 'hex') {
      <cp-text-input
        format="hex"
        [classes]="classes"
        [className]="className"
        [label]="label || 'HEX'"
      />
    } @else {
      <div
        class="cp-channels"
        role="group"
        [attr.aria-label]="label || selectedFormat().toUpperCase()"
      >
        @for (index of indices; track index) {
          <cp-channel-input
            [classes]="classes"
            [className]="className"
            [format]="channelFormat()"
            [index]="index"
          />
        }
      </div>
    }`,
})
export class ColorInput {
  @Input() classes: ColorPartClasses = {};
  @Input() className = '';
  @Input() format?: ColorFormat;
  @Input() label = '';
  readonly state = useColor();
  readonly indices: ChannelIndex[] = [0, 1, 2];
  selectedFormat() {
    return this.format ?? this.state().format;
  }
  channelFormat() {
    return this.selectedFormat() as ChannelFormat;
  }
}
