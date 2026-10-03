# Versioned documentation

`releases.json` is the release catalog for both packages. Set `current` to the workspace version. A release can be `preview` or `released`. Keep changes under Added, Changed and Fixed for each package. Released entries include their npm publication date and immutable Git commit IDs for both repositories.

## Pages

The current docs remain at `docs.html`. Each version also has its own `/versions/<version>/docs.html` page, examples, framework sources, browser downloads and assets. The sidebar selector changes the entire documentation build and preserves the selected package and section. The shared changelog lives at `changelog.html`.

## Freeze a release

Build the documentation from the exact release commits. The two Git checkouts supply the source trees and the development workspace supplies build dependencies.

```sh
node scripts/freeze-documentation.mjs --version 1.0.0 \
  --color-repo /path/to/color-picker \
  --theme-repo /path/to/theme-studio
```

The script checks both package versions and pins the historical installation command to that version. It keeps runtime code and API examples from the release commits. Each snapshot includes source commit IDs and SHA-256 file hashes. Published archives are immutable and excluded from formatting. Generated build files retain spaces inside bundled strings. The freezer refuses to replace an existing archive.

## Check and deploy

```sh
npm run check:docs
npm run build:site
```

The archive check verifies every frozen file. The site build includes historical snapshots and a separate current-version build. It adds the shared version selector without replacing historical API content. `PAGES_BASE` controls the repository path for GitHub Pages.

When a preview is published, change its status to released, add its date and source commits, freeze it, then advance `current` with the workspace version for the next preview.
