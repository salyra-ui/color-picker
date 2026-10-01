import { test, expect } from '@playwright/test';
const demoUrl = process.env.SALYRA_DEMO_URL ?? 'http://127.0.0.1:4317';

for (const path of [
  '/react.html',
  '/svelte.html',
  '/vue.html',
  '/angular.html',
]) {
  test(`${path}: channel fields and geometry drafts work on a narrow screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${demoUrl}${path}`);
    const panels = page.locator('.demo-grid .panel');
    const color = panels.first();
    const theme = panels.last();
    await color
      .getByRole('combobox', { name: 'Color format', exact: true })
      .selectOption('rgb');
    const fields = color.locator('.cp-channels .cp-channel-field');
    await expect(fields).toHaveCount(3);
    const dimensions = await fields.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        const input = element.querySelector('input')!;
        return {
          width: rect.width,
          height: rect.height,
          border: getComputedStyle(input).borderTopWidth,
        };
      }),
    );
    expect(
      Math.max(...dimensions.map((field) => field.width)) -
        Math.min(...dimensions.map((field) => field.width)),
    ).toBeLessThan(1);
    expect(
      dimensions.every(
        (field) =>
          field.width > 60 && field.height >= 38 && field.border === '0px',
      ),
    ).toBe(true);
    await color
      .getByRole('spinbutton', { name: 'RGB R', exact: true })
      .fill('17');
    await color
      .getByRole('spinbutton', { name: 'RGB R', exact: true })
      .press('Tab');
    await expect(
      color.getByRole('spinbutton', { name: 'RGB R', exact: true }),
    ).toHaveValue('17');
    await theme.getByText('Borders & shape', { exact: true }).click();
    const radius = theme.getByRole('spinbutton', {
      name: /^card radius$/i,
      exact: true,
    });
    await radius.fill('0.75');
    await expect(radius).toHaveValue('0.75');
    await radius.fill('');
    await expect(radius).toHaveAttribute('aria-invalid', 'true');
    await radius.press('Tab');
    await expect(radius).toHaveValue('0.75');
    await expect(radius).toHaveAttribute('aria-invalid', 'false');
    const preview = theme.locator('.preview-card');
    expect(
      await preview.evaluate(
        (element) => getComputedStyle(element).borderTopLeftRadius,
      ),
    ).toBe('12px');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
    expect(errors).toEqual([]);
  });
}

test('Vanilla geometry drafts stay intact and disabled pickers cannot be edited', async ({
  page,
}) => {
  await page.goto(`${demoUrl}/generator.html`);
  await page
    .getByLabel('Theme studio example', { exact: true })
    .selectOption('geometry');
  const preview = page.locator('#kit-explorer .preview-content');
  const radius = preview.locator(
    '[data-tk-border="radius"][data-target="card"]',
  );
  expect(
    await radius.evaluate((input) => getComputedStyle(input).borderTopWidth),
  ).toBe('0px');
  const geometryHeight = await radius
    .locator('..')
    .evaluate((field) => field.getBoundingClientRect().height);
  expect(geometryHeight).toBeGreaterThanOrEqual(36);
  expect(geometryHeight).toBeLessThanOrEqual(42);
  await radius.fill('0.875');
  await radius.fill('');
  await expect(radius).toHaveAttribute('aria-invalid', 'true');
  await radius.press('Tab');
  await expect(radius).toHaveValue('0.875');
  await page
    .getByLabel('Theme studio example', { exact: true })
    .selectOption('disabled');
  await expect(preview.locator('tk-provider')).toHaveAttribute('inert', '');
  const inputs = preview.locator('tk-provider input');
  expect(await inputs.count()).toBeGreaterThan(0);
  for (const input of await inputs.all()) await expect(input).toBeDisabled();
});
