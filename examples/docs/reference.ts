import type { Kit } from './snippets';
import { codePanel, escape } from './gallery';
import { referenceEntries, type ApiEntry } from './reference-data';

const idFor = (entry: ApiEntry) => `api-${entry.id}`;
const qualifier = (entry: ApiEntry, key: string, required?: boolean) => {
  if (key.includes('return value')) return 'Returned';
  if (key.includes('range') || key === 'harmony values') return 'Input constraint';
  if (/\w+\(/.test(key)) return 'Method';
  if (entry.kind === 'Return value' || key === 'activeColor') return 'Read only';
  return required ? 'Required' : 'Optional';
};
const typeLinks: Record<string, string> = {
  Theme: 'Theme', ThemeStore: 'ThemeStore', ThemeSnapshot: 'ThemeSnapshot',
  ThemePickerStore: 'createThemePickerStore / ThemePickerStore',
  TokenSelection: 'TokenSelection', ThemeConfiguration: 'ThemeConfiguration',
  SelectedTheme: 'ThemeConfiguration', Palette: 'Theme',
  PaletteClasses: 'Palette styling', ThemeStorage: 'ThemeStorage / ModeStorage', ModeStorage: 'ThemeStorage / ModeStorage',
  ColorStore: 'ColorStore', ColorSnapshot: 'ColorSnapshot', ColorInfo: 'ColorInfo',
  ColorMarker: 'ColorMarker', ColorPartClasses: 'ColorPartClasses',
};
const typeMarkup = (value: string, entries: ApiEntry[]) => value.split(/(\b[A-Z][A-Za-z]+\b)/).map(part => {
  const target = entries.find(entry => entry.name === typeLinks[part]);
  return target ? `<a href="#${idFor(target)}">${escape(part)}</a>` : escape(part);
}).join('');
export function referenceTable(kit: Kit) {
  const entries = referenceEntries(kit);
  return `<div class="api-reference" data-api-reference>
    <div class="api-reference-intro"><p>Look up a component, property or method. Each entry shows its accepted values, default behavior and an example.</p><label class="api-search">Find an API entry<input type="search" placeholder="Try disabled, roles or setColor" data-api-search autocomplete="off" aria-controls="api-entries"></label></div>
    <p class="api-conventions">Component properties and usage examples use React names. Svelte uses <code>class</code> and snippets, Vue uses <code>class</code> and slots, and Angular uses inputs and templates. See Working examples for complete implementations in all six adapters. Core methods use the same TypeScript API in every adapter.</p>
    <p class="api-search-status" data-api-status role="status" hidden></p>
    <div id="api-entries">${entries.map(entry => `<article class="api-entry" id="${idFor(entry)}" data-api-entry="${entry.id}">
      <header class="api-entry-heading"><div><p class="api-kind">${escape(entry.kind)}</p><h3>${escape(entry.name)}</h3></div><a href="#${idFor(entry)}" aria-label="Link to ${escape(entry.name)}">#</a></header>
      <p class="api-purpose">${escape(entry.description)}</p>${entry.note ? `<p class="api-note">${escape(entry.note)}</p>` : ''}
      <table class="api-properties"><caption>${escape(entry.name)} ${entry.kind === 'Methods' ? 'methods' : entry.kind === 'Return value' ? 'returned fields' : 'properties and parameters'}</caption><thead><tr><th scope="col">Key</th><th scope="col">Type / accepted values</th><th scope="col">Default</th><th scope="col">Behavior & example</th></tr></thead><tbody>${entry.fields.map(field => `<tr data-api-property><th scope="row" data-label="Key"><code>${escape(field.key)}</code><span class="api-requirement">${qualifier(entry, field.key, field.required)}</span></th><td data-label="Type / accepted values"><code class="api-type">${typeMarkup(field.type, entries)}</code></td><td data-label="Default"><code>${escape(field.default)}</code></td><td data-label="Behavior & example"><p>${escape(field.description)}</p><code class="api-inline-example">${escape(field.example)}</code></td></tr>`).join('')}</tbody></table>
      <details class="api-usage"><summary>Usage example <span>${entry.example.file.endsWith('tsx') ? 'React' : 'TypeScript'}</span></summary><div data-api-code="${entry.id}"></div></details>
    </article>`).join('')}</div></div>`;
}

export function mountReference(host: HTMLElement, kit: Kit) {
  const entries = referenceEntries(kit);
  for (const entry of entries) {
    codePanel(host.querySelector<HTMLElement>(`[data-api-code="${entry.id}"]`)!, () => entry.example.code, { file: entry.example.file, label: `${entry.name} usage` });
  }
  const search = host.querySelector<HTMLInputElement>('[data-api-search]')!;
  const status = host.querySelector<HTMLElement>('[data-api-status]')!;
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const entry of entries) {
      const section = host.querySelector<HTMLElement>(`[data-api-entry="${entry.id}"]`)!;
      const nameMatches = `${entry.name} ${entry.description}`.toLowerCase().includes(query);
      let matches = 0;
      section.querySelectorAll<HTMLElement>('[data-api-property]').forEach(row => {
        row.hidden = !!query && !nameMatches && !row.textContent!.toLowerCase().includes(query);
        if (!row.hidden) matches++;
      });
      section.hidden = matches === 0;
      if (!section.hidden) visible++;
    }
    status.hidden = !query;
    status.textContent = visible ? `${visible} matching ${visible === 1 ? 'entry' : 'entries'}` : 'No matching entries. Try a component name, property or accepted value.';
  };
  search.addEventListener('input', filter);
  const navigate = (event: Event) => {
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#api-"]');
    if (link && search.value) {
      search.value = '';
      filter();
    }
  };
  host.addEventListener('click', navigate);
  return () => {
    search.removeEventListener('input', filter);
    host.removeEventListener('click', navigate);
  };
}
