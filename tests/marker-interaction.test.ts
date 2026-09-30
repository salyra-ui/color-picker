// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { bindMarkerWheel, type ColorMarker } from '@sebytza23/color-picker';

describe('generic marker wheel gestures', () => {
  it('keeps a pending drag attached to its original marker and tolerates removed markers', () => {
    const surface = document.createElement('div'),
      a = document.createElement('button');
    a.dataset.markerId = 'a';
    surface.append(a);
    document.body.append(surface);
    const markers: ColorMarker[] = [
      { id: 'a', color: { h: 0, s: 50, v: 100, hex: '#ff8080' } },
      { id: 'b', color: { h: 120, s: 50, v: 100, hex: '#80ff80' } },
    ];
    let included = markers,
      active = 'a';
    const change = vi.fn();
    surface.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    surface.setPointerCapture = vi.fn();
    surface.hasPointerCapture = () => false;
    const frame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1),
      cancel = vi
        .spyOn(window, 'cancelAnimationFrame')
        .mockImplementation(() => {});
    const stop = bindMarkerWheel(surface, {
      getMarkers: () => included,
      getActiveId: () => active,
      select: (id) => {
        active = id;
      },
      setHSV: change,
    });
    const pointer = (
      target: HTMLElement,
      type: string,
      x: number,
      y: number,
    ) => {
      const e = new MouseEvent(type, {
        bubbles: true,
        clientX: x,
        clientY: y,
        button: 0,
      });
      Object.defineProperties(e, {
        pointerId: { value: 1 },
        isPrimary: { value: true },
      });
      target.dispatchEvent(e);
    };
    pointer(a, 'pointerdown', 150, 100);
    expect(change).not.toHaveBeenCalled();
    pointer(surface, 'pointermove', 200, 100);
    active = 'b';
    pointer(surface, 'pointerup', 200, 100);
    expect(change).toHaveBeenLastCalledWith('a', { h: 0, s: 100, v: 100 });
    pointer(a, 'pointerdown', 150, 100);
    included = [];
    expect(() => pointer(surface, 'pointermove', 200, 100)).not.toThrow();
    expect(() =>
      surface.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }),
      ),
    ).not.toThrow();
    pointer(surface, 'pointerup', 200, 100);
    stop();
    frame.mockRestore();
    cancel.mockRestore();
    surface.remove();
  });
  it('selects without recoloring on jitter, and drags the clicked marker when selection is asynchronous', () => {
    const surface = document.createElement('div'), b = document.createElement('button');
    b.dataset.markerId = 'b'; surface.append(b);
    const markers: ColorMarker[] = [
      { id: 'a', color: { h: 0, s: 50, v: 100, hex: '#ff8080' } },
      { id: 'b', color: { h: 120, s: 50, v: 100, hex: '#80ff80' } },
    ];
    surface.getBoundingClientRect = () => ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;
    surface.setPointerCapture = vi.fn(); surface.hasPointerCapture = () => false;
    const frame = vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1), cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    const select = vi.fn(), change = vi.fn();
    const stop = bindMarkerWheel(surface, { getMarkers: () => markers, getActiveId: () => 'a', select, setHSV: change });
    const pointer = (target: HTMLElement, type: string, x: number, y: number) => {
      const e = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 });
      Object.defineProperties(e, { pointerId: { value: 1 }, isPrimary: { value: true } }); target.dispatchEvent(e);
    };
    pointer(b, 'pointerdown', 75, 143); pointer(surface, 'pointermove', 76, 143); pointer(surface, 'pointerup', 76, 143);
    expect(select).toHaveBeenCalledWith('b'); expect(change).not.toHaveBeenCalled();
    pointer(b, 'pointerdown', 75, 143); pointer(surface, 'pointermove', 200, 100); pointer(surface, 'pointerup', 200, 100);
    expect(change).toHaveBeenCalledExactlyOnceWith('b', { h: 0, s: 100, v: 100 });
    stop(); frame.mockRestore(); cancel.mockRestore();
  });

});
