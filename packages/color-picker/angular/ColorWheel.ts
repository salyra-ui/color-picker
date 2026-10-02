import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  markerStyle,
  type ColorMarker,
  type ColorPartClasses,
  type HSV,
} from '../core';
import { ColorPlane, ColorThumb } from './primitives';
@Component({
  selector: 'cp-wheel',
  standalone: true,
  imports: [ColorPlane, ColorThumb],
  template: ` <div
    cpWheel
    [class]="'cp-wheel ' + className + ' ' + (classes.root ?? '')"
    [attr.aria-label]="label"
    [cpMarkers]="markers"
    [cpActiveId]="activeId"
    (markerSelect)="markerSelect.emit($event)"
    (markerChange)="markerChange.emit($event)"
  >
    @if (markers) {
      @for (marker of markers; track marker.id) {
        <button
          type="button"
          data-cp-part="marker"
          [attr.data-marker-id]="marker.id"
          [attr.data-small]="
            markers.length === 1 || !marker.label ? 'true' : null
          "
          [class]="'cp-wheel-marker ' + (classes.marker ?? '')"
          [attr.aria-label]="marker.ariaLabel ?? marker.id"
          [attr.aria-pressed]="activeId === marker.id"
          [style]="markerStyle(marker, activeId === marker.id)"
        >
          <span data-cp-part="marker-text" [class]="classes.text ?? ''">{{
            marker.label ?? ''
          }}</span>
        </button>
      }
    } @else {
      <span cpThumb [class]="'cp-thumb ' + (classes.thumb ?? '')"
        ><span data-cp-part="thumb-text" [class]="classes.text ?? ''">{{
          thumbText
        }}</span></span
      >
    }
  </div>`,
})
export class ColorWheel {
  @Input() label = 'Hue and saturation wheel';
  @Input() className = '';
  @Input() classes: ColorPartClasses = {};
  @Input() thumbText = '';
  @Input() markers?: readonly ColorMarker[];
  @Input() activeId?: string;
  @Output() markerSelect = new EventEmitter<string>();
  @Output() markerChange = new EventEmitter<{
    id: string;
    hsv: Partial<HSV>;
  }>();
  readonly markerStyle = markerStyle;
}
