<script lang="ts">
  import { onMount, untrack, type Snippet } from 'svelte';
  import { createColorStore, subscribeColor, type ColorStore } from '../core';
  import { provideColor } from './context';
  let {
    store: provided,
    value = $bindable(),
    defaultValue,
    disabled,
    onValueChange,
    children,
  }: {
    store?: ColorStore;
    value?: string;
    defaultValue?: string;
    disabled?: boolean;
    onValueChange?: (value: string) => void;
    children: Snippet;
  } = $props();
  const store = provideColor(
    untrack(
      () =>
        provided ??
        createColorStore(value ?? defaultValue, 'hex', 'area', disabled),
    ),
  );
  untrack(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  });
  $effect(() => {
    if (disabled !== undefined) store.setDisabled(disabled);
  });
  $effect(() => {
    if (value !== undefined) store.setHex(value);
  });
  onMount(() =>
    subscribeColor(store, (hex) => {
      value = hex;
      onValueChange?.(hex);
    }),
  );
</script>

{@render children()}
