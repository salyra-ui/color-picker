import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  ThemeProvider,
  ThemePicker,
  ThemeName,
  ThemeRadius,
  ThemeBorderWidth,
  ThemeHarmony,
  ThemeBackground,
  ThemeSelect,
} from '@salyra-ui/theme-studio/react';
import '@salyra-ui/theme-studio/styles.min.css';
import './workflow.css';
import { createDemo } from './theme-controller';
export default function App() {
  const [demo] = useState(createDemo);
  const view = useSyncExternalStore(
    demo.subscribe,
    demo.getSnapshot,
    demo.getSnapshot,
  );
  const root = useRef<HTMLDivElement>(null),
    lifecycle = useRef(0);
  useEffect(() => {
    const lease = ++lifecycle.current,
      detach = demo.mount(root.current!);
    return () => {
      detach();
      queueMicrotask(() => {
        if (lifecycle.current === lease) demo.destroy();
      });
    };
  }, [demo]);
  return (
    <div ref={root} className="recipe">
      <ThemeProvider store={demo.editor.store} modeStorage={false}>
        <ThemePicker view="shared-wheel" />
        <ThemeName />
        <ThemeRadius target="card" />
        <ThemeBorderWidth target="card" />
        <ThemeHarmony />
        <ThemeBackground />
        <ThemeSelect themes={view.collection.recent} label="Recent themes" />
        <ThemeSelect
          themes={view.collection.favorites}
          label="Favorite themes"
        />
      </ThemeProvider>
      <label>
        <input
          type="checkbox"
          checked={view.session.locked.includes('accent')}
          onChange={(e) => demo.editor.setLocked('accent', e.target.checked)}
        />
        Lock accent during generation
      </label>
      <label>
        <input
          type="checkbox"
          checked={view.session.live}
          onChange={(e) => demo.editor.setLive(e.target.checked)}
        />
        Apply changes live
      </label>
      <div className="recipe-actions">
        <button
          type="button"
          disabled={!view.history.canUndo}
          onClick={demo.editor.history.undo}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!view.history.canRedo}
          onClick={demo.editor.history.redo}
        >
          Redo
        </button>
        <button
          type="button"
          disabled={!view.session.dirty || view.session.conflict}
          onClick={() => demo.apply()}
        >
          Apply
        </button>
        <button
          type="button"
          disabled={!view.session.dirty && !view.session.conflict}
          onClick={demo.editor.cancel}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() =>
            demo.collection.toggleFavorite(demo.target.getSnapshot().theme)
          }
        >
          Favorite applied theme
        </button>
      </div>
      <p role="status">
        {view.session.conflict
          ? 'The applied theme changed. Cancel to load it.'
          : view.session.dirty
            ? 'Unapplied changes'
            : 'Up to date'}
      </p>
      <p>
        Primary text contrast: {view.contrast.ratio.toFixed(2)}:1 ·{' '}
        {view.contrast.aa ? 'AA passes' : 'AA fails'}
      </p>
      <ThemeProvider store={demo.target} modeStorage={false}>
        <article className="recipe-preview">
          <h2>Applied theme</h2>
          <button type="button">Example button</button>
        </article>
      </ThemeProvider>
      <details>
        <summary>Tailwind CSS</summary>
        <pre className="recipe-output">{view.tailwind}</pre>
      </details>
    </div>
  );
}
