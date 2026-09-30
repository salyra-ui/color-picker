import { render } from 'svelte/server';
import { createSSRApp } from 'vue';
import { renderToString } from '@vue/server-renderer';
import SvelteSSR from './SvelteSSR.svelte';
import VueSSR from './VueSSR.vue';
import { generateTheme } from '@sebytza23/theme-kit';
export async function renderFramework(framework: string, hex: string) {
  const theme = generateTheme(hex);
  return framework === 'svelte'
    ? render(SvelteSSR, { props: { theme } }).body
    : await renderToString(createSSRApp(VueSSR, { theme }));
}
