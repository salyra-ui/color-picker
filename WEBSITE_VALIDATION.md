# Website validation — 2026-09-30

- Kept the Swiss visual design and revised the content in landing, catalogs and both documentation sections.
- Exactly six framework adapters: React, Svelte, Vue, Angular, Astro, Vanilla. Every source block has independent framework/file tabs and keyboard navigation. Install commands and CSS imports are separate copyable files.
- Color previews are independent rectangle, wheel, numeric channels and custom controls with alpha/name/format output. Theme roles belong only to Theme kit.
- Theme previews demonstrate shared wheel, rectangle, primary-only export, presets, appearance persistence and custom generator composition. Sample application CSS is included in the copied examples.
- Rendering examples distinguish supplied themes from remote themes. Timeout source uses 2000 ms; HTTP examples document the expected Theme JSON response. Requests in the preview are explicitly simulated locally.
- 78 generated examples passed framework syntax/compiler checks across six adapters. React/Angular examples also passed TypeScript checks against package APIs. Ten supplied-store Vanilla examples were also executed in JSDOM; custom-element errors fail the check. Other framework examples are compiler/type checked, not all end-to-end tested.
- 88 unit/integration tests passed. The TypeScript, Svelte, Vue, Angular and Astro checks passed. Svelte, Vue and Angular request-isolation SSR checks passed.
- In-app browser verification: changing one block to Svelte leaves the installation and customization blocks on React; custom thumb text/control color updates copied code and CSS; dark-mode sample synchronization works; timeout applies fallback and retry applies the returned theme; standalone source has no loader. Theme documentation has no horizontal overflow at 390 px.
- npm publication is pending and is stated explicitly in the installation sections. Vanilla downloads are available in production builds.

- Fixed native ThemePicker initialization when a parent connects before its descendants are upgraded or inserted. A regression test covers deferred child insertion and theme/color synchronization.

- Copied Vanilla rectangle and shared-wheel HTML were served with the built standalone scripts and checked in the in-app browser with no console errors. Editing primary updated the application CSS; selecting Dark updated the provider. External scripts are placed after declarative markup in copied HTML.
