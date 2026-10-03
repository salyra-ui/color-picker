import type { ApiEntry, ApiField } from './reference-data';
const f = (
  key: string,
  type: string,
  fallback: string,
  description: string,
  example: string,
): ApiField => ({ key, type, default: fallback, description, example });
export const eyedropperReferenceEntries: ApiEntry[] = [
  {
    id: 'coloreyedropper',
    name: 'ColorEyeDropper / ColorPicker.EyeDropper',
    kind: 'Component',
    description:
      'An optional button that samples an opaque sRGB pixel from the screen and updates the closest color store. Detects support after mounting and keeps existing alpha by default.',
    note: 'Requires a browser with EyeDropper in a secure context and a direct user click. Unsupported and pending buttons are disabled. Escape cancels without changing the color. React uses render(state), Svelte a children(state) snippet and Vue a state slot. Angular uses button[cpEyeDropper], colorPick and colorPickError outputs. Astro uses ColorEyeDropper.astro inside cp-compose. Vanilla uses cp-eye-dropper or data-cp-control="eyedropper". Button labels, icons, classes and native attributes belong to your markup.',
    fields: [
      f(
        'preserveAlpha',
        'boolean',
        'true',
        'Screen colors have no alpha channel. Preserve the current store opacity, or set false to make the sampled color opaque.',
        'preserveAlpha={false}',
      ),
      f(
        'disabled',
        'boolean',
        'false',
        'Disables this button. The parent color context, missing browser support and a pending request also disable it. Disabling during a request cancels sampling.',
        'disabled={saving}',
      ),
      f(
        'onPick',
        '(hex: string) => void',
        'undefined',
        'React and Svelte callback after the store updates. Returns opaque #RRGGBB from the screen. Read store.value for the color with preserved alpha. Vue emits pick and Angular emits colorPick.',
        'onPick={hex => console.log(hex)}',
      ),
      f(
        'onPickError',
        '(error: Error) => void',
        'undefined',
        'React and Svelte callback for failures. Cancellation is not an error. Vue emits pickError and Angular emits colorPickError. Vanilla dispatches color-pick-error.',
        'onPickError={error => console.error(error)}',
      ),
      f(
        'children / render',
        'ReactNode | (state: ColorEyeDropperState) => ReactNode',
        'Pick from screen',
        'Own the text or icon. React render, Svelte snippet and Vue slot receive supported, pending and error. Angular projects your native button content. Astro and Vanilla preserve their child markup.',
        'render={state => state.pending ? "Picking…" : "Pick from screen"}',
      ),
      f(
        'ref / native attributes',
        'button attributes and native button ref',
        'undefined',
        'Forward your classes, accessible label and event handlers. Prevent the click default to skip sampling.',
        'aria-label="Sample brand color" className="my-pipette"',
      ),
    ],
    example: {
      file: 'Usage.tsx',
      code: `import { ColorPicker as Color } from '@salyra-ui/color-picker/react';
export function ScreenPicker() {
  return <Color.Root defaultValue="#5268E080">
    <Color.EyeDropper preserveAlpha onPick={hex => console.log(hex)}
      render={state => state.pending ? 'Picking…' : 'Pick from screen'} />
  </Color.Root>;
}`,
    },
  },
  {
    id: 'createcoloreyedropper',
    name: 'createColorEyeDropper / bindColorEyeDropper',
    kind: 'Function',
    description:
      'Headless screen sampling and a native button binding. Create per owner and destroy on unmount. Both helpers use the same cancellation and store update logic as the framework components.',
    fields: [
      f(
        'store',
        'ColorStore',
        'Required',
        'The selected color context. Sampling respects its disabled state.',
        'createColorEyeDropper(store)',
      ),
      f(
        'mount()',
        '() => void',
        'Explicit client mount',
        'Detects browser support and subscribes to context disablement. Initial supported is false for deterministic SSR. The DOM binding mounts automatically.',
        'eye.mount()',
      ),
      f(
        'pick(options?)',
        '({preserveAlpha?:boolean}) => Promise<string | undefined>',
        'preserveAlpha: true',
        'Call directly from a user click. Resolves with opaque #RRGGBB, or undefined on cancellation, disablement or a repeated pending request. Other failures reject and populate state.error.',
        'await eye.pick({preserveAlpha:false})',
      ),
      f(
        'getSnapshot() / subscribe(listener)',
        'ColorEyeDropperState / () => void',
        'supported:false, pending:false',
        'Read supported, pending and error. subscribe returns an unsubscribe function.',
        'const stop = eye.subscribe(() => console.log(eye.getSnapshot()))',
      ),
      f(
        'cancel() / destroy()',
        '() => void',
        'Explicit',
        'Cancel aborts a pending request. Destroy also removes the store subscription and listeners. Late responses cannot modify a disposed context.',
        'eye.cancel(); eye.destroy()',
      ),
      f(
        'bindColorEyeDropper(button, store, options?)',
        'HTMLButtonElement, ColorStore, ColorEyeDropperBindingOptions',
        'Required button and store',
        'Keeps your button markup. Options include preserveAlpha, disabled getter, onPick, onError and onStateChange. Returns controller, refresh and destroy. Refresh after changing local disabled state.',
        'const binding = bindColorEyeDropper(button, store, {disabled:()=>saving})',
      ),
      f(
        'isEyeDropperSupported(host?)',
        'boolean',
        'Current browser',
        'Feature detection with an optional host for iframes. False on servers, unavailable browsers and insecure contexts.',
        'isEyeDropperSupported()',
      ),
    ],
    example: {
      file: 'Usage.ts',
      code: `import {createColorStore,bindColorEyeDropper} from '@salyra-ui/color-picker';
const store=createColorStore('#5268E080');
const button=document.createElement('button');
button.textContent='Pick from screen';
const binding=bindColorEyeDropper(button,store,{onPick:hex=>console.log(hex)});
// When removing this control:
binding.destroy();`,
    },
  },
];
