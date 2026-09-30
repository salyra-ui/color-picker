# Website validation — 2026-09-30

- Redesigned landing, separate component catalogs and package-specific documentation using the Swiss visual system: white/neutral surfaces, Helvetica, hairline structure and a red site accent. Component colors are interactive data.
- Color demos are standalone rectangle, wheel, channel inputs and custom controls, with swatch/name/format output. No theme role preview is mounted on the color page.
- Theme demos cover shared wheel, rectangle, primary-only, presets/modes and a composed custom generator. Loading/fallback scenarios run through the real store with simulated requests.
- 88 generated examples were parsed using their framework compilers; React/Angular TypeScript examples were also checked against actual package types. HTML scripts were syntax-checked; PHP was not executed as a backend.
- In-app browser checks passed for custom text/control-color changes, copied generated code, dark-mode preview synchronization, error fallback and successful retry. The homepage and theme documentation had no horizontal overflow at 390px.
- The production site build passed. The site no longer links to the original development/demo pages. npm publication remains pending.
