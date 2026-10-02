<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { ColorFormat, ColorPartClasses } from '../core';
  import { useColor } from './context';
  import ColorField from './ColorField.svelte';
  let {
    format: override,
    label,
    class: className = '',
    classes = {},
    ...attributes
  }: Omit<HTMLInputAttributes, 'value'> & {
    format?: ColorFormat;
    label?: string;
    classes?: ColorPartClasses;
  } = $props();
  const color = useColor();
  const format = $derived(override ?? $color.format);
</script>

<label class="cp-input {className} {classes.root ?? ''} {classes.label ?? ''}"
  >{label ?? format.toUpperCase()}<ColorField
    {...attributes}
    {format}
    class={classes.input}
  /></label
>
