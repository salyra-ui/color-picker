<script lang="ts">
  import { ColorProvider, ColorMode, createColorStore } from '@sebytza23/color-picker-svelte';
  const disabledColor = createColorStore('#123456', 'rgb', 'area', true);
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
  } from '@sebytza23/theme-kit-svelte';
  let { theme }: { theme: Theme } = $props();
</script>

<ThemeProvider options={{ theme }}
  ><ThemeLoading>LOADING</ThemeLoading><ThemeReady
    ><ThemeSelect themes={[theme]} /><ThemeExport format="css" /><ThemePicker
      view="shared-wheel"
    /><ThemeGenerator /><ThemeGenerator role="accent" wheel /><ThemeHarmony
    /><ThemeRadius target="card" /></ThemeReady
  ></ThemeProvider
>

<ColorProvider store={disabledColor}><ColorMode>{#snippet children(format)}SSR disabled {format.toUpperCase()}{/snippet}</ColorMode></ColorProvider>
