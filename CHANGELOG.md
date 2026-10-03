# Salyra UI changelog

## 1.0.1 (2026-10-03)

- Add versioned documentation for 0.3.0, 1.0.0 and the 1.0.1 preview, with a shared release selector and per-package changelog.
- Use the compound ColorPicker API in React working examples, customization, form recipes and pipette examples.

- Add an optional screen color pipette with customizable button content in all six integrations.
- Preserve alpha by default, handle unavailable browsers and cancellation, and abort pending sampling on unmount or disabled state.
- Replace native color dialogs in documentation background, customization and seed controls with the Salyra Color Picker.

## 1.0.0 (2026-10-03)

- Compose ThemeProvider over Root lifecycle and Scope styling in all six integrations. Add native tk-root/tk-scope and Astro ThemeVariableScope with matching SSR seeds.
- Context roots no longer prescribe a layout in the composition API. Theme context and the CSS variable scope are separate parts.
- Color controls expose native attributes, element references and custom children. Layout, labels, format button content and thumb decoration belong to the application.
- The shared theme wheel uses Color Picker surface behavior. Role controls select a marker without changing its color.
- React and Angular sources are split by component. Ready-made editors compose the same public controls.
- Native DOM bindings attach to existing HTML, with lifecycle wrappers for Astro.
- Shared input controllers preserve focused drafts, normalize invalid values on blur and respect disabled state.
- Theme geometry controls register only their own radius or border width target. Configuration exports contain the roles and targets selected by the editor.
- New composition examples and API reference entries cover all six integrations.
- Landing, package pages and documentation show the v1 composition API with independent framework tabs and downloadable source.
- Theme context guidance covers ready Providers, separate Roots and Scopes, and nested draft previews with Save and Cancel.
- Documentation preview tab listeners are scoped to their toolbar, so wheel interaction cannot switch to Code.

## 0.3.1

### Editor controls

- Consistent field heights, focus rings, spacing and disabled styling in the optional stylesheets.
- Saturation and brightness gradients follow the current HSV color across all adapters.
- Color previews display alpha over a checker background and choose readable text instead of a white text shadow.
- Geometry controls group value and unit in one field. A shared controller preserves incomplete drafts and validates on edit.
- Keyboard edits target the focused wheel marker even when a framework defers selection.
- Vanilla updates preserve custom inline control styles. Framework examples no longer override component label layouts.
- Default format switch text is “Next format”. Custom callbacks, snippets, slots and templates remain supported.

## 0.3.0

### Color picker

- Optional undo and redo with bounded history and one step per drag or text edit.
- Native form submission, validation, disabled fields and reset through bindColorForm.
- Contrast inspection that composites transparent colors over their background.
- Recent and favorite colors with optional persistence and ColorCollection components for all six integrations.
- Channel input precision now matches the native input step, so generated values remain valid inside forms.

### Theme studio

- Separate draft and applied stores with Apply, Cancel and optional live editing.
- Conflict detection when the applied theme changes during editing.
- Theme history and generation locks for individual color roles and backgrounds.
- Tailwind 4 export for selected colors, radius and border width.
- Recent and favorite theme collections for the preset selector.
- Schema version 1 for complete themes and selected configuration exports, with migration of unversioned data.
- Editor stores retain their disabled persistence option when mounted by a provider.

### Examples and checks

- Complete downloadable projects for React, Svelte, Vue, Angular, Astro and Vanilla.
- Draft editing and form examples with previews, framework tabs and source downloads.
- Compiler and browser checks for every downloaded project.
- Browser drag and retained-memory checks, plus fixed bundle budgets in CI.
- npm archives continue to contain dist files, README and applicable notices without sourcemaps.
