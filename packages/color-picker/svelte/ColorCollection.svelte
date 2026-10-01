<script lang="ts">
  import { untrack } from 'svelte';
  import {
    type ColorCollectionStore,
    type ColorCollectionClasses,
  } from '../core';
  import { useColor } from './context';
  import ColorSwatch from './ColorSwatch.svelte';
  let {
    collection,
    kind = 'recent',
    label = 'Recent colors',
    classes = {},
  }: {
    collection: ColorCollectionStore;
    kind?: 'recent' | 'favorites';
    label?: string;
    classes?: ColorCollectionClasses;
  } = $props();
  const color = useColor();
  let state = $state(untrack(() => collection.getSnapshot()));
  $effect(() => {
    const current = collection;
    state = current.getSnapshot();
    return current.subscribe(() => (state = current.getSnapshot()));
  });
</script>

<fieldset class="cp-collection {classes.root ?? ''}" disabled={$color.disabled}>
  <legend class={classes.label}>{label}</legend>
  {#each state[kind] as value (value)}<span class={classes.item}
      ><ColorSwatch {value} label={value} /></span
    >{/each}
</fieldset>
