import { test, expect } from '@playwright/test';
const base = (process.env.SALYRA_DEMO_URL ?? 'http://127.0.0.1:4321').replace(
  /\/$/,
  '',
);
const sitePath = new URL(base).pathname.replace(/\/$/, '') + '/';
for (const kit of ['color-picker', 'theme-studio']) {
  test(`${kit}: version selection preserves package and section`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => {
      if (
        response.status() >= 400 &&
        /\/(assets|downloads)\//.test(response.url())
      )
        errors.push(response.url());
    });
    await page.goto(`${base}/docs.html?kit=${kit}#examples`);
    await expect(page.getByLabel('Documentation version')).toHaveValue('1.0.1');
    for (const version of ['1.0.0', '0.3.0', '1.0.1']) {
      await page.getByLabel('Documentation version').selectOption(version);
      await expect(page).toHaveURL(
        `${base}/versions/${version}/docs.html?kit=${kit}#examples`,
      );
      await expect(page.getByLabel('Documentation version')).toHaveValue(
        version,
      );
      const installation = page.locator('#docs-installation');
      await installation
        .getByRole('tab', { name: 'Terminal', exact: true })
        .click();
      await expect(installation.locator('pre code')).toHaveText(
        `npm install @salyra-ui/${kit}@${version}`,
      );
      const link = page.getByRole('link', {
        name: `${kit}.min.js`,
        exact: true,
      });
      await expect(link).toHaveAttribute(
        'href',
        `${sitePath}versions/${version}/downloads/${kit}.min.js`,
      );
      const file = await page.request.get(
        new URL((await link.getAttribute('href')) as string, base).href,
      );
      expect(file.ok()).toBe(true);
      if (kit === 'color-picker' && version !== '1.0.1')
        expect(await file.text()).not.toContain('EyeDropper');
      if (kit === 'color-picker') {
        const picker = page.locator('#docs-explorer');
        await expect(
          picker.getByRole('option', { name: 'Screen pipette', exact: true }),
        ).toHaveCount(version === '1.0.1' ? 1 : 0);
        if (version === '0.3.0')
          await expect(page.locator('#api-colorpicker-root')).toHaveCount(0);
        if (version === '1.0.1')
          await expect(page.locator('#api-colorpicker-root')).toHaveCount(1);
      }
    }
    expect(errors).toEqual([]);
  });
}
test('React working examples and customization use the compound namespace', async ({
  page,
}) => {
  await page.goto(`${base}/versions/1.0.1/docs.html?kit=color-picker#examples`);
  const example = page.locator('#docs-explorer');
  for (const variant of [
    'rectangle',
    'wheel',
    'channels',
    'disabled',
    'eyedropper',
    'form',
  ]) {
    await example.getByLabel('Color picker example').selectOption(variant);
    await example.getByRole('button', { name: 'Code', exact: true }).click();
    await example.getByRole('tab', { name: 'React', exact: true }).click();
    const source = example.locator('.example-code pre code').first();
    await expect(source).toContainText('ColorPicker as Color');
    await expect(source).toContainText('Color.Root');
    await expect(source).not.toContainText('ColorProvider');
  }
  const custom = page.locator('#custom-explorer');
  await custom.getByRole('button', { name: 'Code', exact: true }).click();
  await custom.getByRole('tab', { name: 'React', exact: true }).click();
  await expect(custom.locator('.example-code pre code').first()).toContainText(
    'Color.Thumb',
  );
  await expect(custom.locator('.example-code pre code').first()).toContainText(
    'Color.FormatTrigger',
  );
});
test('archived picker still edits and exports its own color', async ({
  page,
}) => {
  await page.goto(`${base}/versions/0.3.0/docs.html?kit=color-picker#examples`);
  const example = page.locator('#docs-explorer');
  const input = example.getByRole('textbox', { name: 'HEX', exact: true });
  await input.fill('#123456');
  await input.press('Tab');
  await expect(example.locator('.color-result code')).toHaveText('#123456');
  await example.getByRole('button', { name: 'Code', exact: true }).click();
  await example.getByRole('tab', { name: 'React', exact: true }).click();
  await expect(example.locator('.example-code pre code').first()).toContainText(
    'ColorProvider',
  );
  await expect(
    example.locator('.example-code pre code').first(),
  ).not.toContainText('Color.Root');
});
test('changelog links lead to the selected package release', async ({
  page,
}) => {
  await page.goto(`${base}/versions/1.0.1/changelog.html?kit=theme-studio`);
  await expect(page.locator('#v1\\.0\\.1')).toContainText('Not released yet');
  await expect(page.locator('#v0\\.3\\.0')).toContainText('1 October 2026');
  const link = page
    .locator('#v0\\.3\\.0')
    .getByRole('link', { name: 'Read documentation' });
  await expect(link).toHaveAttribute(
    'href',
    `${sitePath}versions/0.3.0/docs.html?kit=theme-studio`,
  );
  await link.click();
  await expect(page.getByLabel('Documentation version')).toHaveValue('0.3.0');
});
test('version selector fits a narrow documentation sidebar', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/docs.html?kit=color-picker`);
  const picker = page.getByLabel('Documentation version');
  await expect(picker).toBeVisible();
  const box = await picker.boundingBox();
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
});
