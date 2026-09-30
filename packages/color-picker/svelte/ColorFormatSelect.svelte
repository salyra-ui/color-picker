<script lang="ts">
  import { colorFormats, type ColorFormat } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    label = 'Color format',
    class: className = '',
  }: { label?: string; class?: string } = $props();
  const color = useColor(),
    store = useColorStore();
</script>

<label class="cp-format {className}"
  >{label}<select
    data-cp-part="select"
    value={$color.format}
    onchange={(e) => store.setFormat(e.currentTarget.value as ColorFormat)}
    >{#each colorFormats as format}<option value={format}
        >{format.toUpperCase()}</option
      >{/each}</select
  ></label
>
