<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import {
    channelSpecs,
    type ChannelFormat,
    type ChannelIndex,
    type ColorPartClasses,
  } from '../core';
  import ColorField from './ColorField.svelte';
  let {
    format,
    index,
    class: className = '',
    classes = {},
    ...attributes
  }: Omit<HTMLInputAttributes, 'value'> & {
    format: ChannelFormat;
    index: ChannelIndex;
    classes?: ColorPartClasses;
  } = $props();
  const spec = $derived(channelSpecs[format][index]);
</script>

<label class="cp-channel {className} {classes.root ?? ''} {classes.label ?? ''}"
  ><span class={classes.text}>{spec.label}</span>
  <span class="cp-channel-field"
    ><ColorField {...attributes} {format} {index} class={classes.input} /><span
      aria-hidden="true">{spec.unit}</span
    ></span
  ></label
>
