import {
  bindColorEyeDropper,
  bindColorSurface,
  bindColorSlider,
  bindColorValueInput,
  nextColorFormat,
  type ColorStore,
  type ColorFormat,
  type ChannelIndex,
  type SliderChannel,
} from '../core';
/** Bind existing DOM. Creates no elements and preserves labels, classes and content. */
export function mountColorControls(root: HTMLElement, store: ColorStore) {
  const stops: (() => void)[] = [];
  const controls = Array.from(
    root.querySelectorAll<HTMLElement>('[data-cp-control]'),
  );
  if (root.matches('[data-cp-control]')) controls.unshift(root);
  for (const element of controls) {
    const kind = element.dataset.cpControl;
    if (kind === 'area' || kind === 'wheel')
      stops.push(bindColorSurface(element, store, kind));
    else if (kind === 'slider')
      stops.push(
        bindColorSlider(
          element as HTMLInputElement,
          store,
          (element.dataset.channel ?? 'h') as SliderChannel,
        ),
      );
    else if (kind === 'input')
      stops.push(
        bindColorValueInput(element as HTMLInputElement, store, {
          format: element.dataset.format as ColorFormat | undefined,
          index: element.hasAttribute('data-index')
            ? (Number(element.dataset.index) as ChannelIndex)
            : undefined,
        }),
      );
    else if (kind === 'eyedropper') {
      const button = element as HTMLButtonElement;
      const disabled =
        button.hasAttribute('data-disabled') ||
        (button.disabled && !button.hasAttribute('data-cp-supported'));
      const binding = bindColorEyeDropper(button, store, {
        preserveAlpha: button.dataset.preserveAlpha !== 'false',
        disabled: () => disabled || button.hasAttribute('data-disabled'),
      });
      stops.push(binding.destroy);
    } else if (kind === 'format') {
      const button = element as HTMLButtonElement,
        disabled =
          button.disabled &&
          !button.hasAttribute('data-cp-disabled') &&
          !button.hasAttribute('data-tk-disabled');
      const render = () => {
        button.disabled = disabled || store.getSnapshot().disabled;
        if (button.dataset.format)
          button.setAttribute(
            'aria-pressed',
            String(store.getSnapshot().format === button.dataset.format),
          );
      };
      const click = (event: Event) => {
        if (!event.defaultPrevented && !button.disabled)
          nextColorFormat(
            store,
            button.dataset.format as ColorFormat | undefined,
          );
      };
      render();
      stops.push(store.subscribe(render));
      button.addEventListener('click', click);
      stops.push(() => button.removeEventListener('click', click));
    }
  }
  return {
    store,
    destroy() {
      stops
        .splice(0)
        .reverse()
        .forEach((stop) => stop());
    },
  };
}
