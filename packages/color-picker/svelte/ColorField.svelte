<script lang="ts">
  import { untrack } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import {
    bindColorValueInput,
    colorInputAttributes,
    type ColorInputOptions,
  } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    format,
    index,
    disabled = false,
    ref = $bindable(),
    ...attributes
  }: Omit<HTMLInputAttributes, 'value'> &
    ColorInputOptions & { ref?: HTMLInputElement } = $props();
  const store = useColorStore(),
    color = useColor();
  const initial = untrack(
    () => colorInputAttributes(store.getSnapshot(), { format, index }).value,
  );
  const inputAttributes = $derived.by(() => {
    const { value, ...rest } = colorInputAttributes($color, { format, index });
    return rest;
  });
  $effect(() => {
    if (ref)
      return bindColorValueInput(
        ref,
        store,
        { format, index },
        () => !!disabled,
      );
  });
</script>

<input
  {...inputAttributes}
  {...attributes}
  value={initial}
  disabled={disabled || $color.disabled}
  bind:this={ref}
  data-cp-part="input"
  spellcheck="false"
/>
