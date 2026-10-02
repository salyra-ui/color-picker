# Salyra UI / color-picker

Components in harmony with your stack.

This branch prepares version 1.0.0. The new composition API is unreleased. See the package README for context roots, native parts and framework examples.

## Install

`npm install @salyra-ui/color-picker`

Choose a framework entry: `@salyra-ui/color-picker/svelte`, `/react`, `/vue`, `/angular`, `/astro` or `/vanilla`. The package root exports framework-independent helpers. Framework peers are optional. Import `@salyra-ui/color-picker/styles.min.css` once for the default styles.

Each npm package contains built runtime files, declarations, compact framework compiler inputs and CSS under dist, with no sourcemaps. Vanilla includes standard and minified JS/CSS variants. Theme studio depends on color picker.

## Development

Use Node 22.19 or newer. Run `npm run prepare:peer` and `npm ci`, `npm test`, `npm run check`, `npm run check:docs`, `npm run test:ssr`, `npm run pack:all`, `npm run check:release` and `npm run build:site`.

This repository contains only color-picker. Before installing development dependencies, prepare:peer checks out the same branch of the other repository into an ignored directory for shared integration checks. Set SALYRA_PEER_REF to choose another matching peer branch. npm consumers only install the published packages.

[Documentation](https://salyra-ui.github.io/color-picker/docs.html?kit=color-picker) · [Examples](https://salyra-ui.github.io/color-picker/color.html)

[Package API and migration](packages/color-picker/README.md)
