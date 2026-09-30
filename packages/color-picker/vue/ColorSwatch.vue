<script setup lang="ts">
import { useColorStore } from './context';
defineProps<{ value: string; label?: string }>();
const store = useColorStore();
</script>
<template>
  <button
    type="button"
    class="cp-swatch"
    :aria-label="label ?? value"
    :style="{ background: value }"
    @click="store.setHex(value)"
  />
</template>
