import {
  mkdtemp,
  mkdir,
  writeFile,
  symlink,
  rm,
  realpath,
  readdir,
  cp,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { build, preview } from 'vite';
import { chromium, expect } from '@playwright/test';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html><body></body>');
Object.assign(globalThis, {
  window: dom.window,
  document: dom.window.document,
  HTMLElement: dom.window.HTMLElement,
  customElements: dom.window.customElements,
  CustomEvent: dom.window.CustomEvent,
  Event: dom.window.Event,
});
const { integrations } = await import('../examples/docs/snippets');
import { recipeFiles } from '../examples/docs/recipes';
import { sourceArchive } from '../examples/docs/download';
const root = await realpath(await mkdtemp(join(tmpdir(), 'salyra-recipes-')));
let checked = 0;
const browser = process.argv.includes('--browser')
  ? await chromium.launch()
  : undefined;
try {
  for (const kit of ['color-picker', 'theme-studio'] as const)
    for (const integration of integrations) {
      const folder = join(root, kit + '-' + integration.toLowerCase());
      await mkdir(folder);
      const files = recipeFiles(kit, integration);
      const zip = join(root, kit + '-' + integration.toLowerCase() + '.zip');
      await writeFile(zip, sourceArchive(files));
      execFileSync('unzip', ['-q', zip, '-d', folder]);
      const modules = join(folder, 'node_modules');
      await mkdir(modules);
      for (const name of await readdir(join(process.cwd(), 'node_modules')))
        if (name !== '@salyra-ui')
          await symlink(
            join(process.cwd(), 'node_modules', name),
            join(modules, name),
          );
      await mkdir(join(modules, '@salyra-ui'));
      for (const name of ['color-picker', 'theme-studio']) {
        try {
          await cp(
            join(process.cwd(), 'release', name),
            join(modules, '@salyra-ui', name),
            { recursive: true },
          );
        } catch {
          await cp(
            join(process.cwd(), 'node_modules', '@salyra-ui', name),
            join(modules, '@salyra-ui', name),
            { recursive: true, dereference: true },
          );
        }
      }
      if (integration === 'Angular') {
        await writeFile(
          join(folder, 'tsconfig.json'),
          JSON.stringify({
            compilerOptions: {
              target: 'ES2022',
              module: 'ESNext',
              moduleResolution: 'Bundler',
              strict: true,
              skipLibCheck: true,
              experimentalDecorators: true,
              useDefineForClassFields: false,
              outDir: 'compiled',
            },
            angularCompilerOptions: { strictTemplates: true },
            include: ['app.ts', 'controller.ts'],
          }),
        );
        execFileSync(
          process.execPath,
          [
            join(
              process.cwd(),
              'node_modules/@angular/compiler-cli/bundles/src/bin/ngc.js',
            ),
            '-p',
            join(folder, 'tsconfig.json'),
          ],
          { stdio: 'pipe', cwd: folder },
        );
        // Exercise the AOT-compiled Angular component with the same browser platform.
        await writeFile(
          join(folder, 'runtime.ts'),
          `import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { App } from './compiled/app.js';
bootstrapApplication(App,{providers:[provideExperimentalZonelessChangeDetection()]}).catch(console.error);
import './recipe.css';`,
        );
        await writeFile(
          join(folder, 'index.html'),
          '<app-root></app-root><script type="module" src="/runtime.ts"></script>',
        );
        await build({
          configFile: false,
          root: folder,
          logLevel: 'error',
          build: { outDir: join(folder, 'dist') },
        });
      } else if (integration === 'Astro') {
        execFileSync(
          process.execPath,
          [
            join(process.cwd(), 'node_modules/astro/astro.js'),
            'check',
            '--root',
            folder,
          ],
          { stdio: 'pipe', cwd: folder },
        );
        execFileSync(
          process.execPath,
          [
            join(process.cwd(), 'node_modules/astro/astro.js'),
            'build',
            '--root',
            folder,
          ],
          { stdio: 'pipe', cwd: folder },
        );
      } else {
        if (integration === 'React' || integration === 'Vanilla') {
          const config = ts.readConfigFile(
            join(folder, 'tsconfig.json'),
            ts.sys.readFile,
          ).config;
          const parsed = ts.parseJsonConfigFileContent(config, ts.sys, folder);
          const program = ts.createProgram(parsed.fileNames, {
            ...parsed.options,
            noEmit: true,
          });
          const diagnostics = ts.getPreEmitDiagnostics(program);
          if (diagnostics.length)
            throw new Error(
              ts.formatDiagnosticsWithColorAndContext(diagnostics, {
                getCanonicalFileName: (f) => f,
                getCurrentDirectory: () => folder,
                getNewLine: () => '\n',
              }),
            );
        }
        if (integration === 'Vue')
          execFileSync(
            process.execPath,
            [
              join(process.cwd(), 'node_modules/vue-tsc/bin/vue-tsc.js'),
              '-p',
              join(folder, 'tsconfig.json'),
              '--noEmit',
            ],
            { stdio: 'pipe', cwd: folder },
          );
        if (integration === 'Svelte')
          execFileSync(
            process.execPath,
            [
              join(process.cwd(), 'node_modules/svelte-check/bin/svelte-check'),
              '--workspace',
              folder,
              '--tsconfig',
              join(folder, 'tsconfig.json'),
            ],
            { stdio: 'pipe', cwd: folder },
          );
        await build({
          root: folder,
          logLevel: 'error',
          build: { outDir: join(folder, 'dist') },
        });
      }
      if (browser) {
        const server = await preview({
          configFile: false,
          root: folder,
          logLevel: 'error',
          preview: { host: '127.0.0.1', port: 0 },
          build: { outDir: join(folder, 'dist') },
        });
        const context = await browser.newContext(),
          page = await context.newPage();
        const errors: string[] = [];
        page.on('pageerror', (e) => errors.push(e.message));
        page.on('console', (message) => {
          if (message.type() === 'error') errors.push(message.text());
        });
        try {
          await page.goto(server.resolvedUrls!.local[0]);
          const hex = page.getByLabel('HEX', { exact: true });
          await expect(hex).toBeVisible();
          await hex.fill('#12345680'.slice(0, kit === 'theme-studio' ? 7 : 9));
          await hex.press('Tab');
          if (kit === 'theme-studio') {
            const applied = page.locator('.recipe-preview');
            const before = await applied.evaluate((el) =>
              getComputedStyle(el).getPropertyValue('--primary'),
            );
            await page
              .getByRole('button', { name: 'Apply', exact: true })
              .click();
            await expect
              .poll(() =>
                applied.evaluate((el) =>
                  getComputedStyle(el).getPropertyValue('--primary'),
                ),
              )
              .not.toBe(before);
            await hex.fill('#654321');
            await hex.press('Tab');
            await page
              .getByRole('button', { name: 'Cancel', exact: true })
              .click();
            await expect(hex).toHaveValue('#123456');
            await expect(
              page.getByRole('combobox', {
                name: 'Recent themes',
                exact: true,
              }),
            ).toBeEnabled();
          } else {
            await page
              .getByRole('button', { name: 'Submit', exact: true })
              .click();
            await expect(page.locator('.recipe-output')).toContainText(
              '#12345680',
            );
            await page
              .getByRole('button', { name: 'Reset', exact: true })
              .click();
            await expect(hex).toHaveValue('#5268E080');
            await page
              .getByRole('button', { name: 'Toggle favorite', exact: true })
              .click();
            await expect(
              page.getByRole('button', { name: '#5268E080', exact: true }),
            ).toBeVisible();
          }
          if (errors.length) throw new Error(errors.join('\n'));
        } catch (error) {
          console.error(kit, integration, errors);
          console.error(await page.locator('body').innerText());
          throw error;
        } finally {
          await context.close();
          await new Promise<void>((resolve) =>
            server.httpServer.close(() => resolve()),
          );
        }
        console.log(
          `Browser ${kit}/${integration}: edit, form/library and lifecycle passed`,
        );
      }
      checked++;
      console.log(`Downloaded ${kit}/${integration}: archive and build passed`);
    }
  console.log(`${checked} complete downloadable projects passed.`);
} catch (error) {
  if (error && typeof error === 'object' && 'stdout' in error)
    console.error(String(error.stdout));
  if (error && typeof error === 'object' && 'stderr' in error)
    console.error(String(error.stderr));
  console.error(`Recipe files retained at ${root}`);
  await browser?.close();
  throw error;
}
await browser?.close();
await rm(root, { recursive: true, force: true });
