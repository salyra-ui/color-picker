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
test('color-picker: wheel marker clicks and dragging keep the docs preview open', async ({
  page,
}) => {
  await page.goto(`${base}/docs.html?kit=color-picker`);
  const example = page.locator('#composition-example');
  const preview = example.locator('[data-preview]');
  const code = example.locator('[data-code]');
  const wheel = preview.locator('[data-cp-control="wheel"]');
  await wheel.scrollIntoViewIfNeeded();
  const thumb = await wheel.locator('[data-cp-part="thumb"]').boundingBox();
  if (!thumb) throw new Error('Color wheel marker is missing');
  await page.mouse.click(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2);
  await expect(preview).toBeVisible();
  await expect(code).toBeHidden();
  const value = preview.getByRole('textbox', {
    name: 'Color value',
    exact: true,
  });
  const before = await value.inputValue();
  const bounds = await wheel.boundingBox();
  if (!bounds) throw new Error('Color wheel is missing');
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    bounds.x + bounds.width * 0.75,
    bounds.y + bounds.height * 0.4,
    { steps: 5 },
  );
  await page.mouse.up();
  await expect(value).not.toHaveValue(before);
  await expect(preview).toBeVisible();
  await expect(code).toBeHidden();
  await expect(
    example.getByRole('tab', { name: 'Preview', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await example.getByRole('tab', { name: 'Code', exact: true }).click();
  await expect(code).toBeVisible();
  await expect(preview).toBeHidden();
});
for (const [path, kit] of [
  ['/site.html', 'color-picker'],
  ['/color.html', 'color-picker'],
  ['/generator.html', 'theme-studio'],
]) {
  test(`${path}: released composition examples expose working controls and framework source`, async ({
    page,
  }) => {
    await page.goto(base + path);
    const example = page.locator('#composition-example');
    await expect(example.locator('[data-preview]')).toBeVisible();
    await example
      .locator('[data-cp-part="surface"]')
      .first()
      .click({ position: { x: 80, y: 80 } });
    await expect(example.locator('[data-preview]')).toBeVisible();
    await expect(example.locator('[data-code]')).toBeHidden();
    await example.getByRole('tab', { name: 'Code', exact: true }).click();
    await example.getByRole('tab', { name: 'Svelte', exact: true }).click();
    await expect(example.locator('pre code')).toContainText(
      kit === 'color-picker' ? 'ColorPicker.Root' : 'ThemeStudio.Root',
    );
    await example.getByRole('tab', { name: 'Preview', exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    await example.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
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

for (const [kit, alias, anchor] of [
  ['color-picker', 'ColorRange', 'colorpicker-slider'],
  ['theme-studio', 'ThemePickerWheel', 'themestudio-wheel'],
]) {
  test(`${kit}: named exports are searchable and API deep links reach their entry`, async ({
    page,
  }) => {
    await page.goto(`${base}/docs.html?kit=${kit}#api-${anchor}`);
    const entry = page.locator(`#api-${anchor}`);
    await expect(entry).toBeInViewport();
    await page.locator('[data-api-search]').fill(alias);
    await expect(page.locator('[data-api-entry]:visible')).toHaveCount(1);
    await expect(entry).toContainText(alias);
    await expect(entry).toContainText('Type / accepted values');
    await expect(entry).toContainText('Default');
    await expect(entry).toContainText('Behavior & example');
    await entry.locator('summary').click();
    await expect(entry.locator('pre code')).toContainText(
      kit === 'color-picker' ? 'ColorPicker.Slider' : 'ThemeStudio.Wheel',
    );
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  });
}

test('nested draft recipe has all six adapters without changing other example tabs', async ({
  page,
}) => {
  await page.goto(`${base}/docs.html?kit=theme-studio#draft-scope-code`);
  const recipe = page.locator('#draft-scope-code');
  await expect(recipe).toBeInViewport();
  for (const integration of [
    'React',
    'Svelte',
    'Vue',
    'Angular',
    'Astro',
    'Vanilla',
  ]) {
    await recipe.getByRole('tab', { name: integration, exact: true }).click();
    await expect(recipe.locator('pre code')).toContainText('createThemeEditor');
    await expect(recipe.locator('pre code')).toContainText('editor.apply()');
    await expect(recipe.locator('pre code')).toContainText('editor.cancel()');
    await expect(recipe.locator('pre code')).toContainText(
      /(?:editor|next)\.destroy\(\)/,
    );
  }
  await page
    .locator('#composition-example')
    .getByRole('tab', { name: 'Code', exact: true })
    .click();
  await expect(
    page
      .locator('#composition-example')
      .getByRole('tab', { name: 'React', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
  await expect(
    recipe.getByRole('tab', { name: 'Vanilla', exact: true }),
  ).toHaveAttribute('aria-selected', 'true');
});
