<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import {
    createColorEyeDropper,
    type ColorEyeDropperController,
    type ColorEyeDropperState,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    preserveAlpha = true,
    onPick,
    onPickError,
    children,
    onclick,
    disabled = false,
    ref = $bindable(),
    ...attributes
  }: Omit<HTMLButtonAttributes, 'children'> & {
    preserveAlpha?: boolean;
    onPick?: (hex: string) => void;
    onPickError?: (error: Error) => void;
    children?: Snippet<[ColorEyeDropperState]>;
    ref?: HTMLButtonElement;
  } = $props();
  const color = useColor(),
    store = useColorStore();
  let eye: ColorEyeDropperController | undefined;
  let state = $state<ColorEyeDropperState>({
    supported: false,
    pending: false,
    error: undefined,
  });
  onMount(() => {
    eye = createColorEyeDropper(store);
    const stop = eye.subscribe(() => (state = eye!.getSnapshot()));
    eye.mount();
    return () => {
      stop();
      eye?.destroy();
      eye = undefined;
    };
  });
  $effect(() => {
    if (disabled) eye?.cancel();
  });
</script>

<button
  type="button"
  aria-label="Pick color from screen"
  {...attributes}
  bind:this={ref}
  disabled={disabled || $color.disabled || !state.supported || state.pending}
  data-cp-part="eyedropper"
  data-cp-supported={state.supported}
  aria-busy={state.pending}
  onclick={(event) => {
    onclick?.(event);
    if (event.defaultPrevented || disabled) return;
    void eye
      ?.pick({ preserveAlpha })
      .then((hex) => {
        if (hex) onPick?.(hex);
      })
      .catch((error) => onPickError?.(error));
  }}
>
  {#if children}{@render children(state)}{:else}Pick from screen{/if}
</button>
