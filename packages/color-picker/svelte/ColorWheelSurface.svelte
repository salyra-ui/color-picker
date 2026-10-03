<script lang="ts">
  import ColorPlane from './ColorPlane.svelte';
  import type { ComponentProps } from 'svelte';
  let {
    ref = $bindable(),
    ...props
  }: Omit<ComponentProps<typeof ColorPlane>, 'view'> = $props();
</script>

<ColorPlane {...props} view="wheel" bind:ref />
