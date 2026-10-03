import { bindColorEyeDropper } from '../core';
import type { ColorStore } from '../core';
import type { ColorProviderElement } from './elements';
/** Keeps user button markup and follows its closest color context. */
export class ColorEyeDropperElement extends HTMLElement {
  static observedAttributes = ['disabled', 'preserve-alpha'];
  private binding?: ReturnType<typeof bindColorEyeDropper>;
  private store?: ColorStore;
  private button?: HTMLButtonElement;
  private detach?: () => void;
  connectedCallback() {
    const root = this.closest<ColorProviderElement>('cp-provider');
    if (!root) return;
    const setup = () => {
      const button = this.querySelector('button');
      if (!button || !root.store) return;
      if (this.store === root.store && this.button === button) {
        this.binding?.refresh();
        return;
      }
      this.binding?.destroy();
      this.store = root.store;
      this.button = button;
      this.binding = bindColorEyeDropper(button, root.store, {
        disabled: () => this.hasAttribute('disabled'),
        preserveAlpha: this.getAttribute('preserve-alpha') !== 'false',
      });
    };
    root.addEventListener('color-context', setup);
    const observer = new this.ownerDocument.defaultView!.MutationObserver(
      setup,
    );
    observer.observe(this, { childList: true, subtree: true });
    this.detach = () => {
      root.removeEventListener('color-context', setup);
      observer.disconnect();
    };
    setup();
    queueMicrotask(() => {
      if (this.isConnected) setup();
    });
  }
  attributeChangedCallback(name: string) {
    if (name === 'preserve-alpha' && this.binding) {
      this.binding.destroy();
      this.binding = undefined;
      this.store = undefined;
      this.button = undefined;
      this.detach?.();
      this.connectedCallback();
    } else this.binding?.refresh();
  }
  disconnectedCallback() {
    this.binding?.destroy();
    this.detach?.();
    this.binding = undefined;
    this.store = undefined;
    this.button = undefined;
    this.detach = undefined;
  }
}
if (!customElements.get('cp-eye-dropper'))
  customElements.define('cp-eye-dropper', ColorEyeDropperElement);
