import {
  createThemeStore,
  createThemeEditor,
  createThemeHistory,
  createThemeCollection,
  browserThemeCollectionStorage,
  mountThemeKit,
  themeConfiguration,
  themeColor,
  themeContrast,
  generateTheme,
  parseTheme,
  roles,
  type Role,
  type TokenSelection,
} from '@salyra-ui/theme-studio/vanilla';
import { mountHistory } from '@salyra-ui/color-picker';
import {
  seed,
  actions,
  button,
  field,
  listenButton,
  output,
} from './workflow-ui';
export function mountWorkflow(host: HTMLElement, id: string): () => void {
  host.classList.add('workflow-preview');
  const cleanup: (() => void)[] = [];
  const subscribe = (
    source: { subscribe: (fn: () => void) => () => void },
    update: () => void,
  ) => {
    cleanup.push(source.subscribe(update));
  };
  if (id === 'schema') {
    const initial = generateTheme(seed);
    host.innerHTML =
      actions(
        button('legacy', 'Unversioned theme') +
          button('v0', 'Version 0') +
          button('future', 'Future version'),
      ) +
      '<label class="workflow-field">Saved theme JSON<textarea data-json rows="10" spellcheck="false"></textarea></label>' +
      actions(button('validate', 'Validate & migrate')) +
      '<pre data-result role="status"></pre>';
    const area = host.querySelector<HTMLTextAreaElement>('[data-json]')!;
    const show = (version?: number) => {
      const saved = { ...initial } as Record<string, unknown>;
      delete saved.schemaVersion;
      if (version !== undefined) saved.schemaVersion = version;
      area.value = JSON.stringify(saved, null, 2);
      output(host, 'Choose Validate & migrate to read this data.');
    };
    listenButton(host, 'legacy', () => show());
    listenButton(host, 'v0', () => show(0));
    listenButton(host, 'future', () => show(99));
    listenButton(host, 'validate', () => {
      try {
        const theme = parseTheme(JSON.parse(area.value));
        output(
          host,
          `Loaded ${theme.name}\nschemaVersion: ${theme.schemaVersion}`,
        );
      } catch (error) {
        output(
          host,
          error instanceof Error ? error.message : 'Invalid theme data',
        );
      }
    });
    show();
  } else {
    const target = createThemeStore({
      theme: generateTheme(seed),
      mode: 'light',
      modeStorage: false,
    });
    const editor =
      id === 'locks' || id === 'conflict'
        ? createThemeEditor(target)
        : undefined;
    const store = editor?.store ?? target;
    host.innerHTML =
      '<div data-picker></div><div data-controls></div><div data-theme-sample class="recipe-preview"><h3>Applied theme</h3><button type="button">Save changes</button></div><pre data-result aria-live="polite"></pre>';
    if (id === 'locks')
      host.querySelector('[data-theme-sample] h3')!.textContent =
        'Generated theme';
    const controls = host.querySelector<HTMLElement>('[data-controls]')!;
    const picker = mountThemeKit(
      host.querySelector<HTMLElement>('[data-picker]')!,
      {
        store,
        modeStorage: false,
        picker: {
          view: 'area',
          roles: ['primary', 'secondary', 'accent'],
          controls: false,
        },
        radius: ['card'],
        width: ['button'],
        backgroundControl: id === 'locks',
      },
    );
    picker.element.querySelector('details')?.remove();
    cleanup.push(picker.destroy);
    const updateSample = () => {
      host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
        target.getSnapshot().style;
    };
    subscribe(target, updateSample);
    updateSample();
    if (id === 'history') {
      const history = createThemeHistory(store, { limit: 20 });
      controls.innerHTML = actions(
        button('undo', 'Undo') + button('redo', 'Redo'),
      );
      listenButton(host, 'undo', history.undo);
      listenButton(host, 'redo', history.redo);
      const update = () => {
        const s = history.getSnapshot();
        host.querySelector<HTMLButtonElement>(
          '[data-action="undo"]',
        )!.disabled = !s.canUndo;
        host.querySelector<HTMLButtonElement>(
          '[data-action="redo"]',
        )!.disabled = !s.canRedo;
        output(
          host,
          `${store.getSnapshot().theme.name}\nHistory position ${s.index + 1} of ${s.length}`,
        );
      };
      subscribe(history, update);
      cleanup.push(mountHistory(host, history), history.destroy);
      update();
    } else if (id === 'locks') {
      controls.innerHTML =
        '<fieldset class="workflow-locks"><legend>Keep during generation</legend>' +
        [...roles, 'background']
          .map(
            (role) =>
              `<label><input type="checkbox" data-lock="${role}">${role}</label>`,
          )
          .join('') +
        '</fieldset><label class="workflow-field">New primary<input data-seed type="color" value="#c25d3d"></label>' +
        actions(button('generate', 'Generate theme'));
      for (const input of controls.querySelectorAll<HTMLInputElement>(
        '[data-lock]',
      ))
        input.onchange = () =>
          editor!.setLocked(
            input.dataset.lock as Role | 'background',
            input.checked,
          );
      listenButton(host, 'generate', () =>
        store.generate(
          host.querySelector<HTMLInputElement>('[data-seed]')!.value,
        ),
      );
      const update = () => {
        const state = store.getSnapshot();
        output(
          host,
          JSON.stringify(
            {
              locked: editor!.getSnapshot().locked,
              colors: Object.fromEntries(
                roles.map((role) => [role, themeColor(state.theme, role)]),
              ),
              background: state.theme.structure.websitePreset.background,
            },
            null,
            2,
          ),
        );
        host.querySelector<HTMLElement>('[data-theme-sample]')!.style.cssText =
          state.style;
      };
      subscribe(store, update);
      subscribe(editor!, update);
      update();
    } else if (id === 'collections') {
      const collection = createThemeCollection({
        limit: 8,
        favorites: [generateTheme('#277D59', { name: 'Forest' })],
        storage: browserThemeCollectionStorage('examples:saved-themes'),
      });
      collection.load();
      controls.innerHTML =
        actions(
          button('remember', 'Save to recent') +
            button('favorite', 'Toggle favorite'),
        ) +
        field('Recent themes', 'recent', '') +
        field('Favorite themes', 'favorites', '');
      listenButton(host, 'remember', () =>
        collection.remember(store.getSnapshot().theme),
      );
      listenButton(host, 'favorite', () =>
        collection.toggleFavorite(store.getSnapshot().theme),
      );
      const update = () => {
        const state = collection.getSnapshot();
        for (const kind of ['recent', 'favorites'] as const) {
          const select = host.querySelector<HTMLSelectElement>(
            `[data-${kind}]`,
          )!;
          select.replaceChildren(new Option('Choose a theme', ''));
          for (const theme of state[kind])
            select.add(new Option(theme.name, theme.id));
          select.disabled = !state[kind].length;
        }
        output(
          host,
          JSON.stringify(
            {
              recent: state.recent.map((t) => ({ id: t.id, name: t.name })),
              favorites: state.favorites.map((t) => ({
                id: t.id,
                name: t.name,
              })),
            },
            null,
            2,
          ),
        );
      };
      for (const kind of ['recent', 'favorites'] as const)
        host.querySelector<HTMLSelectElement>(`[data-${kind}]`)!.onchange = (
          e,
        ) => {
          const theme = collection
            .getSnapshot()
            [kind].find(
              (t) => t.id === (e.currentTarget as HTMLSelectElement).value,
            );
          if (theme) store.setTheme(theme);
        };
      subscribe(collection, update);
      update();
    } else if (id === 'contrast') {
      controls.innerHTML = '<div data-pairs class="workflow-pairs"></div>';
      const update = () => {
        const state = store.getSnapshot(),
          pairs = host.querySelector<HTMLElement>('[data-pairs]')!;
        pairs.replaceChildren();
        const values = roles.map((role) => {
          const result = themeContrast(state, role),
            item = document.createElement('article');
          item.style.background = themeColor(state.theme, role);
          item.style.color = result.foreground;
          item.textContent = `${role} ${result.ratio.toFixed(2)}:1`;
          pairs.append(item);
          return `${role}\nAA ${result.aa ? 'passes' : 'fails'} · AAA ${result.aaa ? 'passes' : 'fails'}`;
        });
        output(host, values.join('\n\n'));
      };
      subscribe(store, update);
      update();
    } else if (id === 'tailwind') {
      controls.innerHTML =
        '<fieldset class="workflow-locks"><legend>Export fields</legend>' +
        roles
          .map(
            (role) =>
              `<label><input type="checkbox" data-role="${role}" ${role === 'primary' ? 'checked' : ''}>${role}</label>`,
          )
          .join('') +
        '<label><input type="checkbox" data-radius>Card radius</label><label><input type="checkbox" data-width>Button border width</label><label><input type="checkbox" data-background>Background</label></fieldset>' +
        field(
          'Appearance',
          'appearance',
          '<option value="light">Light</option><option value="dark">Dark</option><option value="both">Light & dark</option>',
        ) +
        actions(button('copy', 'Copy Tailwind CSS')) +
        '<p data-copy-status role="status"></p>';
      const selection = (): TokenSelection => ({
        roles: [
          ...controls.querySelectorAll<HTMLInputElement>('[data-role]:checked'),
        ].map((e) => e.dataset.role as Role),
        radius: host.querySelector<HTMLInputElement>('[data-radius]')!.checked
          ? ['card']
          : [],
        width: host.querySelector<HTMLInputElement>('[data-width]')!.checked
          ? ['button']
          : [],
        background:
          host.querySelector<HTMLInputElement>('[data-background]')!.checked,
        modes:
          host.querySelector<HTMLSelectElement>('[data-appearance]')!.value ===
          'both'
            ? ['light', 'dark']
            : [
                host.querySelector<HTMLSelectElement>('[data-appearance]')!
                  .value as 'light' | 'dark',
              ],
      });
      const update = () =>
        output(
          host,
          themeConfiguration(store.getSnapshot(), selection()).tailwind,
        );
      controls.onchange = update;
      subscribe(store, update);
      update();
      listenButton(host, 'copy', () => {
        navigator.clipboard
          .writeText(
            themeConfiguration(store.getSnapshot(), selection()).tailwind,
          )
          .then(
            () => {
              host.querySelector('[data-copy-status]')!.textContent =
                'Tailwind CSS copied.';
            },
            () => {
              host.querySelector('[data-copy-status]')!.textContent =
                'Select the CSS and copy it with your keyboard.';
            },
          );
      });
    } else if (id === 'conflict') {
      controls.innerHTML =
        actions(
          button('external', 'Simulate external update') +
            button('apply', 'Apply draft') +
            button('cancel', 'Load newer theme') +
            button('force', 'Replace with draft'),
        ) + '<p data-conflict role="status"></p>';
      let externalRevision = 0;
      listenButton(host, 'external', () =>
        target.setTheme(
          generateTheme(++externalRevision % 2 ? '#C25D3D' : '#277D59', {
            name: `External theme ${externalRevision}`,
          }),
        ),
      );
      listenButton(host, 'apply', () => editor!.apply());
      listenButton(host, 'cancel', editor!.cancel);
      listenButton(host, 'force', () => editor!.apply({ force: true }));
      const update = () => {
        const state = editor!.getSnapshot();
        host.querySelector<HTMLButtonElement>(
          '[data-action="apply"]',
        )!.disabled = !state.dirty || state.conflict;
        host.querySelector<HTMLButtonElement>('[data-action="force"]')!.hidden =
          !state.conflict;
        host.querySelector<HTMLButtonElement>(
          '[data-action="cancel"]',
        )!.disabled = !state.dirty && !state.conflict;
        host.querySelector('[data-conflict]')!.textContent = state.conflict
          ? 'The applied theme changed. Load it or explicitly replace it.'
          : state.dirty
            ? 'Unapplied draft'
            : 'Up to date';
        output(
          host,
          JSON.stringify(
            {
              draft: store.getSnapshot().theme.name,
              applied: target.getSnapshot().theme.name,
              conflict: state.conflict,
            },
            null,
            2,
          ),
        );
      };
      subscribe(editor!, update);
      subscribe(store, update);
      subscribe(target, update);
      cleanup.push(mountHistory(host, editor!.history));
      update();
    }
    if (editor) cleanup.push(editor.destroy);
  }
  return () => {
    cleanup.forEach((stop) => stop());
    host.replaceChildren();
  };
}
