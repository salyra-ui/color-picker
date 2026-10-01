<script lang="ts">
  import { onMount } from 'svelte';
  import { bindAlphaInput, type ColorPartClasses } from '../core';
  import { useColorStore } from './context';
  let {
    label = 'Alpha',
    class: className = '',
    classes = {},
  }: { label?: string; class?: string; classes?: ColorPartClasses } = $props();
  const store = useColorStore(),
    initial = Number((store.getSnapshot().alpha * 100).toFixed(1));
  let input: HTMLInputElement;
  onMount(() => bindAlphaInput(input, store));
</script>

<label
  class="cp-alpha-input cp-channel {className} {classes.root ??
    ''} {classes.label ?? ''}"
  data-cp-part="alpha-input"
  >{label}<span class="cp-channel-field"
    ><input
      bind:this={input}
      data-cp-part="input"
      class={classes.input}
      type="number"
      min="0"
      max="100"
      step="0.1"
      value={initial}
      aria-label={label}
    /><span>%</span></span
  ></label
>
