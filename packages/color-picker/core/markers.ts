import { wheelAtPoint, wheelStyle } from './picker';
import type { HSV } from './color';
export interface ColorMarker {
  readonly id: string;
  readonly color: Readonly<HSV & { hex: string }>;
  readonly label?: string;
  readonly ariaLabel?: string;
}
export interface MarkerWheelOptions {
  getMarkers(): readonly ColorMarker[];
  getActiveId(): string;
  select(id: string): void;
  setHSV(id: string, hsv: Partial<HSV>): void;
}
export const markerWheelStyle = () => wheelStyle({ h: 0, s: 100, v: 100 });
export function markerStyle(marker: ColorMarker, active: boolean): string {
  const a = (marker.color.h * Math.PI) / 180;
  return `position:absolute;transform:translate(-50%,-50%);left:${50 + (Math.cos(a) * marker.color.s) / 2}%;top:${50 + (Math.sin(a) * marker.color.s) / 2}%;background:${marker.color.hex};z-index:${active ? 2 : 1}`;
}
/** Each queued drag sample retains its role, even if selection changes before the frame. */
export function bindMarkerWheel(
  element: HTMLElement,
  options: MarkerWheelOptions,
): () => void {
  const win = element.ownerDocument.defaultView!;
  let pointer: number | undefined,
    role: string | undefined,
    frame: number | undefined,
    pending: { role: string; hsv: HSV } | undefined,
    moved = false,
    marker = false,
    startX = 0,
    startY = 0;
  const flush = () => {
    if (frame !== undefined) win.cancelAnimationFrame(frame);
    frame = undefined;
    if (pending) {
      const next = pending;
      pending = undefined;
      if (options.getMarkers().some((marker) => marker.id === next.role))
        options.setHSV(next.role, next.hsv);
    }
  };
  const read = (event: PointerEvent) => {
    const current = options.getMarkers().find((item) => item.id === role);
    if (!role || !current) return;
    const r = element.getBoundingClientRect();
    pending = {
      role,
      hsv: wheelAtPoint(
        current.color,
        event.clientX - r.left,
        event.clientY - r.top,
        r.width,
        r.height,
      ),
    };
    if (frame === undefined) frame = win.requestAnimationFrame(flush);
  };
  const down = (event: PointerEvent) => {
    if (pointer !== undefined || event.button !== 0 || !event.isPrimary) return;
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-marker-id]',
    );
    if (button) {
      options.select(button.dataset.markerId!);
      button.focus();
    } else element.focus();
    event.preventDefault();
    // Framework callbacks may schedule selection rather than publish synchronously.
    role = button?.dataset.markerId ?? options.getActiveId();
    startX = event.clientX;
    startY = event.clientY;
    pointer = event.pointerId;
    moved = false;
    marker = !!button;
    element.setPointerCapture(pointer);
    if (!marker) read(event);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerId === pointer) {
      // A click (including normal hand jitter) selects without moving either color.
      if (marker && !moved && Math.hypot(event.clientX - startX, event.clientY - startY) < 4) return;
      moved = true;
      read(event);
    }
  };
  const end = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    if (!marker || moved) read(event);
    flush();
    pointer = undefined;
    role = undefined;
  };
  const cancel = () => {
    flush();
    pointer = undefined;
    role = undefined;
  };
  const click = (event: MouseEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-marker-id]',
    );
    if (button) options.select(button.dataset.markerId!);
  };
  const key = (event: KeyboardEvent) => {
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-marker-id]',
    );
    if (
      button &&
      [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Home',
        'End',
      ].includes(event.key)
    )
      options.select(button.dataset.markerId!);
    const role = options.getActiveId();
    const current = options.getMarkers().find((item) => item.id === role);
    if (!current) return;
    const c = current.color,
      step = event.shiftKey ? 10 : 1;
    const patch: Record<string, Partial<HSV>> = {
      ArrowLeft: { h: c.h - step },
      ArrowRight: { h: c.h + step },
      ArrowUp: { s: c.s + step },
      ArrowDown: { s: c.s - step },
      Home: { s: 0 },
      End: { s: 100 },
    };
    if (patch[event.key]) {
      event.preventDefault();
      options.setHSV(role, patch[event.key]);
    }
  };
  element.addEventListener('pointerdown', down);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', end);
  element.addEventListener('pointercancel', cancel);
  element.addEventListener('lostpointercapture', cancel);
  element.addEventListener('click', click);
  element.addEventListener('keydown', key);
  return () => {
    if (frame !== undefined) win.cancelAnimationFrame(frame);
    pending = undefined;
    if (pointer !== undefined && element.hasPointerCapture(pointer))
      element.releasePointerCapture(pointer);
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', end);
    element.removeEventListener('pointercancel', cancel);
    element.removeEventListener('lostpointercapture', cancel);
    element.removeEventListener('click', click);
    element.removeEventListener('keydown', key);
  };
}
