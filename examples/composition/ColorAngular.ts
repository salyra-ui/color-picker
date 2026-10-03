import { Component } from '@angular/core';
import {
  ColorRoot,
  ColorPlane,
  ColorThumb,
  ColorRange,
  ColorField,
  ColorEyeDropper,
  ColorFormatTrigger,
  createColorStore,
} from '@salyra-ui/color-picker/angular';
@Component({
  selector: 'color-composition',
  standalone: true,
  imports: [
    ColorRoot,
    ColorPlane,
    ColorThumb,
    ColorRange,
    ColorField,
    ColorEyeDropper,
    ColorFormatTrigger,
  ],
  template: ` <section cpRoot [store]="store">
    <div class="composition-editor" data-composition="color">
      <div cpWheel class="composition-wheel" aria-label="Brand color">
        <span cpThumb class="composition-dot"
          ><span class="composition-dot-text">Pick</span></span
        >
      </div>
      <div class="composition-fields">
        <label><span>Brightness</span><input cpSlider="v" /></label
        ><label><span>Opacity</span><input cpSlider="alpha" /></label>
        <div class="composition-channels">
          <label
            ><span>Red</span><input cpInput format="rgb" [index]="0" /></label
          ><label
            ><span>Green</span><input cpInput format="rgb" [index]="1" /></label
          ><label
            ><span>Blue</span><input cpInput format="rgb" [index]="2"
          /></label>
        </div>
        <label><span>Color value</span><input cpInput /></label
        ><button cpFormatTrigger>Show next format</button>
        <button cpEyeDropper>Pick from screen</button>
      </div>
    </div>
  </section>`,
})
export class ColorComposition {
  readonly store = createColorStore('#5268E080');
}
