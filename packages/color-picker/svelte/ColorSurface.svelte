<script lang="ts">
  import { useColor } from './context';
  import ColorArea from './ColorArea.svelte';
  import ColorWheel from './ColorWheel.svelte';
  import ColorSlider from './ColorSlider.svelte';
  const state = useColor();
</script>

{#if $state.view === 'wheel'}<ColorWheel /><ColorSlider
    channel="v"
  />{:else}<ColorArea /><ColorSlider />{/if}
