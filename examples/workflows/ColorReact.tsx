import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  ColorProvider,
  ColorArea,
  ColorSlider,
  ColorInput,
  ColorCollection,
} from '@salyra-ui/color-picker/react';
import '@salyra-ui/color-picker/styles.min.css';
import './workflow.css';
import { createDemo } from './color-controller';
export default function App() {
  const [demo] = useState(createDemo);
  const view = useSyncExternalStore(
    demo.subscribe,
    demo.getSnapshot,
    demo.getSnapshot,
  );
  const root = useRef<HTMLFormElement>(null),
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
    <form
      ref={root}
      className="recipe"
      onSubmit={(e) => {
        e.preventDefault();
        demo.submit(e.currentTarget);
      }}
    >
      <ColorProvider store={demo.store}>
        <ColorArea />
        <ColorSlider channel="h" />
        <ColorSlider channel="alpha" />
        <ColorInput />
        <ColorCollection
          collection={demo.collection}
          kind="favorites"
          label="Favorite colors"
        />
        <ColorCollection collection={demo.collection} />
      </ColorProvider>
      <div className="recipe-actions">
        <button
          type="button"
          onClick={() => demo.collection.remember(view.color.value)}
        >
          Save color
        </button>
        <button
          type="button"
          onClick={() => demo.collection.toggleFavorite(view.color.value)}
        >
          Toggle favorite
        </button>
        <button
          type="button"
          disabled={!view.history.canUndo}
          onClick={demo.history.undo}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!view.history.canRedo}
          onClick={demo.history.redo}
        >
          Redo
        </button>
        <button type="reset">Reset</button>
        <button type="submit">Submit</button>
      </div>
      <p>
        Text on white: {view.contrast.ratio.toFixed(2)}:1 ·{' '}
        {view.contrast.aa ? 'AA passes' : 'AA fails'}
      </p>
      <output className="recipe-output" aria-live="polite">
        {view.submitted}
      </output>
    </form>
  );
}
