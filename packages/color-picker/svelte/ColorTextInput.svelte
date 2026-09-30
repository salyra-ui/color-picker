<script lang="ts">
  import { untrack } from 'svelte';
  import { parseColor, formatColor, type ColorFormat } from '../core';
  import type { ColorPartClasses } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    format: override,
    label,
    class: className = '',
    classes = {},
  }: {
    format?: ColorFormat;
    label?: string;
    classes?: ColorPartClasses;
    class?: string;
  } = $props();
  const store = useColorStore(),
    color = useColor();
  const format = $derived(override ?? $color.format);
  let draft = $state(
      untrack(() =>
        formatColor(store.getSnapshot().hex, format, store.getSnapshot().alpha),
      ),
    ),
    invalid = $state(false),
    focused = $state(false);
  $effect(() => {
    if (!focused) {
      draft = formatColor($color.hex, format, $color.alpha);
      invalid = false;
    }
  });
  function change(text: string) {
    draft = text;
    try {
      store.setHex(parseColor(text, format));
      invalid = false;
    } catch {
      invalid = true;
    }
  }
  function reset() {
    draft = formatColor(
      store.getSnapshot().hex,
      format,
      store.getSnapshot().alpha,
    );
    invalid = false;
  }
</script>

<label class="cp-input {className} {classes.root ?? ''} {classes.label ?? ''}"
  >{label ?? format.toUpperCase()}<input
    data-cp-part="input"
    class={classes.input}
    value={draft}
    spellcheck="false"
    maxlength={format === 'hex' ? 9 : 64}
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
  /></label
>
