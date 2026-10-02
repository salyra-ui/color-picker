// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import {
  createColorStore,
  sliderTrackVariables,
  colorPreviewStyles,
  bindMarkerWheel,
} from '@salyra-ui/color-picker';

describe('shared editor controls', () => {
  it('shows the selected hue in saturation and brightness tracks even for black', () => {
    const store = createColorStore('#000000');
    store.setHSV({ h: 120 });
    expect(sliderTrackVariables(store.getSnapshot())).toMatchObject({
      '--cp-alpha-color': '#000000',
      '--cp-saturation-end': '#000000',
      '--cp-brightness-end': '#FFFFFF',
    });
    store.setHSV({ s: 100 });
    expect(
      sliderTrackVariables(store.getSnapshot())['--cp-brightness-end'],
    ).toBe('#00FF00');
    store.setHSV({ v: 50 });
    expect(sliderTrackVariables(store.getSnapshot())).toMatchObject({
      '--cp-saturation-start': '#808080',
      '--cp-saturation-end': '#008000',
      '--cp-brightness-end': '#00FF00',
    });
  });
  it('uses readable preview text for dark, light and transparent colors', () => {
    expect(colorPreviewStyles('#000000')['color']).toBe('#FFFFFF');
    expect(colorPreviewStyles('#FFFFFF')['color']).toBe('#000000');
    expect(colorPreviewStyles('#00000000')['color']).toBe('#000000');
  });
  it('edits the focused marker when the framework defers selection', () => {
    const surface = document.createElement('div');
    const marker = document.createElement('button');
    marker.dataset.markerId = 'b';
    surface.append(marker);
    const select = vi.fn();
    const setHSV = vi.fn();
    const unbind = bindMarkerWheel(surface, {
      getMarkers: () => [
        { id: 'a', color: { h: 0, s: 50, v: 100, hex: '#FF8080' } },
        { id: 'b', color: { h: 120, s: 50, v: 100, hex: '#80FF80' } },
      ],
      getActiveId: () => 'a', // Selection is not published until the next render.
      select,
      setHSV,
    });
    marker.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(select).toHaveBeenCalledWith('b');
    expect(setHSV).toHaveBeenCalledExactlyOnceWith('b', { h: 121 });
    unbind();
  });
});
