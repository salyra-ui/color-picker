# Salyra UI changelog

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
