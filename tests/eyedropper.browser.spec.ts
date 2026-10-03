import { test, expect, type Page } from '@playwright/test';
const base = process.env.SALYRA_DEMO_URL ?? 'http://127.0.0.1:4321';
async function mockScreen(page: Page) {
  await page.addInitScript(() => {
    const screen = window as unknown as {
      EyeDropper: unknown;
      sample: (hex: string) => void;
      cancelSample: () => void;
    };
    screen.EyeDropper = class {
      open({ signal }: { signal: AbortSignal }) {
        return new Promise<{ sRGBHex: string }>((resolve, reject) => {
          screen.sample = (hex) => resolve({ sRGBHex: hex });
          screen.cancelSample = () =>
            reject(new DOMException('Cancelled', 'AbortError'));
          signal.addEventListener('abort', screen.cancelSample, { once: true });
        });
      }
    };
  });
}
for (const path of [
  '/react.html',
  '/svelte.html',
  '/vue.html',
  '/angular.html',
  '/demos/astro/index.html',
  '/docs.html?kit=color-picker',
]) {
  test(`${path}: screen sampling preserves opacity and cancellation across adapters`, async ({
    page,
  }) => {
    await mockScreen(page);
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + path);
    const root = path.startsWith('/docs')
      ? page.locator('#composition-example')
      : page.locator('#composition-v1');
    const color = root.locator('[data-composition="color"]');
    const button = color.locator('[data-cp-part="eyedropper"]');
    const field = color
      .locator('[data-cp-part="input"], [data-cp-control="input"]')
      .last();
    await expect(button).toBeEnabled();
    await button.click();
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button).toBeDisabled();
    await page.evaluate(() => (window as any).sample('#123456'));
    await expect(field).toHaveValue('#12345680');
    await expect(button).toBeEnabled();
    await button.click();
    await page.evaluate(() => (window as any).cancelSample());
    await expect(button).toBeEnabled();
    await expect(field).toHaveValue('#12345680');
    expect(errors).toEqual([]);
  });
}
for (const path of [
  '/react.html',
  '/svelte.html',
  '/vue.html',
  '/angular.html',
  '/demos/astro/index.html',
  '/docs.html?kit=theme-studio',
]) {
  test(`${path}: the pipette updates only the active theme role`, async ({
    page,
  }) => {
    await mockScreen(page);
    await page.goto(base + path);
    const root = path.startsWith('/docs')
      ? page.locator('#composition-example')
      : page.locator('#composition-v1');
    const theme = root.locator('[data-composition="theme"]');
    const hex = theme.locator(
      '[data-cp-part="input"], [data-cp-control="input"]',
    );
    const primary = await hex.inputValue();
    await theme
      .getByRole('button', { name: 'Highlight', exact: true })
      .last()
      .click();
    await theme.locator('[data-cp-part="eyedropper"]').click();
    await page.evaluate(() => (window as any).sample('#C25D3D'));
    await expect(hex).toHaveValue('#C25D3D');
    await theme
      .getByRole('button', { name: 'Brand color', exact: true })
      .last()
      .click();
    await expect(hex).toHaveValue(primary);
  });
}
test('unsupported browsers keep custom controls visible and disabled', async ({
  page,
}) => {
  await page.addInitScript(() => {
    delete (window as any).EyeDropper;
  });
  await page.goto(base + '/docs.html?kit=color-picker');
  const button = page.locator(
    '#composition-example [data-cp-part="eyedropper"]',
  );
  await expect(button).toBeVisible();
  await expect(button).toBeDisabled();
  await expect(button).toHaveAttribute('data-cp-supported', 'false');
});
test('the contrast background popup uses our picker and restores focus on Escape', async ({
  page,
}) => {
  await page.goto(base + '/docs.html?kit=color-picker#workflows');
  const lab = page.locator('.workflow-gallery');
  await lab.getByLabel('Color picker workflow').selectOption('contrast');
  const trigger = lab.getByRole('button', {
    name: 'Choose background',
    exact: true,
  });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Background color picker' });
  await expect(dialog.locator('cp-provider')).toBeVisible();
  await expect(dialog.locator('input[type=color]')).toHaveCount(0);
  const before = await lab.locator('[data-result]').textContent();
  await dialog.getByLabel('HEX', { exact: true }).fill('#000000');
  await expect(trigger).toHaveAttribute('data-color', '#000000');
  await expect(lab.locator('[data-result]')).not.toHaveText(before!);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(dialog.getByLabel('HEX', { exact: true })).toHaveValue(
    '#000000',
  );
  await dialog.getByRole('button', { name: 'Close color picker' }).click();
});
test('custom controls color opens our picker without changing the edited color', async ({
  page,
}) => {
  await page.goto(base + '/docs.html?kit=color-picker#customization');
  // Locate the customization trigger itself, independently of explorer wrapper classes.
  const trigger = page
    .getByRole('button', { name: 'Choose controls color', exact: true })
    .first();
  const editedColor = page
    .locator('.custom-picker')
    .getByRole('textbox', { name: 'HEX', exact: true });
  const original = await editedColor.inputValue();
  await trigger.click();
  const dialog = page.getByRole('dialog', {
    name: 'Controls color color picker',
  });
  await dialog.getByLabel('HEX', { exact: true }).fill('#12AB34');
  await expect(trigger).toHaveAttribute('data-color', '#12AB34');
  await expect(editedColor).toHaveValue(original);
  await dialog.getByRole('button', { name: 'Close color picker' }).click();
  await expect(trigger).toBeFocused();
  await expect(page.locator('input[type=color]')).toHaveCount(0);
});

test('dedicated screen pipette example preserves alpha and exposes all six code tabs', async ({
  page,
}) => {
  await mockScreen(page);
  await page.goto(base + '/docs.html?kit=color-picker#examples');
  const example = page.locator('#docs-explorer');
  await example.getByLabel('Color picker example').selectOption('eyedropper');
  await expect(
    example.getByRole('option', { name: 'Custom pipette button' }),
  ).toHaveCount(0);
  await expect(example.getByRole('status')).toContainText('Ready');
  await example
    .getByRole('button', { name: 'Pick from screen', exact: true })
    .click();
  await expect(example.getByRole('status')).toContainText('Escape');
  await page.evaluate(() => (window as any).sample('#112233'));
  await expect(
    example.getByRole('textbox', { name: 'HEX', exact: true }),
  ).toHaveValue('#11223380');
  await example.getByRole('button', { name: 'Code', exact: true }).click();
  for (const framework of [
    'React',
    'Svelte',
    'Vue',
    'Angular',
    'Astro',
    'Vanilla',
  ]) {
    await example.getByRole('tab', { name: framework, exact: true }).click();
    await expect(
      example.locator('.example-code pre code').first(),
    ).toContainText(
      framework === 'Vanilla' ? 'bindColorEyeDropper' : 'ColorEyeDropper',
    );
    await expect(
      example.getByRole('button', { name: 'Copy code', exact: true }),
    ).toBeVisible();
    await expect(
      example.getByRole('button', { name: 'Download files', exact: true }),
    ).toBeVisible();
  }
});
test('custom pipette example uses application button content and samples an opaque color', async ({
  page,
}) => {
  await mockScreen(page);
  await page.goto(base + '/docs.html?kit=color-picker#customization');
  const example = page.locator('#custom-explorer');
  await example
    .getByLabel('Color picker customization')
    .selectOption('eyedropper-custom');
  await expect(
    example.getByRole('option', { name: 'Screen pipette', exact: true }),
  ).toHaveCount(0);
  const button = example.getByRole('button', {
    name: 'Sample a pixel',
    exact: true,
  });
  await expect(button.locator('svg')).toHaveCount(1);
  await expect(button).toHaveClass('pixel-button');
  await button.click();
  await page.evaluate(() => (window as any).sample('#445566'));
  await expect(
    example.getByRole('textbox', { name: 'HEX', exact: true }),
  ).toHaveValue('#445566');
  await expect(example.locator('.color-result code')).toHaveText('#445566');
  await example.getByRole('button', { name: 'Code', exact: true }).click();
  await example.getByRole('tab', { name: 'Svelte', exact: true }).click();
  await expect(example.locator('.example-code pre code').first()).toContainText(
    'preserveAlpha={false}',
  );
  await expect(example.locator('.example-code pre code').first()).toContainText(
    'pixel-button',
  );
});
test('dedicated screen pipette example explains missing browser support', async ({
  page,
}) => {
  await page.addInitScript(() => {
    delete (window as any).EyeDropper;
  });
  await page.goto(base + '/docs.html?kit=color-picker#examples');
  const example = page.locator('#docs-explorer');
  await example.getByLabel('Color picker example').selectOption('eyedropper');
  await expect(example.getByRole('status')).toContainText('unavailable');
  await expect(
    example.getByRole('button', { name: 'Pick from screen', exact: true }),
  ).toBeDisabled();
  await expect(
    example.getByRole('textbox', { name: 'HEX', exact: true }),
  ).toHaveValue('#5268E080');
});
