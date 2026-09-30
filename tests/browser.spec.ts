import { test, expect } from '@playwright/test';
for (const path of ['/', '/svelte.html', '/vue.html']) {
  test(`${path}: standalone picker, theme generation, scopes and failure recovery`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:4317${path}`);
    const standalone = page.locator('.demo-grid .panel').first(),
      themed = page.locator('.demo-grid .panel').nth(1);
    const hex = standalone.getByLabel('HEX', { exact: true });
    await expect(hex).toHaveValue('#EF6B52');
    await hex.fill('#123456');
    await hex.blur();
    await expect(hex).toHaveValue('#123456');
    const themeHex = themed.getByLabel('HEX', { exact: true });
    await expect(themeHex).toHaveValue('#6366F1');
    const area = themed.locator('.cp-area');
    await area.click({ position: { x: 100, y: 50 } });
    await expect(themeHex).not.toHaveValue('#6366F1');
    const before = await themeHex.inputValue();
    await area.focus();
    await page.keyboard.press('ArrowRight');
    await expect(themeHex).not.toHaveValue(before);
    await expect(hex).toHaveValue('#123456');
    await themed.getByRole('button', { name: 'Dark mode' }).click();
    await expect(themed.locator('[data-mode]')).toHaveAttribute(
      'data-mode',
      'dark',
    );
    await expect(page.locator('.error')).toContainText('fallback');
    await page.getByRole('button', { name: 'Simulate success' }).click();
    await expect(page.getByRole('status').last()).toContainText('loading');
    await expect(page.locator('.error')).toHaveCount(0);
    await expect(page.locator('[data-theme-status]').last()).toHaveAttribute(
      'data-theme-status',
      'ready',
    );
    expect(errors).toEqual([]);
    await page.screenshot({
      path: `test-results/${path === '/' ? 'react' : path.slice(1, -5)}.png`,
      fullPage: true,
    });
  });
  test(`${path}: mouse drag remains bounded`, async ({ page }) => {
    await page.goto(`http://127.0.0.1:4317${path}`);
    const area = page.locator('.cp-area').first();
    const box = (await area.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width + 100, box.y + box.height + 100, {
      steps: 25,
    });
    await page.mouse.up();
    await expect(page.getByLabel('HEX', { exact: true }).first()).toHaveValue(
      '#000000',
    );
  });
}
test('Astro SSR and client controls', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://127.0.0.1:4318');
  await expect(page.getByLabel('HEX', { exact: true }).first()).toHaveValue(
    '#EF6B52',
  );
  await page.getByLabel('HEX', { exact: true }).nth(1).fill('#123456');
  await expect(page.locator('tk-provider').first()).toHaveAttribute(
    'data-theme',
    'custom-123456',
  );
  await page.getByRole('button', { name: 'Toggle light / dark' }).click();
  await expect(page.locator('tk-provider').first()).toHaveAttribute(
    'data-mode',
    'dark',
  );
  await expect(page.locator('tk-provider').last()).toHaveAttribute(
    'data-theme-status',
    'fallback',
  );
  expect(errors).toEqual([]);
});
