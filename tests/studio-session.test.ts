import { describe, it, expect, vi } from 'vitest';
import {
  createThemeStore,
  generateTheme,
  createThemeEditor,
  themeColor,
  themeConfiguration,
  mergeThemeConfiguration,
  parseTheme,
  themeTailwind,
  createThemeHistory,
  mountThemeStore,
  createThemeCollection,
} from '@salyra-ui/theme-studio';
describe('theme editing sessions', () => {
  it('keeps draft colors, mode and storage isolated until Apply', async () => {
    const write = vi.fn();
    const applied = createThemeStore({
      theme: generateTheme('#5268E0'),
      modeStorage: false,
    });
    const unmount = mountThemeStore(
      applied,
      { read: () => null, write },
      { modeStorage: false },
    );
    await applied.start();
    const editor = createThemeEditor(applied);
    editor.store.setColor('primary', '#123456');
    editor.store.setMode('dark');
    expect(themeColor(applied.getSnapshot().theme, 'primary')).toBe('#5268E0');
    expect(applied.getSnapshot().modePreference).toBe('system');
    expect(editor.getSnapshot().dirty).toBe(true);
    expect(write).not.toHaveBeenCalled();
    editor.apply();
    expect(themeColor(applied.getSnapshot().theme, 'primary')).toBe('#123456');
    expect(applied.getSnapshot().modePreference).toBe('dark');
    editor.store.setBorder('radius', 'card', 2);
    editor.cancel();
    expect(editor.store.getSnapshot().theme).toEqual(
      applied.getSnapshot().theme,
    );
    expect(editor.history.getSnapshot().canUndo).toBe(false);
    unmount();
    editor.destroy();
    expect(write).toHaveBeenCalledTimes(1);
  });
  it('does not replace a remote change silently', () => {
    const target = createThemeStore();
    const editor = createThemeEditor(target);
    editor.store.setName('Draft');
    target.setName('Remote');
    expect(editor.getSnapshot()).toMatchObject({ dirty: true, conflict: true });
    expect(editor.store.getSnapshot().theme.name).toBe('Draft');
    expect(() => editor.apply()).toThrow('changed');
    editor.apply({ force: true });
    expect(target.getSnapshot().theme.name).toBe('Draft');
    target.setName('Next');
    expect(editor.store.getSnapshot().theme.name).toBe('Next');
    editor.destroy();
  });
  it('groups drags, supports redo and discards an abandoned future', () => {
    const store = createThemeStore();
    const history = createThemeHistory(store);
    const initial = store.getSnapshot().theme;
    history.begin();
    store.setColor('primary', '#123456');
    store.setColor('primary', '#654321');
    history.end();
    expect(history.getSnapshot().length).toBe(2);
    history.undo();
    expect(store.getSnapshot().theme).toEqual(initial);
    history.redo();
    expect(themeColor(store.getSnapshot().theme, 'primary')).toBe('#654321');
    history.undo();
    store.setName('Another edit');
    expect(history.getSnapshot().canRedo).toBe(false);
    history.destroy();
  });
  it('regenerates only visible unlocked roles and keeps geometry', () => {
    const target = createThemeStore({
      selection: { roles: ['primary', 'accent'], radius: ['card'] },
    });
    const editor = createThemeEditor(target, {
      locked: ['accent', 'background', 'radius:card'],
    });
    const before = editor.store.getSnapshot().theme;
    editor.store.generate('#AA3355');
    const next = editor.store.getSnapshot().theme;
    expect(next.structure.userPreset.accent).toEqual(
      before.structure.userPreset.accent,
    );
    expect(next.structure.userPreset.secondary).toEqual(
      before.structure.userPreset.secondary,
    );
    expect(next.structure.websitePreset).toEqual(
      before.structure.websitePreset,
    );
    expect(themeColor(next, 'primary')).toBe('#AA3355');
    editor.setLocked('primary');
    editor.store.generate('#FFFFFF');
    expect(editor.store.getSnapshot().theme).toBe(next);
    editor.store.setColor('accent', '#FFFFFF');
    expect(themeColor(editor.store.getSnapshot().theme, 'accent')).toBe(
      '#FFFFFF',
    );
    editor.destroy();
  });
  it('makes live mode explicit and applies history changes too', () => {
    const target = createThemeStore();
    const editor = createThemeEditor(target, { live: true });
    const initial = target.getSnapshot().theme;
    editor.store.setName('Live');
    expect(target.getSnapshot().theme.name).toBe('Live');
    editor.history.undo();
    expect(target.getSnapshot().theme).toEqual(initial);
    editor.setLive(false);
    editor.store.setName('Pending');
    expect(target.getSnapshot().theme.name).not.toBe('Pending');
    editor.setLive(true);
    expect(target.getSnapshot().theme.name).toBe('Pending');
    editor.destroy();
  });
});
describe('versioned themes and Tailwind output', () => {
  it('migrates unversioned themes and rejects unsupported future versions', () => {
    const { schemaVersion, ...legacy } = generateTheme('#123456');
    expect(parseTheme(legacy).schemaVersion).toBe(1);
    expect(() => parseTheme({ ...legacy, schemaVersion: 99 })).toThrow(
      'schema version',
    );
    const state = createThemeStore({
      theme: parseTheme(legacy),
      selection: { roles: ['primary'], radius: ['card'] },
    }).getSnapshot();
    const configuration = themeConfiguration(state);
    const saved = JSON.parse(configuration.json);
    expect(saved.schemaVersion).toBe(1);
    expect(saved.theme.schemaVersion).toBe(1);
    expect(
      mergeThemeConfiguration(generateTheme('#FFFFFF'), saved).schemaVersion,
    ).toBe(1);
    expect(() =>
      mergeThemeConfiguration(generateTheme('#FFFFFF'), {
        ...saved,
        schemaVersion: 99,
      }),
    ).toThrow('schema version');
    expect(Object.keys(saved.theme.structure.userPreset)).toEqual(['primary']);
    expect(
      Object.keys(saved.theme.structure.websitePreset.border.radius),
    ).toEqual(['card']);
  });
  it('exports utility mappings for selected tokens, with both requested modes', () => {
    const state = createThemeStore({
      selection: {
        roles: ['primary'],
        radius: ['card'],
        width: ['button'],
        background: true,
        modes: ['light', 'dark'],
      },
    }).getSnapshot();
    const css = themeConfiguration(state).tailwind;
    expect(css).toContain('@theme inline');
    expect(css).toContain('--color-primary: hsl(var(--primary))');
    expect(css).toContain('--radius-card: var(--border-radius-card)');
    expect(css).toContain('@utility border-button');
    expect(css).toContain('.dark {');
    expect(css).not.toContain('--secondary');
    expect(css).not.toContain('--accent');
    expect(css).not.toContain('--border-radius-input');
    expect(
      themeTailwind(state, {
        selector: '.app-theme',
        darkSelector: '.app-theme[data-mode="dark"]',
      }),
    ).toContain('.app-theme[data-mode="dark"] {');
  });
});
it('inherits disabled persistence from an editor store on mount', async () => {
  const target = createThemeStore({
    theme: generateTheme('#5268E0'),
    modeStorage: false,
  });
  const editor = createThemeEditor(target);
  // There is no window in this test. Explicit false must prevent any browser storage access.
  const cleanup = mountThemeStore(editor.store);
  await editor.store.start();
  editor.store.setMode('dark');
  expect(target.getSnapshot().modePreference).toBe('system');
  cleanup();
  editor.destroy();
});

it('stores bounded theme revisions by ID and migrates saved collections safely', () => {
  let saved: unknown;
  const collection = createThemeCollection({
    limit: 2,
    storage: {
      read: () => saved,
      write: (value) => {
        saved = value;
      },
    },
  });
  const a = generateTheme('#123456'),
    b = generateTheme('#456789'),
    c = generateTheme('#789ABC');
  collection.remember(a);
  collection.remember(b);
  collection.remember({ ...a, name: 'Updated' });
  expect(collection.getSnapshot().recent.map((t) => t.name)).toEqual([
    'Updated',
    b.name,
  ]);
  collection.remember(c);
  expect(collection.getSnapshot().recent.map((t) => t.id)).toEqual([
    c.id,
    a.id,
  ]);
  collection.toggleFavorite(a);
  collection.toggleFavorite(a);
  expect(collection.getSnapshot().favorites).toEqual([]);
  const restored = createThemeCollection({
    storage: { read: () => saved, write() {} },
  });
  restored.load();
  expect(restored.getSnapshot()).toEqual(collection.getSnapshot());
  const { schemaVersion, ...legacy } = a;
  const migrated = createThemeCollection({
    storage: { read: () => ({ recent: [legacy], favorites: [] }), write() {} },
  });
  migrated.load();
  expect(migrated.getSnapshot().recent[0].schemaVersion).toBe(1);
  const corrupt = createThemeCollection({
    favorites: [b],
    storage: {
      read: () => ({ recent: [{ ...a, schemaVersion: 99 }], favorites: [] }),
      write() {
        throw Error('quota');
      },
    },
  });
  corrupt.load();
  expect(corrupt.getSnapshot().favorites[0].id).toBe(b.id);
  corrupt.remember(c);
});
