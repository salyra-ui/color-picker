<script lang="ts">
  import { onMount, untrack, type Snippet } from 'svelte';
  import {
    subscribeColor,
    createColorStore,
    type ColorView,
    type ColorStore,
  } from '../core';
  import { provideColor } from './context';
  let {
    value,
    view = 'area',
    onChange,
    children,
    store: provided,
  }: {
    value?: string;
    view?: ColorView;
    onChange?: (hex: string) => void;
    children: Snippet;
    store?: ColorStore;
  } = $props();
  const store = provideColor(
    untrack(() => provided ?? createColorStore(value, 'hex', view)),
  );
  $effect(() => {
    if (value !== undefined) store.setHex(value);
  });
  onMount(() => subscribeColor(store, (hex) => onChange?.(hex)));
</script>

{@render children()}
