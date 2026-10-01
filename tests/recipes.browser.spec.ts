import { test, expect } from '@playwright/test';
test('draft Apply/Cancel and history keep the applied preview isolated', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4317/generator.html');
  await page
    .getByLabel('Theme studio example', { exact: true })
    .selectOption('editing');
  const lab = page.locator('.editing-lab'),
    applied = lab.locator('[data-applied]'),
    hex = lab.getByLabel('HEX', { exact: true });
  const before = await applied.evaluate((el) =>
    (el as HTMLElement).style.getPropertyValue('--primary'),
  );
  await hex.fill('#123456');
  await hex.press('Tab');
  await expect(lab.locator('[data-status]')).toHaveText('Unapplied changes');
  expect(
    await applied.evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue('--primary'),
    ),
  ).toBe(before);
  await lab.locator('[data-undo]').click();
  await expect(hex).toHaveValue('#5268E0');
  await lab.locator('[data-redo]').click();
  await expect(hex).toHaveValue('#123456');
  await lab.locator('[data-apply]').click();
  await expect(lab.locator('[data-status]')).toHaveText('Up to date');
  expect(
    await applied.evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue('--primary'),
    ),
  ).not.toBe(before);
  await hex.fill('#654321');
  await hex.press('Tab');
  await lab.locator('[data-cancel]').click();
  await expect(hex).toHaveValue('#123456');
  await lab.locator('[data-lock]').check();
  await lab.locator('[data-select-role="accent"]').click();
  const accent = await hex.inputValue();
  await lab.locator('[data-select-role="primary"]').click();
  await hex.fill('#FF3355');
  await hex.press('Tab');
  await lab
    .getByRole('button', { name: 'Generate accent & secondary' })
    .click();
  await lab.locator('[data-select-role="accent"]').click();
  await expect(hex).toHaveValue(accent);
  await expect(lab.locator('[data-output]')).toContainText('@theme inline');
});
test('color form submits, resets and saves colors without theme roles', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4317/color.html');
  await page
    .getByLabel('Color picker example', { exact: true })
    .selectOption('form');
  const form = page.locator('.color-form-lab'),
    hex = form.getByLabel('HEX', { exact: true });
  await hex.fill('#12345680');
  await hex.press('Tab');
  await form.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(form.locator('[data-output]')).toContainText(
    '"brandColor": "#12345680"',
  );
  await form.locator('[data-save]').click();
  await expect(
    form.locator('[data-recent] button[aria-label="#12345680"]'),
  ).toHaveCount(1);
  await form.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(hex).toHaveValue('#5268E080');
  await form.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(hex).toHaveValue('#5268E080');
  for (const format of ['rgb', 'hsl', 'hsv', 'oklch', 'oklab', 'hex']) {
    await form
      .getByRole('combobox', { name: 'Color format', exact: true })
      .selectOption(format);
    expect(
      await form.evaluate((el) => (el as HTMLFormElement).checkValidity()),
    ).toBe(true);
  }
  await expect(form.getByText('primary', { exact: true })).toHaveCount(0);
});
test('a recipe download includes its controller and project configuration', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4317/color.html');
  await page
    .getByLabel('Color picker example', { exact: true })
    .selectOption('form');
  const explorer = page.locator('#kit-explorer');
  await explorer.getByRole('button', { name: 'Code', exact: true }).click();
  await explorer.getByRole('tab', { name: 'Svelte', exact: true }).click();
  await expect(
    explorer.getByRole('tab', { name: 'controller.ts', exact: true }),
  ).toBeVisible();
  await expect(
    explorer.getByRole('tab', { name: 'package.json', exact: true }),
  ).toBeVisible();
  const download = page.waitForEvent('download');
  await explorer
    .getByRole('button', { name: 'Download files', exact: true })
    .click();
  expect((await download).suggestedFilename()).toBe('ColorPicker-svelte.zip');
});
