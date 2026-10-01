<script lang="ts">
  import { onMount } from 'svelte';
  import {
    ColorProvider,
    ColorArea,
    ColorSlider,
    ColorInput,
    ColorCollection,
  } from '@salyra-ui/color-picker/svelte';
  import '@salyra-ui/color-picker/styles.min.css';
  import './workflow.css';
  import { createDemo } from './color-controller';
  const demo = createDemo();
  let root: HTMLFormElement,
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

<form
  bind:this={root}
  class="recipe"
  onsubmit={(e) => {
    e.preventDefault();
    demo.submit(e.currentTarget);
  }}
>
  <ColorProvider store={demo.store}
    ><ColorArea /><ColorSlider channel="h" /><ColorSlider
      channel="alpha"
    /><ColorInput /><ColorCollection
      collection={demo.collection}
      kind="favorites"
      label="Favorite colors"
    /><ColorCollection collection={demo.collection} /></ColorProvider
  >
  <div class="recipe-actions">
    <button
      type="button"
      onclick={() => demo.collection.remember(view.color.value)}
      >Save color</button
    ><button
      type="button"
      onclick={() => demo.collection.toggleFavorite(view.color.value)}
      >Toggle favorite</button
    ><button
      type="button"
      disabled={!view.history.canUndo}
      onclick={demo.history.undo}>Undo</button
    ><button
      type="button"
      disabled={!view.history.canRedo}
      onclick={demo.history.redo}>Redo</button
    ><button type="reset">Reset</button><button type="submit">Submit</button>
  </div>
  <p>
    Text on white: {view.contrast.ratio.toFixed(2)}:1 · {view.contrast.aa
      ? 'AA passes'
      : 'AA fails'}
  </p>
  <output class="recipe-output" aria-live="polite">{view.submitted}</output>
</form>
