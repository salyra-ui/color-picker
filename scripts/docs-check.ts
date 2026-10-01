import { JSDOM, VirtualConsole } from 'jsdom';
const nativeErrors: Error[] = [];
const virtualConsole = new VirtualConsole().on('jsdomError', (error) =>
  nativeErrors.push(error),
);
import ts from 'typescript';
import { compile } from 'svelte/compiler';
import { parse, compileTemplate } from '@vue/compiler-sfc';
import { transform } from '@astrojs/compiler';
import { parseTemplate } from '@angular/compiler';
import { sourceFiles } from '../examples/docs/code-files';
const dom = new JSDOM('<!doctype html><body></body>', {
  url: 'http://localhost',
  virtualConsole,
});
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  customElements: dom.window.customElements,
  CustomEvent: dom.window.CustomEvent,
  Event: dom.window.Event,
});
const {
  integrations,
  colorVariants,
  themeVariants,
  colorExample,
  themeExample,
  loaderExample,
  modeExample,
  standaloneExample,
  renderingExample,
  paletteExample,
  defaultSwatch,
  defaultCustom,
} = await import('../examples/docs/snippets');
const nativeColor = await import('@sebytza23/color-picker-vanilla');
const nativeTheme = await import('@sebytza23/theme-kit-vanilla');
let nativeCount = 0;
let count = 0;
const typedSources = new Map<string, string>();
for (const integration of integrations) {
  const samples = [
    ...colorVariants.map((v) => colorExample(integration, v.id)),
    ...themeVariants.map((v) => themeExample(integration, v.id)),
    loaderExample(integration),
    modeExample(integration),
    standaloneExample(integration),
    renderingExample(integration, 'timeout'),
    themeExample(integration, 'geometry', defaultCustom, {
      roles: ['primary'],
      radius: nativeTheme.targets,
      width: nativeTheme.targets,
      background: true,
      modes: ['dark'],
    }),
    themeExample(integration, 'geometry', defaultCustom, {
      roles: ['primary'],
      radius: ['input', 'card'],
      width: [],
      background: true,
      modes: ['light', 'dark'],
    }),
    paletteExample(integration, {
      ...defaultSwatch,
      shape: 'circle',
      label: "Brand's <500>",
    }),
  ];
  for (const [index, sample] of samples.entries()) {
    const files = sourceFiles(sample, integration);
    for (const file of files) {
      if (file.name.endsWith('.css')) continue;
      try {
        if (integration === 'React' || integration === 'Angular') {
          typedSources.set(
            process.cwd() +
              `/examples/docs/check-${integration}-${index}.${integration === 'React' ? 'tsx' : 'ts'}`,
            file.code,
          );
          const result = ts.transpileModule(file.code, {
            fileName: file.name,
            reportDiagnostics: true,
            compilerOptions: {
              target: ts.ScriptTarget.ES2022,
              module: ts.ModuleKind.ESNext,
              jsx: ts.JsxEmit.ReactJSX,
              experimentalDecorators: true,
            },
          });
          const errors = result.diagnostics?.filter(
            (d) => d.category === ts.DiagnosticCategory.Error,
          );
          if (errors?.length)
            throw new Error(
              ts.formatDiagnosticsWithColorAndContext(errors, {
                getCurrentDirectory: () => process.cwd(),
                getCanonicalFileName: (f) => f,
                getNewLine: () => '\n',
              }),
            );
          if (integration === 'Angular') {
            const template = file.code.match(/template:\s*`([\s\S]*?)`/);
            if (template) {
              const parsed = parseTemplate(template[1], file.name);
              if (parsed.errors?.length)
                throw new Error(
                  parsed.errors.map((e) => e.toString()).join('\n'),
                );
            }
          }
        } else if (integration === 'Svelte')
          compile(file.code, { filename: file.name, generate: 'server' });
        else if (integration === 'Vue') {
          const parsed = parse(file.code, { filename: file.name });
          if (parsed.errors.length) throw new Error(String(parsed.errors));
          const result = compileTemplate({
            source: parsed.descriptor.template?.content ?? '',
            filename: file.name,
            id: 'docs-preview',
          });
          if (result.errors.length) throw new Error(String(result.errors));
        } else if (integration === 'Astro')
          await transform(file.code, { filename: file.name });
        else {
          const doc = new JSDOM(file.code);
          for (const script of doc.window.document.querySelectorAll(
            'script:not([src])',
          )) {
            new Function(script.textContent ?? '');
          }
          if (
            integration === 'Vanilla' &&
            doc.window.document.querySelector('tk-provider, cp-provider') &&
            [...doc.window.document.querySelectorAll('script:not([src])')].some(
              (script) => script.textContent?.includes('.setStore('),
            )
          ) {
            dom.window.document.body.innerHTML =
              doc.window.document.body.innerHTML;
            for (const script of dom.window.document.querySelectorAll(
              'script:not([src])',
            ))
              new Function(
                'ColorPicker',
                'ThemeKit',
                'console',
                script.textContent ?? '',
              )(nativeColor, nativeTheme, { log() {} });
            const provider = dom.window.document.querySelector(
              'tk-provider, cp-provider',
            ) as (HTMLElement & { store?: { getSnapshot(): unknown } }) | null;
            if (!provider?.store?.getSnapshot())
              throw new Error('Native example did not initialize its store');
            dom.window.document.body.replaceChildren();
            if (nativeErrors.length) throw nativeErrors.shift();
            nativeCount++;
          }
          doc.window.close();
        }
      } catch (error) {
        throw new Error(
          `${integration} example ${index + 1} (${file.name}): ${String(error)}`,
        );
      }
    }
    count++;
  }
}
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(
  config.config,
  ts.sys,
  process.cwd(),
);
const host = ts.createCompilerHost(parsed.options);
const fallbackSource = host.getSourceFile.bind(host);
const fallbackExists = host.fileExists.bind(host);
host.fileExists = (file) => typedSources.has(file) || fallbackExists(file);
host.getSourceFile = (file, language, onError, shouldCreateNewSourceFile) =>
  typedSources.has(file)
    ? ts.createSourceFile(file, typedSources.get(file)!, language, true)
    : fallbackSource(file, language, onError, shouldCreateNewSourceFile);
const program = ts.createProgram(
  [...typedSources.keys()],
  parsed.options,
  host,
);
const errors = ts
  .getPreEmitDiagnostics(program)
  .filter((d) => d.category === ts.DiagnosticCategory.Error);
if (errors.length)
  throw new Error(
    ts.formatDiagnosticsWithColorAndContext(errors, {
      getCurrentDirectory: () => process.cwd(),
      getCanonicalFileName: (f) => f,
      getNewLine: () => '\n',
    }),
  );
dom.window.close();
console.log(
  `Validated syntax for ${count} color/theme/loading examples across ${integrations.length} integrations.`,
);

console.log(
  `Executed ${nativeCount} supplied-store Vanilla examples against the native adapters.`,
);
