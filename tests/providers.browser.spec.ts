import { test, expect } from '@playwright/test';
const base = process.env.SALYRA_DEMO_URL ?? 'http://127.0.0.1:4321';
for (const path of [
  '/react.html',
  '/svelte.html',
  '/vue.html',
  '/angular.html',
  '/demos/astro/index.html',
]) {
  test(`${path}: ready provider shares edits, loading content and fallback through Root/Scope`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + path);
    const editor = page.locator('.demo-grid .panel').last();
    const scope = editor.locator('[data-tk-part="scope"]');
    await expect(scope).toHaveCount(1);
    expect(await scope.getAttribute('inert')).toBeNull();
    const color = editor
      .getByRole('textbox', { name: 'HEX', exact: true })
      .first();
    await color.fill('#123456');
    await color.press('Tab');
    await expect(scope).toHaveAttribute('data-theme', 'custom-123456');
    const id = await scope.getAttribute('data-theme');
    await page
      .getByRole('button', { name: 'Simulate success', exact: true })
      .click();
    const loading = page.locator(
      '[data-tk-part="scope"][data-theme-status="loading"]',
    );
    await expect(loading).toBeVisible();
    await expect(loading.locator('.loading')).toBeVisible();
    await expect(loading).toHaveAttribute('data-theme', id!);
    await expect(loading).toHaveCount(0);
    await page
      .getByRole('button', { name: 'Simulate failure', exact: true })
      .click();
    await expect(
      page.locator('[data-tk-part="scope"][data-theme-status="loading"]'),
    ).toBeVisible();
    const fallback = page.locator(
      '[data-tk-part="scope"][data-theme-status="fallback"]',
    );
    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute('data-theme', id!);
    const variables = await fallback.evaluate((el) =>
      (el as HTMLElement).style.getPropertyValue('--primary'),
    );
    expect(variables).toBe(
      await scope.evaluate((el) =>
        (el as HTMLElement).style.getPropertyValue('--primary'),
      ),
    );
    await expect(color).toHaveValue('#123456');
    expect(errors).toEqual([]);
  });
}
