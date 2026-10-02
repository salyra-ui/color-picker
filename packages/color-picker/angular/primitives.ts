import {
  Directive,
  Injectable,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  DestroyRef,
  inject,
  afterNextRender,
  type OnInit,
  type OnChanges,
} from '@angular/core';
import { ColorContext, useColor, useColorStore } from './context';
import {
  createColorStore,
  subscribeColor,
  surfaceStyles,
  thumbPosition,
  styleText,
  bindColorSurface,
  bindMarkerWheel,
  bindColorSlider,
  bindColorValueInput,
  colorInputAttributes,
  sliderAttributes,
  sliderLabels,
  sliderTrackVariables,
  nextColorFormat,
  type ColorStore,
  type ColorView,
  type ColorFormat,
  type ColorInputOptions,
  type SliderChannel,
  type ColorMarker,
  type HSV,
} from '../core';
/** Native host with no generated children. */
@Directive({
  selector: '[cpRoot]',
  standalone: true,
  providers: [ColorContext],
  exportAs: 'cpRoot',
})
export class ColorRoot implements OnInit, OnChanges {
  @Input() store?: ColorStore;
  @Input() value?: string;
  @Input() disabled?: boolean;
  @Output() valueChange = new EventEmitter<string>();
  private context = inject(ColorContext);
  private destroy = inject(DestroyRef);
  ngOnInit() {
    this.context.configure(
      this.store ?? createColorStore(this.value, 'hex', 'area', this.disabled),
    );
    if (this.disabled !== undefined)
      this.context.store.setDisabled(this.disabled);
    this.destroy.onDestroy(
      subscribeColor(this.context.store, (value) =>
        this.valueChange.emit(value),
      ),
    );
  }
  ngOnChanges() {
    if (this.value !== undefined) this.context.store.setHex(this.value);
    if (this.disabled !== undefined)
      this.context.store.setDisabled(this.disabled);
  }
}
@Injectable()
export class ColorSurfaceContext {
  view: ColorView = 'area';
}
@Directive({
  selector: '[cpArea],[cpWheel]',
  standalone: true,
  providers: [ColorSurfaceContext],
  exportAs: 'cpSurface',
  host: {
    '[attr.data-cp-part]': '"surface"',
    '[attr.data-view]': 'view',
    '[attr.role]': '"group"',
    '[attr.tabindex]': 'state().disabled ? -1 : 0',
    '[attr.aria-disabled]': 'state().disabled',
    '[style.position]': '"relative"',
    '[style.touch-action]': '"none"',
    '[style.background]': 'styles().background',
    '[style.aspect-ratio]': 'styles().aspectRatio ?? null',
    '[style.border-radius]': 'styles().borderRadius ?? null',
  },
})
export class ColorPlane implements OnChanges {
  @Input() cpMarkers?: readonly ColorMarker[];
  @Input() cpActiveId?: string;
  @Output() markerSelect = new EventEmitter<string>();
  @Output() markerChange = new EventEmitter<{
    id: string;
    hsv: Partial<HSV>;
  }>();
  readonly state = useColor();
  private store = useColorStore();
  private node = inject(ElementRef<HTMLElement>).nativeElement;
  readonly view: ColorView = this.node.hasAttribute('cpWheel')
    ? 'wheel'
    : 'area';
  private ready = false;
  private stop?: () => void;
  private multi?: boolean;
  styles() {
    return surfaceStyles(
      this.cpMarkers ? { ...this.state(), v: 100 } : this.state(),
      this.view,
    );
  }
  constructor() {
    inject(ColorSurfaceContext).view = this.view;
    afterNextRender(() => {
      this.ready = true;
      this.bind();
    });
    inject(DestroyRef).onDestroy(() => this.stop?.());
  }
  ngOnChanges() {
    if (this.ready) this.bind();
  }
  private bind() {
    const multi = this.cpMarkers !== undefined;
    if (this.multi === multi && this.stop) return;
    this.multi = multi;
    this.stop?.();
    this.stop = this.cpMarkers
      ? bindMarkerWheel(this.node, {
          getMarkers: () => this.cpMarkers ?? [],
          getActiveId: () => this.cpActiveId ?? this.cpMarkers?.[0]?.id ?? '',
          select: (id) => this.markerSelect.emit(id),
          setHSV: (id, hsv) => this.markerChange.emit({ id, hsv }),
        })
      : bindColorSurface(this.node, this.store, this.view);
  }
}
@Directive({
  selector: '[cpThumb]',
  standalone: true,
  host: {
    '[attr.data-cp-part]': '"thumb"',
    '[attr.aria-hidden]': '"true"',
    '[style.position]': '"absolute"',
    '[style.transform]': '"translate(-50%,-50%)"',
    '[style.pointer-events]': '"none"',
    '[style.left]': 'position().left',
    '[style.top]': 'position().top',
  },
})
export class ColorThumb {
  private state = useColor();
  private view = inject(ColorSurfaceContext);
  position() {
    return thumbPosition(this.state(), this.view.view);
  }
}
@Directive({
  selector: 'input[cpSlider]',
  standalone: true,
  host: {
    '[attr.type]': '"range"',
    '[attr.min]': '0',
    '[attr.max]': 'cpSlider === "h" ? 359 : 100',
    '[attr.aria-label]': 'ariaLabel ?? labels[cpSlider]',
    '[attr.step]': 'cpSlider === "alpha" ? 0.1 : 1',
    '[attr.data-cp-part]': '"slider"',
    '[attr.data-channel]': 'cpSlider',
    '[disabled]': 'disabled || state().disabled',
    '[value]': 'attrs().value',
    '[style.--cp-alpha-color]': 'state().hex',
    '[style.--cp-saturation-start]': 'variables()["--cp-saturation-start"]',
    '[style.--cp-saturation-end]': 'variables()["--cp-saturation-end"]',
    '[style.--cp-brightness-end]': 'variables()["--cp-brightness-end"]',
  },
})
export class ColorRange implements OnChanges {
  readonly labels = sliderLabels;
  @Input('aria-label') ariaLabel?: string;
  @Input() cpSlider: SliderChannel = 'h';
  @Input() disabled = false;
  readonly state = useColor();
  private store = useColorStore();
  private input = inject(ElementRef<HTMLInputElement>).nativeElement;
  private ready = false;
  private stop?: () => void;
  attrs() {
    return sliderAttributes(this.state(), this.cpSlider);
  }
  variables() {
    return sliderTrackVariables(this.state());
  }
  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.bind();
    });
    inject(DestroyRef).onDestroy(() => this.stop?.());
  }
  ngOnChanges() {
    if (this.ready) this.bind();
  }
  private bind() {
    this.stop?.();
    this.stop = bindColorSlider(
      this.input,
      this.store,
      this.cpSlider,
      () => this.disabled,
    );
  }
}
@Directive({
  selector: 'input[cpInput]',
  standalone: true,
  host: {
    '[attr.data-cp-part]': '"input"',
    '[attr.type]': 'attrs().type',
    '[attr.aria-label]': 'ariaLabel ?? attrs()["aria-label"]',
    '[attr.value]': 'attrs().value',
    '[attr.min]': 'attrs().min ?? null',
    '[attr.max]': 'attrs().max ?? null',
    '[attr.step]': 'attrs().step ?? null',
    '[disabled]': 'disabled || state().disabled',
  },
})
export class ColorField implements OnChanges {
  @Input('aria-label') ariaLabel?: string;
  @Input() format?: ColorFormat;
  @Input() index?: 0 | 1 | 2;
  @Input() disabled = false;
  readonly state = useColor();
  private store = useColorStore();
  private input = inject(ElementRef<HTMLInputElement>).nativeElement;
  private ready = false;
  private stop?: () => void;
  attrs() {
    return colorInputAttributes(this.state(), {
      format: this.format,
      index: this.index,
    });
  }
  constructor() {
    afterNextRender(() => {
      this.ready = true;
      this.bind();
    });
    inject(DestroyRef).onDestroy(() => this.stop?.());
  }
  ngOnChanges() {
    if (this.ready) this.bind();
    else this.input.value = String(this.attrs().value);
  }
  private bind() {
    this.stop?.();
    this.stop = bindColorValueInput(
      this.input,
      this.store,
      { format: this.format, index: this.index },
      () => this.disabled,
    );
  }
}
@Directive({
  selector: 'button[cpFormatTrigger]',
  standalone: true,
  host: {
    '[attr.type]': '"button"',
    '[attr.data-cp-part]': '"format-trigger"',
    '[disabled]': 'disabled || state().disabled',
    '[attr.aria-pressed]': 'format ? state().format === format : null',
    '(click)': 'change($event)',
  },
})
export class ColorFormatTrigger {
  @Input() format?: ColorFormat;
  @Input() disabled = false;
  readonly state = useColor();
  private store = useColorStore();
  change(event: Event) {
    if (!event.defaultPrevented && !this.disabled)
      nextColorFormat(this.store, this.format);
  }
}
export const colorPickerPrimitives = [
  ColorRoot,
  ColorPlane,
  ColorThumb,
  ColorRange,
  ColorField,
  ColorFormatTrigger,
] as const;
