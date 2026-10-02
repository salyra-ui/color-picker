import { mountColorControls } from './composition';
import type { ColorProviderElement } from './elements';
/** Astro uses this lifecycle wrapper. HTML consumers may bind their own DOM directly. */
export class ColorCompositionElement extends HTMLElement {
  private controls: Element[] = [];
  private bound?: import('../core').ColorStore;
  private stop?: () => void;
  private detach?: () => void;
  connectedCallback() {
    const root = this.closest<ColorProviderElement>('cp-provider');
    if (!root) return;
    const setup = () => {
      const controls = Array.from(
        this.querySelectorAll('[data-cp-control], [data-cp-part="thumb"]'),
      );
      if (
        this.bound === root.store &&
        controls.length === this.controls.length &&
        controls.every((control, index) => control === this.controls[index])
      )
        return;
      this.controls = controls;
      this.bound = root.store;
      this.stop?.();
      this.stop = undefined;
      if (root.store) this.stop = mountColorControls(this, root.store).destroy;
    };
    const observer = new this.ownerDocument.defaultView!.MutationObserver(
      setup,
    );
    observer.observe(this, { childList: true, subtree: true });
    root.addEventListener('color-context', setup);
    this.detach = () => {
      observer.disconnect();
      root.removeEventListener('color-context', setup);
    };
    setup();
    queueMicrotask(() => {
      if (this.isConnected) setup();
    });
  }
  disconnectedCallback() {
    this.stop?.();
    this.detach?.();
    this.stop = this.detach = undefined;
    this.bound = undefined;
    this.controls = [];
  }
}
if (!customElements.get('cp-compose'))
  customElements.define('cp-compose', ColorCompositionElement);
