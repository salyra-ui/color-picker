import { useEffect, useState } from 'react';
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
}
