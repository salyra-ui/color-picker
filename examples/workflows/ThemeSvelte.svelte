<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ThemeProvider,
    ThemePicker,
    ThemeName,
    ThemeRadius,
    ThemeBorderWidth,
    ThemeHarmony,
    ThemeBackground,
    ThemeSelect,
  } from '@salyra-ui/theme-studio/svelte';
  import '@salyra-ui/theme-studio/styles.min.css';
  import './workflow.css';
  import { createDemo } from './theme-controller';
  const demo = createDemo();
  let root: HTMLDivElement,
    view = $state(demo.getSnapshot());
  onMount(() => {
    const stop = demo.subscribe(() => (view = demo.getSnapshot())),
      detach = demo.mount(root);
    return () => {
      stop();
      detach();
      demo.destroy();
    };
  });
</script>

<div bind:this={root} class="recipe">
  <ThemeProvider store={demo.editor.store} options={{ modeStorage: false }}>
    <ThemePicker view="shared-wheel" /><ThemeName /><ThemeRadius
      target="card"
    /><ThemeBorderWidth target="card" />
    <ThemeHarmony /><ThemeBackground />
    <ThemeSelect
      themes={view.collection.recent}
      label="Recent themes"
    /><ThemeSelect themes={view.collection.favorites} label="Favorite themes" />
  </ThemeProvider>
  <label
    ><input
      type="checkbox"
      checked={view.session.locked.includes('accent')}
      onchange={(e) => demo.editor.setLocked('accent', e.currentTarget.checked)}
    />Lock accent during generation</label
  >
  <label
    ><input
      type="checkbox"
      checked={view.session.live}
      onchange={(e) => demo.editor.setLive(e.currentTarget.checked)}
    />Apply changes live</label
  >
  <div class="recipe-actions">
    <button
      type="button"
      disabled={!view.history.canUndo}
      onclick={demo.editor.history.undo}>Undo</button
    >
    <button
      type="button"
      disabled={!view.history.canRedo}
      onclick={demo.editor.history.redo}>Redo</button
    >
    <button
      type="button"
      disabled={!view.session.dirty || view.session.conflict}
      onclick={() => demo.apply()}>Apply</button
    >
    <button
      type="button"
      disabled={!view.session.dirty && !view.session.conflict}
      onclick={demo.editor.cancel}>Cancel</button
    >
    <button
      type="button"
      onclick={() =>
        demo.collection.toggleFavorite(demo.target.getSnapshot().theme)}
      >Favorite applied theme</button
    >
  </div>
  <p role="status">
    {view.session.conflict
      ? 'The applied theme changed. Cancel to load it.'
      : view.session.dirty
        ? 'Unapplied changes'
        : 'Up to date'}
  </p>
  <p>
    Primary text contrast: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast
      .aa
      ? 'AA passes'
      : 'AA fails'}
  </p>
  <ThemeProvider store={demo.target} options={{ modeStorage: false }}
    ><article class="recipe-preview">
      <h2>Applied theme</h2>
      <button type="button">Example button</button>
    </article></ThemeProvider
  >
  <details>
    <summary>Tailwind CSS</summary>
    <pre class="recipe-output">{view.tailwind}</pre>
  </details>
</div>
