<script lang="ts">
  import { onMount, untrack, type Snippet } from 'svelte';
  import {
    subscribeColor,
    createColorStore,
    type ColorView,
    type ColorStore,
  } from '../core';
  import { provideColor, useColor } from './context';
  let {
    value,
    view = 'area',
    onChange,
    children,
    disabled,
    store: provided,
  }: {
    value?: string;
    disabled?: boolean;
    view?: ColorView;
    onChange?: (hex: string) => void;
    children: Snippet;
    store?: ColorStore;
  } = $props();
  const store = provideColor(
    untrack(() => provided ?? createColorStore(value, 'hex', view, disabled)),
  );
  untrack(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  });
  const color = useColor();
  $effect(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  });
  $effect(() => {
    if (value !== undefined) store.setHex(value);
  });
  onMount(() => subscribeColor(store, (hex) => onChange?.(hex)));
</script>

<fieldset
  class="cp-provider-controls"
  disabled={$color.disabled}
  inert={$color.disabled}
  aria-disabled={$color.disabled}
  data-disabled={$color.disabled}
>
  {@render children()}
</fieldset>
