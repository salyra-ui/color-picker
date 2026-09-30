<script setup lang="ts">
import { useColor } from './context';
import ColorArea from './ColorArea.vue';
import ColorWheel from './ColorWheel.vue';
import ColorSlider from './ColorSlider.vue';
const state = useColor();
</script>
<template>
  <ColorWheel v-if="state.view === 'wheel'" /><ColorArea v-else /><ColorSlider
    :channel="state.view === 'wheel' ? 'v' : 'h'"
  />
</template>
