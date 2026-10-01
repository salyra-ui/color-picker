<script setup lang="ts">
import { shallowRef, watchEffect, onScopeDispose } from 'vue';
import type { ColorCollectionStore, ColorCollectionClasses } from '../core';
import { useColor } from './context';
import ColorSwatch from './ColorSwatch.vue';
const props = withDefaults(
  defineProps<{
    collection: ColorCollectionStore;
    kind?: 'recent' | 'favorites';
    label?: string;
    classes?: ColorCollectionClasses;
  }>(),
  { kind: 'recent', label: 'Recent colors' },
);
const color = useColor(),
  state = shallowRef(props.collection.getSnapshot());
watchEffect((onCleanup) => {
  state.value = props.collection.getSnapshot();
  onCleanup(
    props.collection.subscribe(
      () => (state.value = props.collection.getSnapshot()),
    ),
  );
});
</script>
<template>
  <fieldset
    :class="['cp-collection', classes?.root]"
    :disabled="color.disabled"
  >
    <legend :class="classes?.label">{{ label }}</legend>
    <span v-for="value in state[kind]" :key="value" :class="classes?.item"
      ><ColorSwatch :value="value" :label="value"
    /></span>
  </fieldset>
</template>
