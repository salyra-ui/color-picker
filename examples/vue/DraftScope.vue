<script setup lang="ts">
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
</template>
