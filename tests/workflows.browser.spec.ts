import { test, expect, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, symlink, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { build, preview } from 'vite';
import { workflows } from '../examples/docs/workflow-data';

async function openWorkflow(
  page: Page,
  kit: 'color-picker' | 'theme-studio',
  id: string,
) {
  await page.goto(`http://127.0.0.1:4317/docs.html?kit=${kit}#workflows`);
  const lab = page.locator('.workflow-gallery');
  await lab
    .getByLabel(
      `${kit === 'color-picker' ? 'Color picker' : 'Theme studio'} workflow`,
    )
    .selectOption(id);
  return lab;
}
test('color history restores alpha and groups focused field edits', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'color-picker', 'history');
  const hex = lab.getByLabel('HEX', { exact: true });
  await hex.fill('#12345680');
  await hex.press('Tab');
  await expect(lab.locator('[data-result]')).toContainText(
    'History position 2 of 2',
  );
  await lab.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(hex).toHaveValue('#5268E080');
  await lab.getByRole('button', { name: 'Redo', exact: true }).click();
  await expect(hex).toHaveValue('#12345680');
});
test('recent colors survive reload and a favorite swatch selects its value', async ({
  page,
}) => {
  let lab = await openWorkflow(page, 'color-picker', 'collections');
  await lab.getByLabel('HEX', { exact: true }).fill('#12345680');
  await lab.getByLabel('HEX', { exact: true }).press('Tab');
  await lab.getByRole('button', { name: 'Save to recent' }).click();
  await lab.getByRole('button', { name: 'Toggle favorite' }).click();
  await page.reload();
  lab = page.locator('.workflow-gallery');
  await lab.getByLabel('Color picker workflow').selectOption('collections');
  await expect(
    lab.locator('[data-recent] button[aria-label="#12345680"]'),
  ).toHaveCount(1);
  await lab.locator('[data-favorites] button[aria-label="#12345680"]').click();
  await expect(lab.getByLabel('HEX', { exact: true })).toHaveValue('#12345680');
  await lab.getByRole('button', { name: 'Clear recent' }).click();
  await expect(lab.locator('[data-recent] button')).toHaveCount(0);
});
test('contrast includes opacity and applies a suggestion only on demand', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'color-picker', 'contrast');
  const hex = lab.getByLabel('HEX', { exact: true });
  await hex.fill('#00000080');
  await hex.press('Tab');
  await expect(lab.locator('[data-result]')).toContainText('AA fails');
  await lab.getByLabel('Text size').selectOption('large');
  await expect(lab.locator('[data-result]')).toContainText('AA passes');
  await expect(hex).toHaveValue('#00000080');
  await lab.getByRole('button', { name: 'Use suggested foreground' }).click();
  await expect(hex).toHaveValue('#000000');
  await expect(lab.locator('[data-result]')).toContainText('Contrast 21.00:1');
});
test('theme history restores name and geometry independently', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'history');
  const radius = lab.getByRole('spinbutton', { name: 'card radius rem' });
  const name = lab.getByRole('textbox', { name: /^Theme name/ });
  await radius.fill('1.25');
  await radius.press('Tab');
  await name.fill('Project theme');
  await name.press('Tab');
  await lab.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(name).toHaveValue('Royal Blue');
  await expect(radius).toHaveValue('1.25');
  await lab.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(radius).toHaveValue('0.5');
  const sample = lab.locator('[data-theme-sample]');
  const light = await sample.getAttribute('style');
  await lab.getByRole('button', { name: 'Dark mode', exact: true }).click();
  expect(await sample.getAttribute('style')).not.toBe(light);
  await lab.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(sample).toHaveAttribute('style', light!);
});
test('generation preserves primary, accent and background locks', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'locks');
  const result = lab.locator('[data-result]');
  const before = JSON.parse(await result.innerText());
  for (const field of ['primary', 'accent', 'background'])
    await lab.locator(`[data-lock="${field}"]`).check();
  await lab
    .getByRole('button', { name: 'Generate theme', exact: true })
    .click();
  const after = JSON.parse(await result.innerText());
  expect(after.colors.primary).toBe(before.colors.primary);
  expect(after.colors.accent).toBe(before.colors.accent);
  expect(after.background).toEqual(before.background);
  expect(after.colors.secondary).not.toBe(before.colors.secondary);
});
test('saved themes replace the previous revision with the same ID', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'collections');
  await lab.getByRole('button', { name: 'Save to recent' }).click();
  const name = lab.getByRole('textbox', { name: /^Theme name/ });
  await name.fill('Updated theme');
  await name.press('Tab');
  await lab.getByRole('button', { name: 'Save to recent' }).click();
  await expect(lab.locator('[data-recent] option')).toHaveCount(2);
  await expect(lab.locator('[data-recent] option').last()).toHaveText(
    'Updated theme',
  );
  await lab
    .getByLabel('Favorite themes', { exact: true })
    .selectOption({ label: 'Forest' });
  await expect(name).toHaveValue('Forest');
});
test('palette contrast follows edits to each theme role', async ({ page }) => {
  const lab = await openWorkflow(page, 'theme-studio', 'contrast');
  await expect(lab.locator('[data-pairs] article')).toHaveCount(3);
  const before = await lab
    .locator('[data-pairs] article')
    .last()
    .getAttribute('style');
  await lab.getByRole('button', { name: 'accent', exact: true }).click();
  await lab.getByLabel('HEX', { exact: true }).fill('#277D59');
  await lab.getByLabel('HEX', { exact: true }).press('Tab');
  expect(
    await lab.locator('[data-pairs] article').last().getAttribute('style'),
  ).not.toBe(before);
  await expect(lab.locator('[data-result]')).toContainText('accent');
});
test('Tailwind export includes only selected roles, dimensions and modes', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'tailwind');
  const result = lab.locator('[data-result]');
  await expect(result).toContainText('--color-primary');
  await expect(result).not.toContainText('--color-accent');
  await expect(result).not.toContainText('--radius-card');
  await lab.getByLabel('Card radius', { exact: true }).check();
  await lab.getByLabel('Button border width', { exact: true }).check();
  await lab.locator('[data-role="accent"]').check();
  await lab.getByLabel('Appearance', { exact: true }).selectOption('both');
  await expect(result).toContainText('--color-accent');
  await expect(result).toContainText('--radius-card');
  await expect(result).toContainText('@utility border-button');
  await expect(result).toContainText('.dark');
  await expect(result).not.toContainText('--color-secondary');
  await expect(result).not.toContainText('--radius-input');
});
test('external changes block Apply until the user loads or replaces them', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'conflict');
  const hex = lab.getByLabel('HEX', { exact: true });
  await hex.fill('#123456');
  await hex.press('Tab');
  await lab.getByRole('button', { name: 'Simulate external update' }).click();
  await expect(lab.locator('[data-conflict]')).toContainText(
    'The applied theme changed',
  );
  await expect(
    lab.getByRole('button', { name: 'Apply draft', exact: true }),
  ).toBeDisabled();
  await expect(hex).toHaveValue('#123456');
  await lab.getByRole('button', { name: 'Load newer theme' }).click();
  await expect(hex).toHaveValue('#C25D3D');
  await hex.fill('#654321');
  await hex.press('Tab');
  await lab.getByRole('button', { name: 'Simulate external update' }).click();
  await lab.getByRole('button', { name: 'Replace with draft' }).click();
  await expect(lab.locator('[data-conflict]')).toHaveText('Up to date');
  await expect(hex).toHaveValue('#654321');
});
test('saved theme versions migrate older input and reject future input', async ({
  page,
}) => {
  const lab = await openWorkflow(page, 'theme-studio', 'schema');
  for (const version of ['Unversioned theme', 'Version 0']) {
    await lab.getByRole('button', { name: version, exact: true }).click();
    await lab.getByRole('button', { name: 'Validate & migrate' }).click();
    await expect(lab.locator('[data-result]')).toContainText(
      'schemaVersion: 1',
    );
  }
  await lab.getByRole('button', { name: 'Future version' }).click();
  await lab.getByRole('button', { name: 'Validate & migrate' }).click();
  await expect(lab.locator('[data-result]')).toContainText(
    /unsupported.*version/i,
  );
});
for (const path of ['/', '/svelte.html', '/vue.html', '/angular.html']) {
  test(`native forms and draft editing work on ${path}`, async ({ page }) => {
    const runtimeErrors: string[] = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') runtimeErrors.push(msg.text());
    });
    await page.goto(`http://127.0.0.1:4317${path}`);
    const cards = page.locator('.native-workflow-card');
    await expect(cards).toHaveCount(2);
    const color = cards.first(),
      theme = cards.last();
    const colorHex = color.getByLabel('HEX', { exact: true });
    await colorHex.fill('#12345680');
    await colorHex.press('Tab');
    await color.getByRole('button', { name: 'Submit', exact: true }).click();
    await expect(color.locator('output')).toContainText('#12345680');
    await color.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(colorHex).toHaveValue('#5268E080');
    const themeHex = theme.getByLabel('HEX', { exact: true });
    await themeHex.fill('#123456');
    await themeHex.press('Tab');
    await expect(theme.getByRole('status')).toHaveText('Unapplied changes');
    await theme.getByRole('button', { name: 'Apply', exact: true }).click();
    await expect(theme.getByRole('status')).toHaveText('Up to date');
    await theme.getByLabel('Apply changes live').check();
    await themeHex.fill('#654321');
    await themeHex.press('Tab');
    await expect(theme.getByRole('status')).toHaveText('Up to date');
    expect(runtimeErrors).toEqual([]);
  });
}
for (const kit of ['color-picker', 'theme-studio'] as const) {
  for (const { id } of workflows[kit]) {
    test(`downloaded ${kit} ${id} builds and runs as a standalone project`, async ({
      page,
    }) => {
      const lab = await openWorkflow(page, kit, id);
      await lab.getByRole('button', { name: 'Code', exact: true }).click();
      await expect(
        lab.getByRole('tab', { name: 'package.json', exact: true }),
      ).toBeVisible();
      const download = page.waitForEvent('download');
      await lab
        .getByRole('button', { name: 'Download files', exact: true })
        .click();
      const zip = await download,
        folder = await realpath(
          await mkdtemp(join(tmpdir(), 'salyra-workflow-')),
        );
      try {
        const zipPath = join(folder, 'source.zip');
        await zip.saveAs(zipPath);
        execFileSync('unzip', ['-q', zipPath, '-d', folder]);
        const pkg = JSON.parse(
          await readFile(join(folder, 'package.json'), 'utf8'),
        );
        expect(Object.keys(pkg.dependencies)).toEqual([`@salyra-ui/${kit}`]);
        await symlink(
          resolve('node_modules'),
          join(folder, 'node_modules'),
          'dir',
        );
        await build({ root: folder, configFile: false, logLevel: 'error' });
        const server = await preview({
          root: folder,
          configFile: false,
          logLevel: 'error',
          preview: { host: '127.0.0.1', port: 0 },
        });
        try {
          const address = server.httpServer.address() as { port: number };
          const errors: string[] = [];
          page.on('pageerror', (error) => errors.push(error.message));
          await page.goto(`http://127.0.0.1:${address.port}`);
          if (id === 'schema') {
            await page
              .getByRole('button', { name: 'Validate & migrate' })
              .click();
            await expect(page.locator('[data-result]')).toContainText(
              'schemaVersion: 1',
            );
          } else {
            await expect(page.getByLabel('HEX', { exact: true })).toBeVisible();
            await expect(page.locator('[data-result]')).not.toBeEmpty();
            if (id === 'history') {
              await page.getByLabel('HEX', { exact: true }).fill('#123456');
              await page.getByLabel('HEX', { exact: true }).press('Tab');
              await page
                .getByRole('button', { name: 'Undo', exact: true })
                .click();
              await expect(page.getByLabel('HEX', { exact: true })).toHaveValue(
                kit === 'color-picker' ? '#5268E080' : '#5268E0',
              );
            }
          }
          expect(errors).toEqual([]);
        } finally {
          await new Promise<void>((resolve, reject) =>
            server.httpServer.close((error) =>
              error ? reject(error) : resolve(),
            ),
          );
        }
      } finally {
        await rm(folder, { recursive: true, force: true });
      }
    });
  }
}
