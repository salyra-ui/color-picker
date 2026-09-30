<script setup lang="ts">
import type { Theme } from '@sebytza23/theme-kit';
import {
  ThemeSelect,
  ThemeExport,
  ThemePicker,
  ThemeProvider,
  ThemeLoading,
  ThemeReady,
  ThemeHarmony,
  ThemeRadius,
  ThemeGenerator,
} from '@sebytza23/theme-kit-vue';
defineProps<{ theme: Theme }>();
</script>
<template>
  <ThemeProvider :options="{ theme }"
    ><ThemeLoading>LOADING</ThemeLoading
    ><ThemeReady
      ><ThemeSelect :themes="[theme]" /><ThemeExport format="css" /><ThemePicker
        view="shared-wheel" /><ThemeGenerator /><ThemeGenerator
        role="accent"
        wheel /><ThemeHarmony /><ThemeRadius target="card" /></ThemeReady
  ></ThemeProvider>
</template>
