import type { Integration } from './snippets';

// These are complete components, rather than pseudocode involving an undefined App or Preview.
export function draftScopeExample(integration: Integration): string {
  if (integration === 'React')
    return `import { useEffect, useState } from 'react';
import { ColorPicker } from '@salyra-ui/color-picker/react';
import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme, type ThemeStore } from '@salyra-ui/theme-studio/react';

export default function App() {
  // Create a store for this mounted app, never a shared server module variable.
  const [applied] = useState(() => createThemeStore({theme: generateTheme('#5268E0'), modeStorage:false}));
  return <ThemeProvider store={applied} modeStorage={false}>
    <button style={{background:'hsl(var(--primary))',color:'hsl(var(--primary-foreground))'}}>Applied theme</button>
    <DraftPreview applied={applied} />
  </ThemeProvider>;
}
function DraftPreview({applied}: {applied:ThemeStore}) {
  const [editor, setEditor] = useState<ReturnType<typeof createThemeEditor> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const next = createThemeEditor(applied);
    setEditor(next);
    return () => next.destroy();
  }, [applied]);
  if (!editor) return <p role="status">Preparing editor…</p>;
  return <ThemeStudio.Root store={editor.store} options={{modeStorage:false}}>
    <ThemeStudio.Scope className="draft-preview">
      <ThemeStudio.PickerRoot roles={['primary']}>
        <label>Draft primary<ColorPicker.Input format="hex" /></label>
      </ThemeStudio.PickerRoot>
      <button style={{background:'hsl(var(--primary))',color:'hsl(var(--primary-foreground))'}}>Draft theme</button>
      <button onClick={() => {try {editor.apply();setError('');} catch(e) {setError(String(e));}}}>Save</button>
      <button onClick={() => {editor.cancel();setError('');}}>Cancel</button>
      <p role="status">{error}</p>
    </ThemeStudio.Scope>
  </ThemeStudio.Root>;
}`;
  if (integration === 'Svelte')
    return `<script lang="ts">
  import { onDestroy } from 'svelte';
  import { ColorPicker } from '@salyra-ui/color-picker/svelte';
  import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/svelte';
  const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
  const editor = createThemeEditor(applied);
  let error = $state('');
  function save() {try {editor.apply();error='';} catch(e) {error=String(e);}}
  onDestroy(() => editor.destroy());
</script>

<ThemeProvider store={applied} options={{modeStorage:false}}>
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <ThemeStudio.Root store={editor.store} options={{modeStorage:false}}>
    <ThemeStudio.Scope class="draft-preview">
      <ThemeStudio.PickerRoot roles={['primary']}>
        <label>Draft primary<ColorPicker.Input format="hex" /></label>
      </ThemeStudio.PickerRoot>
      <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
      <button onclick={save}>Save</button>
      <button onclick={() => {editor.cancel();error='';}}>Cancel</button>
      <p role="status">{error}</p>
    </ThemeStudio.Scope>
  </ThemeStudio.Root>
</ThemeProvider>`;
  if (integration === 'Vue')
    return `<script setup lang="ts">
import { onScopeDispose, ref } from 'vue';
import { ColorPicker } from '@salyra-ui/color-picker/vue';
import { ThemeProvider, ThemeStudio, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/vue';
const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
const editor = createThemeEditor(applied);
const error = ref('');
function save() {try {editor.apply();error.value='';} catch(e) {error.value=String(e);}}
onScopeDispose(() => editor.destroy());
</script>
<template>
  <ThemeProvider :store="applied" :options="{modeStorage:false}">
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
    <ThemeStudio.Root :store="editor.store" :options="{modeStorage:false}">
      <ThemeStudio.Scope class="draft-preview">
        <ThemeStudio.PickerRoot :roles="['primary']">
          <label>Draft primary<ColorPicker.Input format="hex" /></label>
        </ThemeStudio.PickerRoot>
        <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
        <button @click="save">Save</button>
        <button @click="editor.cancel();error=''">Cancel</button>
        <p role="status">{{error}}</p>
      </ThemeStudio.Scope>
    </ThemeStudio.Root>
  </ThemeProvider>
</template>`;
  if (integration === 'Angular')
    return `import { Component, DestroyRef, inject } from '@angular/core';
import { ColorField } from '@salyra-ui/color-picker/angular';
import { ThemeProvider, ThemeRoot, ThemeVariableScope, ThemePickerRoot, createThemeStore, createThemeEditor, generateTheme } from '@salyra-ui/theme-studio/angular';
@Component({
  selector:'app-root', standalone:true,
  imports:[ThemeProvider,ThemeRoot,ThemeVariableScope,ThemePickerRoot,ColorField],
  template:\`<tk-provider [store]="applied" [options]="options">
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
    <section tkRoot [store]="editor.store" [options]="options">
      <div tkScope class="draft-preview">
        <div tkPickerRoot [options]="pickerOptions"><label>Draft primary<input cpInput format="hex" /></label></div>
        <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
        <button (click)="save()">Save</button>
        <button (click)="editor.cancel();error=''">Cancel</button>
        <p role="status">{{error}}</p>
      </div>
    </section>
  </tk-provider>\`,
})
export class AppComponent {
  readonly options = {modeStorage:false as const};
  readonly pickerOptions = {roles:['primary'] as const};
  readonly applied = createThemeStore({theme:generateTheme('#5268E0'),...this.options});
  readonly editor = createThemeEditor(this.applied);
  error = '';
  constructor() {inject(DestroyRef).onDestroy(() => this.editor.destroy());}
  save() {try {this.editor.apply();this.error='';} catch(e) {this.error=String(e);}}
}`;
  if (integration === 'Astro')
    return `---
import ThemeProvider from '@salyra-ui/theme-studio/astro/ThemeProvider.astro';
import ThemeRoot from '@salyra-ui/theme-studio/astro/ThemeRoot.astro';
import ThemeVariableScope from '@salyra-ui/theme-studio/astro/ThemeVariableScope.astro';
import ThemePickerRoot from '@salyra-ui/theme-studio/astro/ThemePickerRoot.astro';
import ColorField from '@salyra-ui/color-picker/astro/ColorField.astro';
import { generateTheme } from '@salyra-ui/theme-studio';
const value = '#5268E0';
const options = {theme:generateTheme(value),modeStorage:false as const};
---
<ThemeProvider {...options} scopeProps={{id:'applied-preview'}}>
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <ThemeRoot id="draft-root" {options}>
    <ThemeVariableScope {options} class="draft-preview">
      <ThemePickerRoot roles={['primary']}>
        <label>Draft primary<ColorField {value} format="hex" /></label>
      </ThemePickerRoot>
      <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
      <button id="save-draft">Save</button><button id="cancel-draft">Cancel</button>
      <p id="draft-error" role="status"></p>
    </ThemeVariableScope>
  </ThemeRoot>
</ThemeProvider>
<script>
  import { createThemeEditor, type ThemeRootElement } from '@salyra-ui/theme-studio/vanilla';
  const applied = document.querySelector('#applied-preview')!.closest('tk-root') as ThemeRootElement;
  const root = document.querySelector('#draft-root') as ThemeRootElement;
  if (!applied.store) throw new Error('The app theme root has not initialized');
  const editor = createThemeEditor(applied.store);
  root.setStore(editor.store,{modeStorage:false});
  const error = document.querySelector('#draft-error')!;
  document.querySelector('#save-draft')!.addEventListener('click',() => {
    try {editor.apply();error.textContent='';} catch(e) {error.textContent=String(e);}
  });
  document.querySelector('#cancel-draft')!.addEventListener('click',() => {editor.cancel();error.textContent='';});
  window.addEventListener('pagehide',event => {if (!event.persisted) editor.destroy();});
</script>`;
  return `<section id="app-theme">
  <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Applied theme</button>
  <section id="draft-preview">
    <label>Draft primary<input data-cp-control="input" data-format="hex" /></label>
    <button style="background:hsl(var(--primary));color:hsl(var(--primary-foreground))">Draft theme</button>
    <button id="save-draft">Save</button><button id="cancel-draft">Cancel</button>
    <p id="draft-error" role="status"></p>
  </section>
</section>
<script src="./assets/theme-studio.min.js"></script>
<script>
  const {createThemeStore,createThemeEditor,generateTheme,mountThemeStore,bindThemeScope,mountThemeControls} = ThemeStudio;
  const applied = createThemeStore({theme:generateTheme('#5268E0'),modeStorage:false});
  const editor = createThemeEditor(applied);
  const stopApp = mountThemeStore(applied,undefined,{modeStorage:false});
  const appScope = bindThemeScope(document.querySelector('#app-theme'),applied);
  const draftScope = bindThemeScope(document.querySelector('#draft-preview'),editor.store);
  const controls = mountThemeControls(document.querySelector('#draft-preview'),editor.store,{roles:['primary']});
  const error = document.querySelector('#draft-error');
  const save = () => {try {editor.apply();error.textContent='';} catch(e) {error.textContent=String(e);}};
  const cancel = () => {editor.cancel();error.textContent='';};
  const saveButton = document.querySelector('#save-draft'), cancelButton = document.querySelector('#cancel-draft');
  saveButton.addEventListener('click',save);
  cancelButton.addEventListener('click',cancel);
  window.addEventListener('pagehide',event => {
    if (event.persisted) return;
    saveButton.removeEventListener('click',save);
    cancelButton.removeEventListener('click',cancel);
    controls.destroy();draftScope();appScope();stopApp();editor.destroy();
  });
</script>`;
}
