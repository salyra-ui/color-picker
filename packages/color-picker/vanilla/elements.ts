import {
  type ColorView,
  createColorCollection,
  type ColorCollectionStore,
  bindMarkerWheel,
  markerWheelStyle,
  markerStyle,
  bindAlphaInput,
  sliderValue,
  setSliderValue,
  colorPreviewStyles,
  sliderTrackVariables,
  type ColorMarker,
  type ColorPartClasses,
  type SliderChannel,
  channelSpecs,
  channelValue,
  setColorChannel,
  type ChannelFormat,
  type ChannelIndex,
  colorFormats,
  subscribeColor,
  parseColor,
  formatColor,
  type ColorFormat,
  createColorStore,
  bindColorArea,
  areaStyle,
  wheelStyle,
  wheelThumbStyle,
  thumbStyle,
  type ColorStore,
} from '../core';
export class ColorProviderElement extends HTMLElement {
  static observedAttributes = ['disabled'];
  attributeChangedCallback() {
    if (this.store) this.store.setDisabled(this.hasAttribute('disabled'));
  }

  store?: ColorStore;
  private unsubscribe?: () => void;
  setStore(store: ColorStore) {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
    this.store = store;
    if (this.isConnected) this.connectedCallback();
  }
  connectedCallback() {
    if (this.unsubscribe) return;
    this.store ??= createColorStore(
      this.getAttribute('value') ?? '#6366F1',
      'hex',
      (this.getAttribute('view') ?? 'area') as ColorView,
      this.hasAttribute('disabled'),
    );
    if (this.hasAttribute('disabled')) this.store.setDisabled(true);
    const updateDisabled = () => {
      const disabled = this.store!.getSnapshot().disabled;
      this.toggleAttribute('inert', disabled);
      this.setAttribute('aria-disabled', String(disabled));
      this.dataset.disabled = String(disabled);
      this.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLButtonElement
      >('input, select, button').forEach((control) => {
        if (control.closest('cp-provider') !== this) return;
        if (disabled) {
          if (!control.disabled) {
            control.dataset.cpDisabled = '';
            control.disabled = true;
          }
        } else if (control.hasAttribute('data-cp-disabled')) {
          control.disabled = false;
          delete control.dataset.cpDisabled;
        }
      });
    };
    let previousDisabled = this.store.getSnapshot().disabled;
    const states = this.store.subscribe(() => {
      const disabled = this.store!.getSnapshot().disabled;
      if (disabled !== previousDisabled) {
        previousDisabled = disabled;
        updateDisabled();
      }
    });
    const observer = new this.ownerDocument.defaultView!.MutationObserver(
      updateDisabled,
    );
    observer.observe(this, { childList: true, subtree: true });
    updateDisabled();
    const colors = subscribeColor(this.store, () =>
      this.dispatchEvent(
        new CustomEvent('color-change', {
          detail: this.store!.getSnapshot().value,
          bubbles: true,
        }),
      ),
    );
    this.unsubscribe = () => {
      states();
      colors();
      observer.disconnect();
    };
    this.dispatchEvent(new Event('color-context'));
  }
  disconnectedCallback() {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }
}
function connect(
  element: HTMLElement,
  render: (store: ColorStore) => void,
  bind?: (store: ColorStore) => () => void,
): () => void {
  const root = element.closest<ColorProviderElement>('cp-provider');
  if (!root) throw new Error('Color components require cp-provider');
  let unsubscribe: (() => void) | undefined, cleanup: (() => void) | undefined;
  const setup = () => {
    if (!root.store) return;
    unsubscribe?.();
    cleanup?.();
    render(root.store);
    unsubscribe = root.store.subscribe(() => render(root.store!));
    cleanup = bind?.(root.store);
  };
  root.addEventListener('color-context', setup);
  setup();
  return () => {
    root.removeEventListener('color-context', setup);
    unsubscribe?.();
    cleanup?.();
  };
}
class ColorAreaElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const area = this.querySelector<HTMLElement>('[data-area]')!,
      thumb = area.firstElementChild as HTMLElement;
    this.cleanup = connect(
      this,
      (store) => {
        const state = store.getSnapshot();
        area.style.cssText = `${areaStyle(state)};${area.dataset.customStyle ?? ''}`;
        thumb.style.cssText = thumbStyle(state);
        area.setAttribute(
          'aria-label',
          `Saturation and brightness. Arrow keys adjust; Shift for larger steps. ${Math.round(state.s)}% saturation, ${Math.round(state.v)}% brightness.`,
        );
      },
      (store) => bindColorArea(area, store),
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
export class ColorWheelElement extends HTMLElement {
  private cleanup?: () => void;
  private markers?: readonly ColorMarker[];
  private activeId?: string;
  setMarkers(markers: readonly ColorMarker[], activeId: string) {
    this.markers = markers;
    this.activeId = activeId;
    this.render();
  }
  private render() {
    const area = this.querySelector<HTMLElement>('[data-area]')!;
    if (!area) return;
    const store = this.closest<ColorProviderElement>('cp-provider')?.store;
    if (!store) return;
    const classes = JSON.parse(
      this.getAttribute('data-classes') ?? '{}',
    ) as ColorPartClasses;
    area.style.cssText =
      (this.markers ? markerWheelStyle() : wheelStyle(store.getSnapshot())) +
      ';' +
      (this.getAttribute('data-custom-style') ?? '');
    if (this.markers) {
      for (const el of area.querySelectorAll<HTMLElement>('[data-marker-id]'))
        el.hidden = !this.markers.some(
          (marker) => marker.id === el.dataset.markerId,
        );
      for (const marker of this.markers) {
        let button = Array.from(
          area.querySelectorAll<HTMLButtonElement>('[data-marker-id]'),
        ).find((el) => el.dataset.markerId === marker.id);
        if (!button) {
          button = area.ownerDocument.createElement('button');
          button.type = 'button';
          button.dataset.markerId = marker.id;
          button.dataset.cpPart = 'marker';
          button.append(area.ownerDocument.createElement('span'));
          area.append(button);
        }
        button.hidden = false;
        button.className = 'cp-wheel-marker ' + (classes.marker ?? '');
        button.setAttribute(
          'aria-label',
          marker.ariaLabel ?? `Select ${marker.id} marker`,
        );
        button.setAttribute(
          'aria-pressed',
          String(marker.id === this.activeId),
        );
        button.dataset.small = String(
          this.markers.length === 1 || !marker.label,
        );
        button.style.cssText = markerStyle(marker, marker.id === this.activeId);
        const text = button.firstElementChild as HTMLElement;
        text.dataset.cpPart = 'marker-text';
        text.className = classes.text ?? '';
        text.textContent = marker.label ?? '';
      }
    } else {
      const thumb = area.querySelector<HTMLElement>('[data-cp-part="thumb"]')!;
      if (thumb) thumb.style.cssText = wheelThumbStyle(store.getSnapshot());
    }
  }
  connectedCallback() {
    this.markers =
      this.markers ??
      (this.hasAttribute('data-markers')
        ? JSON.parse(this.getAttribute('data-markers')!)
        : undefined);
    this.activeId ??= this.getAttribute('data-active-id') ?? undefined;
    const area = this.querySelector<HTMLElement>('[data-area]')!;
    this.cleanup = connect(
      this,
      () => this.render(),
      (store) =>
        this.markers
          ? bindMarkerWheel(area, {
              getMarkers: () => this.markers ?? [],
              getActiveId: () => this.activeId ?? this.markers?.[0]?.id ?? '',
              select: (id) =>
                this.dispatchEvent(
                  new CustomEvent('marker-select', {
                    detail: id,
                    bubbles: true,
                  }),
                ),
              setHSV: (id, hsv) =>
                this.dispatchEvent(
                  new CustomEvent('marker-change', {
                    detail: { id, hsv },
                    bubbles: true,
                  }),
                ),
            })
          : bindColorArea(area, store, 'wheel'),
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorSliderElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const input = this.querySelector('input')!,
      channel = (this.getAttribute('channel') ?? 'h') as SliderChannel;
    this.cleanup = connect(
      this,
      (store) => {
        input.value = String(sliderValue(store.getSnapshot(), channel));
        // Update only our variables, preserving caller-supplied inline styles.
        const track =
          input.closest<HTMLElement>('.cp-slider') ?? input.parentElement!;
        for (const [property, value] of Object.entries(
          sliderTrackVariables(store.getSnapshot()),
        ))
          track.style.setProperty(property, value);
      },
      (store) => {
        const update = () =>
          setSliderValue(store, channel, Number(input.value));
        input.addEventListener('input', update);
        return () => input.removeEventListener('input', update);
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
function applyFieldClasses(element: HTMLElement) {
  const source = element.hasAttribute('data-classes')
    ? element
    : element.closest<HTMLElement>('cp-input[data-classes]');
  const classes: ColorPartClasses = JSON.parse(source?.dataset.classes ?? '{}');
  const add = (node: HTMLElement | null, value?: string) => {
    if (node && value?.trim()) node.classList.add(...value.trim().split(/\s+/));
  };
  add(
    element.querySelector('label'),
    [classes.root, classes.label].filter(Boolean).join(' '),
  );
  const input = element.querySelector<HTMLInputElement>('input');
  if (input) {
    input.dataset.cpPart = 'input';
    add(input, classes.input);
  }
  add(
    element.querySelector('[data-label], [data-channel-label]'),
    classes.text,
  );
}
class ColorTextInputElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    applyFieldClasses(this);
    const input = this.querySelector('input')!,
      label = this.querySelector('[data-label]')!;
    const format = (store: ColorStore) =>
      (this.getAttribute('format') as ColorFormat | null) ??
      store.getSnapshot().format;
    this.cleanup = connect(
      this,
      (store) => {
        const f = format(store);
        input.maxLength = f === 'hex' ? 9 : 64;
        if (input.ownerDocument.activeElement !== input)
          input.value = formatColor(
            store.getSnapshot().hex,
            f,
            store.getSnapshot().alpha,
          );
        label.textContent = this.getAttribute('label') ?? f.toUpperCase();
        input.setAttribute('aria-invalid', 'false');
      },
      (store) => {
        const update = () => {
          try {
            store.setHex(parseColor(input.value, format(store)));
            input.setAttribute('aria-invalid', 'false');
          } catch {
            input.setAttribute('aria-invalid', 'true');
          }
        };
        const reset = () => {
          input.value = formatColor(
            store.getSnapshot().hex,
            format(store),
            store.getSnapshot().alpha,
          );
          input.setAttribute('aria-invalid', 'false');
        };
        const key = (event: KeyboardEvent) => {
          if (event.key === 'Enter') reset();
        };
        input.addEventListener('input', update);
        input.addEventListener('blur', reset);
        input.addEventListener('keydown', key);
        return () => {
          input.removeEventListener('input', update);
          input.removeEventListener('blur', reset);
          input.removeEventListener('keydown', key);
        };
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorChannelInputElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const format = this.getAttribute('format') as ChannelFormat,
      index = Number(this.getAttribute('index')) as ChannelIndex,
      spec = channelSpecs[format][index];
    if (!this.querySelector('input')) {
      this.innerHTML =
        '<label class="cp-channel"><span data-channel-label></span><span class="cp-channel-field"><input type="number"/><span data-unit aria-hidden="true"></span></span></label>';
    }
    applyFieldClasses(this);
    const input = this.querySelector('input')!;
    this.querySelector('[data-channel-label]')!.textContent = spec.label;
    this.querySelector('[data-unit]')!.textContent = spec.unit;
    input.setAttribute('aria-label', `${format.toUpperCase()} ${spec.label}`);
    input.min = String(spec.min);
    input.max = String(spec.max);
    input.step = String(spec.step);
    this.cleanup = connect(
      this,
      (store) => {
        if (input.ownerDocument.activeElement !== input)
          input.value = channelValue(store.getSnapshot(), format, index);
      },
      (store) => {
        const change = () => {
          try {
            if (!input.value.trim()) throw new Error('Incomplete');
            setColorChannel(store, format, index, Number(input.value));
            input.setAttribute('aria-invalid', 'false');
          } catch {
            input.setAttribute('aria-invalid', 'true');
          }
        };
        const reset = () => {
          input.value = channelValue(store.getSnapshot(), format, index);
          input.setAttribute('aria-invalid', 'false');
        };
        const key = (event: KeyboardEvent) => {
          if (event.key === 'Enter') reset();
        };
        input.addEventListener('input', change);
        input.addEventListener('blur', reset);
        input.addEventListener('keydown', key);
        return () => {
          input.removeEventListener('input', change);
          input.removeEventListener('blur', reset);
          input.removeEventListener('keydown', key);
        };
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorPreviewElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const output = this.querySelector('output')!;
    this.cleanup = connect(this, (store) => {
      const value = store.getSnapshot().value;
      for (const [property, color] of Object.entries(
        colorPreviewStyles(value),
      ))
        output.style.setProperty(property, color);
      output.textContent = value;
      output.setAttribute('aria-label', `Selected color ${value}`);
    });
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorInputElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup = connect(this, (store) => {
      const format = this.getAttribute('format') ?? store.getSnapshot().format;
      if (this.dataset.renderedFormat === format) return;
      this.dataset.renderedFormat = format;
      if (format === 'hex') {
        const text = this.ownerDocument.createElement('cp-text-input');
        text.setAttribute('format', 'hex');
        if (this.hasAttribute('label'))
          text.setAttribute('label', this.getAttribute('label')!);
        text.innerHTML =
          '<label class="cp-input"><span data-label>HEX</span><input spellcheck="false" maxlength="9"/></label>';
        this.replaceChildren(text);
      } else {
        const group = this.ownerDocument.createElement('div');
        group.className = 'cp-channels';
        group.setAttribute('role', 'group');
        group.setAttribute(
          'aria-label',
          this.getAttribute('label') ?? format.toUpperCase(),
        );
        for (let index = 0; index < 3; index++) {
          const channel = this.ownerDocument.createElement('cp-channel-input');
          channel.setAttribute('format', format);
          channel.setAttribute('index', String(index));
          group.append(channel);
        }
        this.replaceChildren(group);
      }
    });
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorModeElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const button = this.querySelector('button')!;
    const custom = this.hasAttribute('data-custom');
    this.cleanup = connect(
      this,
      (store) => {
        const format = store.getSnapshot().format;
        if (!custom) button.textContent = 'Next format';
        button
          .querySelectorAll<HTMLElement>('[data-color-format]')
          .forEach((label) => (label.textContent = format.toUpperCase()));
        button.setAttribute(
          'aria-label',
          `Next color format (${format.toUpperCase()})`,
        );
      },
      (store) => {
        const click = () =>
          store.setFormat(
            colorFormats[
              (colorFormats.indexOf(store.getSnapshot().format) + 1) %
                colorFormats.length
            ],
          );
        button.addEventListener('click', click);
        return () => button.removeEventListener('click', click);
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorFormatSelectElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const select = this.querySelector('select')!;
    this.cleanup = connect(
      this,
      (store) => {
        select.value = store.getSnapshot().format;
      },
      (store) => {
        const change = () => store.setFormat(select.value as ColorFormat);
        select.addEventListener('change', change);
        return () => select.removeEventListener('change', change);
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorViewSelectElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const select = this.querySelector('select')!;
    this.cleanup = connect(
      this,
      (store) => {
        select.value = store.getSnapshot().view;
      },
      (store) => {
        const change = () => store.setView(select.value as ColorView);
        select.addEventListener('change', change);
        return () => select.removeEventListener('change', change);
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorSurfaceElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup = connect(this, (store) => {
      for (const child of this.children) {
        (child as HTMLElement).hidden =
          (child as HTMLElement).dataset.view !== store.getSnapshot().view;
      }
    });
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
export class ColorCollectionElement extends HTMLElement {
  collection?: ColorCollectionStore;
  private cleanup?: () => void;
  private stopCollection?: () => void;
  setCollection(collection: ColorCollectionStore) {
    this.disconnectedCallback();
    this.collection = collection;
    if (this.isConnected) this.connectedCallback();
  }
  connectedCallback() {
    if (this.cleanup) return;
    const colors: string[] = JSON.parse(
      this.getAttribute('data-colors') ?? '[]',
    );
    this.collection ??= createColorCollection({
      favorites: this.getAttribute('kind') === 'favorites' ? colors : [],
    });
    if (
      !this.collection.getSnapshot().recent.length &&
      this.getAttribute('kind') !== 'favorites'
    )
      for (const color of [...colors].reverse())
        this.collection.remember(color);
    const collection = this.collection;
    let store: ColorStore | undefined;
    const render = () => {
      const classes = JSON.parse(this.getAttribute('data-classes') ?? '{}');
      const root = this.ownerDocument.createElement('fieldset');
      root.className = `cp-collection ${classes.root ?? ''}`;
      root.disabled = store?.getSnapshot().disabled ?? false;
      const label = this.ownerDocument.createElement('legend');
      label.textContent = this.getAttribute('label') ?? 'Recent colors';
      label.className = classes.label ?? '';
      root.append(label);
      for (const value of collection.getSnapshot()[
        this.getAttribute('kind') === 'favorites' ? 'favorites' : 'recent'
      ]) {
        const button = this.ownerDocument.createElement('button');
        button.type = 'button';
        button.className = `cp-swatch ${classes.item ?? ''}`;
        button.style.background = value;
        button.setAttribute('aria-label', value);
        button.addEventListener('click', () => store?.setHex(value));
        root.append(button);
      }
      this.replaceChildren(root);
    };
    this.cleanup = connect(this, (next) => {
      store = next;
      const root = this.querySelector('fieldset');
      if (root) root.disabled = next.getSnapshot().disabled;
    });
    this.stopCollection = collection.subscribe(render);
    render();
  }
  disconnectedCallback() {
    this.cleanup?.();
    this.stopCollection?.();
    this.cleanup = undefined;
    this.stopCollection = undefined;
  }
}
class ColorSwatchElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    const button = this.querySelector('button')!;
    this.cleanup = connect(
      this,
      () => {},
      (store) => {
        const click = () => store.setHex(this.getAttribute('value')!);
        button.addEventListener('click', click);
        return () => button.removeEventListener('click', click);
      },
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
class ColorAlphaInputElement extends HTMLElement {
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup = connect(
      this,
      () => {},
      (store) => bindAlphaInput(this.querySelector('input')!, store),
    );
  }
  disconnectedCallback() {
    this.cleanup?.();
  }
}
export class ColorOutputElement extends HTMLElement {
  color?: import('../core').ColorInfo;
  private cleanup?: () => void;
  connectedCallback() {
    this.cleanup = connect(this, (store) => {
      this.color = store.getColor();
      const target = this.querySelector('output');
      const format = this.getAttribute('format');
      if (target)
        target.textContent =
          format === 'name'
            ? this.color.name
            : format === 'json'
              ? JSON.stringify(this.color, null, 2)
              : store.getSnapshot().value;
      this.dispatchEvent(
        new CustomEvent('color-values', { detail: this.color, bubbles: true }),
      );
    });
  }
  disconnectedCallback() {
    this.cleanup?.();
    this.cleanup = undefined;
  }
}
for (const [name, element] of [
  ['cp-provider', ColorProviderElement],
  ['cp-output', ColorOutputElement],
  ['cp-area', ColorAreaElement],
  ['cp-preview', ColorPreviewElement],
  ['cp-wheel', ColorWheelElement],
  ['cp-slider', ColorSliderElement],
  ['cp-alpha-input', ColorAlphaInputElement],
  ['cp-input', ColorInputElement],
  ['cp-text-input', ColorTextInputElement],
  ['cp-channel-input', ColorChannelInputElement],
  ['cp-mode', ColorModeElement],
  ['cp-format-select', ColorFormatSelectElement],
  ['cp-view-select', ColorViewSelectElement],
  ['cp-surface', ColorSurfaceElement],
  ['cp-swatch', ColorSwatchElement],
  ['cp-collection', ColorCollectionElement],
] as const)
  if (!customElements.get(name)) customElements.define(name, element);
