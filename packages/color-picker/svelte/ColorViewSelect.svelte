<script lang="ts">
  import { colorViews, type ColorView } from '../core';
  import { useColor, useColorStore } from './context';
  let {
    label = 'Picker view',
    class: className = '',
  }: { label?: string; class?: string } = $props();
  const color = useColor(),
    store = useColorStore();
</script>

<label class="cp-format {className}"
  >{label}<select
    data-cp-part="select"
    value={$color.view}
    onchange={(e) => store.setView(e.currentTarget.value as ColorView)}
    >{#each colorViews as view}<option value={view}
        >{view === 'area' ? 'Rectangle' : 'Wheel'}</option
      >{/each}</select
  ></label
>
