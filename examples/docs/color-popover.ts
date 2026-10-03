import {
  createColorStore,
  mountColorPicker,
} from '@salyra-ui/color-picker/vanilla';
import './color-popover.css';
let sequence = 0;
/** The docs use our picker for supporting colors as well as the primary editor. */
export function mountColorPopover(
  host: HTMLElement,
  options: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    alpha?: boolean;
  },
) {
  const store = createColorStore(options.value),
    id = `supporting-color-${++sequence}`;
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'supporting-color-trigger';
  trigger.setAttribute('aria-label', `Choose ${options.label.toLowerCase()}`);
  trigger.setAttribute('aria-haspopup', 'dialog');
  trigger.setAttribute('aria-controls', id);
  const swatch = document.createElement('span'),
    value = document.createElement('code');
  swatch.className = 'supporting-color-swatch';
  swatch.setAttribute('aria-hidden', 'true');
  trigger.append(swatch, value);
  const dialog = document.createElement('dialog');
  dialog.id = id;
  dialog.className = 'supporting-color-dialog';
  dialog.setAttribute('aria-label', `${options.label} color picker`);
  const heading = document.createElement('header'),
    title = document.createElement('h3'),
    close = document.createElement('button');
  title.textContent = options.label;
  close.type = 'button';
  close.textContent = 'Close';
  close.setAttribute('aria-label', 'Close color picker');
  heading.append(title, close);
  const editor = document.createElement('div');
  dialog.append(heading, editor);
  host.append(trigger, dialog);
  const picker = mountColorPicker(editor, { store });
  if (!options.alpha) {
    picker.element.querySelector('cp-slider[channel="alpha"]')?.remove();
    picker.element.querySelector('cp-alpha-input')?.remove();
  }
  const render = () => {
    const color = store.getSnapshot();
    swatch.style.background = color.value;
    value.textContent = color.value;
    trigger.dataset.color = color.value;
  };
  render();
  const stop = store.subscribe(() => {
    render();
    options.onChange(store.getSnapshot().value);
  });
  const open = () => {
    dialog.showModal();
    trigger.setAttribute('aria-expanded', 'true');
  };
  const hide = () => dialog.close();
  const closed = () => {
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  };
  const outside = (event: MouseEvent) => {
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      hide();
  };
  trigger.setAttribute('aria-expanded', 'false');
  trigger.addEventListener('click', open);
  close.addEventListener('click', hide);
  dialog.addEventListener('close', closed);
  dialog.addEventListener('click', outside);
  return {
    store,
    element: trigger,
    destroy() {
      stop();
      trigger.removeEventListener('click', open);
      close.removeEventListener('click', hide);
      dialog.removeEventListener('close', closed);
      dialog.removeEventListener('click', outside);
      if (dialog.open) dialog.close();
      picker.destroy();
      dialog.remove();
      trigger.remove();
    },
  };
}
