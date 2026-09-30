import { performance } from 'node:perf_hooks';
import { colorAtPoint, hsvToHex } from '@sebytza23/color-picker';
import { generateTheme } from '@sebytza23/theme-kit';
const start = performance.now();
let result = '';
for (let i = 0; i < 100000; i++)
  result = hsvToHex(colorAtPoint(i % 360, i % 220, i % 110, 220, 110));
const pickerMs = performance.now() - start;
const themes = performance.now();
for (let i = 0; i < 1000; i++)
  generateTheme(hsvToHex({ h: i % 360, s: 70, v: 85 }));
console.log(
  JSON.stringify(
    {
      pickerSamples: 100000,
      pickerTotalMs: +pickerMs.toFixed(2),
      pickerMicrosecondsPerSample: +(pickerMs * 0.01).toFixed(3),
      generatedThemes: 1000,
      themeTotalMs: +(performance.now() - themes).toFixed(2),
      lastSample: result,
      note: 'Local microbenchmark, not a browser FPS comparison. The old 220×110 matrix allocates 24,200 RGB entries per hue change; this calculation allocates no pixel matrix.',
    },
    null,
    2,
  ),
);
