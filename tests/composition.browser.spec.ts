import { test, expect } from '@playwright/test';
const base = process.env.SALYRA_DEMO_URL ?? 'http://127.0.0.1:4321';
for (const path of [
  '/react.html',
  '/svelte.html',
  '/vue.html',
  '/angular.html',
  '/demos/astro/index.html',
]) {
  test(`${path}: custom native fields, marker content and active theme roles stay synchronized`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base + path);
    const section = page.locator('#composition-v1');
    await expect(section).toBeVisible();
    const color = section.locator('[data-composition="color"]');
    const red = color.getByRole('spinbutton', { name: 'RGB R', exact: true });
    await red.fill('200');
    await expect(red).toHaveValue('200');
    await red.press('Tab');
    await expect(red).toHaveValue('200');
    const value = color.locator('[data-cp-part="input"]').last();
    await expect(value).toHaveValue(/^#C868E0/i);
    await expect(color.locator('.composition-dot-text')).toHaveText('Pick');
    await color
      .getByRole('slider', { name: 'Alpha', exact: true })
      .press('Home');
    await expect(value).toHaveValue(/00$/);
    const theme = section.locator('[data-composition="theme"]');
    const input = theme.getByRole('textbox', { name: 'HEX', exact: true });
    const before = await input.inputValue();
    const marker = theme.locator('[data-marker-id="accent"]');
    await marker.click();
    await expect(theme.locator('[data-role="accent"]').last()).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await theme
      .getByRole('button', { name: 'Brand color', exact: true })
      .click();
    await expect(input).toHaveValue(before);
    await theme.getByRole('button', { name: 'Highlight', exact: true }).click();
    await expect(
      theme.getByRole('button', { name: 'Highlight', exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
    await input.fill('#123456');
    await expect(input).toHaveValue('#123456');
    await input.press('Tab');
    await expect(input).toHaveValue('#123456');
    await theme
      .getByRole('button', { name: 'Brand color', exact: true })
      .click();
    await expect(input).toHaveValue(before);
    const radius = theme.getByRole('spinbutton', { name: /card radius/i });
    await radius.fill('.875');
    await radius.fill('');
    await expect(radius).toHaveAttribute('aria-invalid', 'true');
    await radius.press('Tab');
    await expect(radius).toHaveValue('0.875');
    const exportSection = section.locator('details').last();
    await exportSection.locator('summary').click();
    const config = JSON.parse(
      (await exportSection.locator('pre').textContent()) ?? '{}',
    );
    expect(Object.keys(config.theme.structure.userPreset)).toEqual([
      'primary',
      'accent',
    ]);
    expect(config.theme.structure.websitePreset.border).toEqual({
      radius: { card: 0.875 },
      width: { button: 1 },
    });
    expect(errors).toEqual([]);
  });
}
for (const kit of ['color-picker', 'theme-studio']) {
  test(`${kit}: custom composition preview and framework code tabs are independent`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/docs.html?kit=${kit}`);
    const example = page.locator('#composition-example');
    await expect(example.locator('[data-preview]')).toBeVisible();
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    await expect(example.locator('[data-preview]')).toBeHidden();
    await example.getByRole('tab', { name: 'Svelte', exact: true }).click();
    await expect(example.locator('pre code')).toContainText(
      kit === 'color-picker' ? 'ColorPicker.Root' : 'ThemeStudio.Root',
    );
    await expect(example.locator('pre code')).toContainText('svelte');
    await example.getByRole('tab', { name: 'Vanilla', exact: true }).click();
    await expect(example.locator('pre code')).toContainText(
      kit === 'color-picker' ? 'mountColorControls' : 'mountThemeControls',
    );
    await example.getByRole('tab', { name: 'styles.css', exact: true }).click();
    await expect(example.locator('pre code')).toContainText('.composition-dot');
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
    await expect(example.locator('[data-preview]')).toBeVisible();
    if (kit === 'color-picker')
      await example
        .getByRole('spinbutton', { name: 'Red', exact: true })
        .fill('220');
    else {
      await example
        .locator('[data-tk-control="role"][data-role="accent"]')
        .click();
      await expect(
        example.locator('[data-tk-control="role"][data-role="accent"]'),
      ).toHaveAttribute('aria-pressed', 'true');
    }
    expect(errors).toEqual([]);
  });
}
for (const path of ['/svelte.html', '/vue.html'])
  test(`${path}: custom wheel and inputs fit a narrow screen`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base + path);
    await page.locator('#composition-v1').scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    const labels = page.locator(
      '#composition-v1 [data-composition="color"] .composition-fields > label',
    );
    const gaps = await labels.evaluateAll((labels) =>
      labels.map((label) => {
        const span = label.querySelector('span')!,
          input = label.querySelector('input')!;
        return (
          input.getBoundingClientRect().top -
          span.getBoundingClientRect().bottom
        );
      }),
    );
    expect(gaps.every((gap) => gap >= 7.5)).toBe(true);
  });
