import ts from 'typescript';
import { readdirSync } from 'node:fs';
import { referenceEntries } from '../examples/docs/reference-data';
import { exportAdapters } from '../examples/docs/adapter-exports';

/** Audit public UI exports, including adapter aliases, independently of copyable snippets. */
export function checkComponentCoverage() {
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(
    config.config,
    ts.sys,
    process.cwd(),
  );
  const paths = ['color-picker', 'theme-studio'].flatMap((kit) =>
    ['react', 'svelte', 'vue', 'angular'].map(
      (adapter) =>
        `packages/${kit}/${adapter}/index.${adapter === 'react' ? 'tsx' : 'ts'}`,
    ),
  );
  const program = ts.createProgram(paths, parsed.options);
  const checker = program.getTypeChecker();
  const errors: string[] = [];
  let count = 0;
  for (const kit of ['color-picker', 'theme-studio'] as const) {
    const entries = referenceEntries(kit);
    const docs = new Set(entries.flatMap((entry) => entry.exports ?? []));
    const available = new Map<string, Set<string>>();
    for (const adapter of ['react', 'svelte', 'vue', 'angular']) {
      const path = `packages/${kit}/${adapter}/index.${adapter === 'react' ? 'tsx' : 'ts'}`;
      const source = program.getSourceFile(path)!;
      const module = checker.getSymbolAtLocation(source)!;
      for (const symbol of checker.getExportsOfModule(module)) {
        if (
          !/^(Color|Theme|use(Color|Theme)|provide(Color|Theme)|watch(Color|Theme)|colorPickerPrimitives|themeStudioPrimitives)/.test(
            symbol.name,
          )
        )
          continue;
        const target =
          symbol.flags & ts.SymbolFlags.Alias
            ? checker.getAliasedSymbol(symbol)
            : symbol;
        const declarations = target.declarations ?? [];
        // Core contracts/types are documented separately, not counted as UI components.
        if (
          declarations.length &&
          declarations.every(
            (declaration) =>
              declaration.getSourceFile().fileName.includes('/core/') ||
              /\/core\//.test(declaration.getSourceFile().fileName),
          )
        )
          continue;
        if (
          declarations.length &&
          declarations.every(
            (declaration) =>
              ts.isInterfaceDeclaration(declaration) ||
              ts.isTypeAliasDeclaration(declaration),
          )
        )
          continue;
        count++;
        if (!available.has(symbol.name)) available.set(symbol.name, new Set());
        available.get(symbol.name)!.add(adapter);
        if (!docs.has(symbol.name))
          errors.push(
            `${kit}/${adapter}: ${symbol.name} has no API reference entry`,
          );
        if (adapter === 'react') {
          const entry = entries.find((entry) =>
            entry.exports?.includes(symbol.name),
          );
          const signature = checker
            .getTypeOfSymbolAtLocation(symbol, source)
            .getCallSignatures()[0];
          const parameter = signature?.getParameters()[0];
          if (entry && parameter) {
            const props = checker.getTypeOfSymbolAtLocation(parameter, source);
            for (const prop of checker.getPropertiesOfType(props)) {
              if (
                !prop.declarations?.some((declaration) =>
                  declaration.getSourceFile().fileName.includes('/packages/'),
                )
              )
                continue;
              if (
                !entry.fields.some((field) =>
                  new RegExp(`\\b${prop.name}\\b`).test(field.key),
                )
              )
                errors.push(
                  `${kit}/${symbol.name}.${prop.name}: custom React property is undocumented`,
                );
            }
          }
        }
      }
    }
    for (const file of readdirSync(`packages/${kit}/astro`).filter((file) =>
      file.endsWith('.astro'),
    )) {
      count++;
      const name = file.replace('.astro', '');
      if (!available.has(name)) available.set(name, new Set());
      available.get(name)!.add('astro');
      if (!docs.has(name))
        errors.push(`${kit}/astro: ${name} has no API reference entry`);
    }
    for (const name of docs) {
      const actual = available.get(name) ?? new Set();
      const documented = new Set(
        exportAdapters(name).map((adapter) => adapter.toLowerCase()),
      );
      if (
        actual.size !== documented.size ||
        [...actual].some((adapter) => !documented.has(adapter))
      )
        errors.push(
          `${kit}/${name}: adapter availability does not match public exports`,
        );
    }
    for (const entry of entries) {
      if (
        !entry.description.trim() ||
        !entry.fields.length ||
        !entry.example.code.trim()
      )
        errors.push(
          `${kit}/${entry.name}: missing description, fields or example`,
        );
      for (const field of entry.fields) {
        if (
          ![
            field.key,
            field.type,
            field.default,
            field.description,
            field.example,
          ].every((value) => value.trim())
        )
          errors.push(
            `${kit}/${entry.name}.${field.key}: incomplete property documentation`,
          );
      }
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(
    `Matched ${count} public UI/context exports across React, Svelte, Vue, Angular and Astro to API entries with descriptions, fields and examples.`,
  );
}
