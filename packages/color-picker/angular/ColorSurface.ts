import { Component } from '@angular/core';
import { useColor } from './context';
import { ColorArea } from './ColorArea';
import { ColorWheel } from './ColorWheel';
import { ColorSlider } from './ColorSlider';
@Component({
  selector: 'cp-surface',
  standalone: true,
  imports: [ColorArea, ColorWheel, ColorSlider],
  template: `@if (state().view === 'wheel') {
      <cp-wheel />
    } @else {
      <cp-area />
    }
    <cp-slider [channel]="state().view === 'wheel' ? 'v' : 'h'" />`,
})
export class ColorSurface {
  readonly state = useColor();
}
