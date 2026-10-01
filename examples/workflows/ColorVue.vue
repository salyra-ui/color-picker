<script setup lang="ts">
import { shallowRef, ref, onMounted, onBeforeUnmount } from 'vue';
import {
  ColorProvider,
  ColorArea,
  ColorSlider,
  ColorInput,
  ColorCollection,
} from '@salyra-ui/color-picker/vue';
import '@salyra-ui/color-picker/styles.min.css';
import './workflow.css';
import { createDemo } from './color-controller';
const demo = createDemo(),
  view = shallowRef(demo.getSnapshot()),
  root = ref<HTMLFormElement>();
const stop = demo.subscribe(() => (view.value = demo.getSnapshot()));
let detach: (() => void) | undefined;
onMounted(() => {
  detach = demo.mount(root.value!);
});
onBeforeUnmount(() => {
  stop();
  detach?.();
  demo.destroy();
});
</script>
<template>
  <form ref="root" class="recipe" @submit.prevent="demo.submit(root!)">
    <ColorProvider :store="demo.store"
      ><ColorArea /><ColorSlider channel="h" /><ColorSlider
        channel="alpha" /><ColorInput /><ColorCollection
        :collection="demo.collection"
        kind="favorites"
        label="Favorite colors" /><ColorCollection
        :collection="demo.collection"
    /></ColorProvider>
    <div class="recipe-actions">
      <button type="button" @click="demo.collection.remember(view.color.value)">
        Save color</button
      ><button
        type="button"
        @click="demo.collection.toggleFavorite(view.color.value)"
      >
        Toggle favorite</button
      ><button
        type="button"
        :disabled="!view.history.canUndo"
        @click="demo.history.undo"
      >
        Undo</button
      ><button
        type="button"
        :disabled="!view.history.canRedo"
        @click="demo.history.redo"
      >
        Redo</button
      ><button type="reset">Reset</button><button type="submit">Submit</button>
    </div>
    <p>
      Text on white: {{ view.contrast.ratio.toFixed(2) }}:1 ·
      {{ view.contrast.aa ? 'AA passes' : 'AA fails' }}
    </p>
    <output class="recipe-output" aria-live="polite">{{
      view.submitted
    }}</output>
  </form>
</template>
