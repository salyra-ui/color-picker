<script lang="ts">
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
</ThemeProvider>
