<script lang="ts">
  import { untrack } from 'svelte';
  import {
    channelSpecs,
    channelValue,
    setColorChannel,
    type ChannelFormat,
    type ChannelIndex,
  } from '../core';
  import type { ColorPartClasses } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    format,
    index,
    class: className = '',
    classes = {},
  }: {
    format: ChannelFormat;
    index: ChannelIndex;
    classes?: ColorPartClasses;
    class?: string;
  } = $props();
  const color = useColor(),
    store = useColorStore(),
    spec = $derived(channelSpecs[format][index]);
  let draft = $state(
      untrack(() => channelValue(store.getSnapshot(), format, index)),
    ),
    focused = $state(false),
    invalid = $state(false);
  $effect(() => {
    if (!focused) {
      draft = channelValue($color, format, index);
      invalid = false;
    }
  });
  function change(raw: string) {
    draft = raw;
    try {
      if (!raw.trim()) throw new Error('Incomplete');
      setColorChannel(store, format, index, Number(raw));
      invalid = false;
    } catch {
      invalid = true;
    }
  }
  function reset() {
    draft = channelValue(store.getSnapshot(), format, index);
    invalid = false;
  }
</script>

<label class="cp-channel {className} {classes.root ?? ''} {classes.label ?? ''}"
  ><span class={classes.text}>{spec.label}</span><span class="cp-channel-field"
    ><input
      data-cp-part="input"
      class={classes.input}
      type="number"
      aria-label="{format.toUpperCase()} {spec.label}"
      min={spec.min}
      max={spec.max}
      step={spec.step}
      value={draft}
      aria-invalid={invalid}
      onfocus={() => (focused = true)}
      oninput={(e) => change(e.currentTarget.value)}
      onblur={() => {
        focused = false;
        reset();
      }}
      onkeydown={(e) => {
        if (e.key === 'Enter') reset();
      }}
    /><span aria-hidden="true">{spec.unit}</span></span
  ></label
>
