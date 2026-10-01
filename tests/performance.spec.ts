import { test, expect } from '@playwright/test';
for (const [framework, path] of [
  ['React', '/'],
  ['Svelte', '/svelte.html'],
  ['Vue', '/vue.html'],
] as const)
  test(`${framework}: dragging batches DOM work by animation frame`, async ({
    page,
  }) => {
    await page.goto('http://127.0.0.1:4317' + path);
    const surface = page.locator('.cp-area').first(),
      box = (await surface.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    const measurements = await surface.evaluate(async (el) => {
      const frameTimes: number[] = [],
        durations: number[] = [];
      let mutations = 0,
        last = performance.now();
      const observer = new MutationObserver(() => mutations++);
      observer.observe(el.parentElement!, {
        attributes: true,
        subtree: true,
        childList: true,
      });
      const rect = el.getBoundingClientRect();
      // Each real animation frame receives 100 queued drag samples. Only its final sample should be published.
      for (let frame = 0; frame < 30; frame++) {
        const started = performance.now();
        for (let sample = 0; sample < 100; sample++)
          el.dispatchEvent(
            new PointerEvent('pointermove', {
              pointerId: 1,
              isPrimary: true,
              bubbles: true,
              clientX:
                rect.left + (rect.width * (((frame + sample) % 90) + 5)) / 100,
              clientY: rect.top + rect.height * 0.5,
            }),
          );
        durations.push(performance.now() - started);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => {
            const now = performance.now();
            frameTimes.push(now - last);
            last = now;
            resolve();
          }),
        );
      }
      observer.disconnect();
      return { samples: 3000, frames: 30, mutations, frameTimes, durations };
    });
    await page.mouse.up();
    expect(measurements.mutations).toBeGreaterThan(0);
    expect(measurements.mutations).toBeLessThan(100); // DOM work must follow frames, not 3,000 input samples.
    const p95 = [...measurements.durations].sort((a, b) => a - b)[
      Math.floor(measurements.durations.length * 0.95)
    ];
    expect(p95).toBeLessThan(100); // A conservative CI bound for input handling, not a promised FPS figure.
    await test
      .info()
      .attach('browser-performance.json', {
        body: Buffer.from(
          JSON.stringify(
            { framework, ...measurements, p95InputBatchMs: p95 },
            null,
            2,
          ),
        ),
        contentType: 'application/json',
      });
    await expect(page.getByLabel('HEX', { exact: true }).first()).toHaveValue(
      /^#[0-9A-F]{6,8}$/,
    );
  });
test('repeated editor mounting releases histories, form fields and collection subscriptions', async ({
  page,
}) => {
  await page.goto('http://127.0.0.1:4317/color.html');
  const examples = page.getByLabel('Color picker example', { exact: true });
  for (let i = 0; i < 5; i++) {
    await examples.selectOption('form');
    await examples.selectOption('rectangle');
  }
  const heap = () =>
    page.evaluate(() => {
      (window as Window & { gc?: () => void }).gc?.();
      return (
        (performance as Performance & { memory?: { usedJSHeapSize: number } })
          .memory?.usedJSHeapSize ?? null
      );
    });
  const before = await heap();
  for (let i = 0; i < 20; i++) {
    await examples.selectOption('form');
    await examples.selectOption('rectangle');
  }
  const after = await heap();
  if (before !== null && after !== null)
    expect(after - before).toBeLessThan(8 * 1024 * 1024);
  await examples.selectOption('form');
  await expect(page.locator('input[name="brandColor"]')).toHaveCount(1);
  await page
    .locator('.color-form-lab')
    .getByRole('button', { name: 'Submit', exact: true })
    .click();
  await expect(page.locator('.color-form-lab [data-output]')).toContainText(
    'brandColor',
  );
  await test
    .info()
    .attach('retained-memory.json', {
      body: Buffer.from(
        JSON.stringify(
          {
            mounts: 25,
            before,
            after,
            delta: before !== null && after !== null ? after - before : null,
          },
          null,
          2,
        ),
      ),
      contentType: 'application/json',
    });
});
