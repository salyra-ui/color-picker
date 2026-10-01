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
/** Each queued drag sample retains its marker ID, even if selection changes before the frame. */
export function bindMarkerWheel(
  element: HTMLElement,
  options: MarkerWheelOptions,
): () => void {
  const win = element.ownerDocument.defaultView!;
  const disabled = () => !!element.closest('[inert], [aria-disabled="true"]');
  let pointer: number | undefined,
    draggedId: string | undefined,
    frame: number | undefined,
    pending: { markerId: string; hsv: HSV } | undefined,
    moved = false,
    marker = false,
    startX = 0,
    startY = 0;
  const flush = () => {
    if (frame !== undefined) win.cancelAnimationFrame(frame);
    frame = undefined;
    if (disabled()) pending = undefined;
    if (pending) {
      const next = pending;
      pending = undefined;
      if (options.getMarkers().some((marker) => marker.id === next.markerId))
        options.setHSV(next.markerId, next.hsv);
    }
  };
  const read = (event: PointerEvent) => {
    if (disabled()) return;
    const current = options.getMarkers().find((item) => item.id === draggedId);
    if (!draggedId || !current) return;
    const r = element.getBoundingClientRect();
    pending = {
      markerId: draggedId,
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
    if (
      disabled() ||
      pointer !== undefined ||
      event.button !== 0 ||
      !event.isPrimary
    )
      return;
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-marker-id]',
    );
    if (button) {
      options.select(button.dataset.markerId!);
      button.focus();
    } else element.focus();
    event.preventDefault();
    // Framework callbacks may schedule selection rather than publish synchronously.
    draggedId = button?.dataset.markerId ?? options.getActiveId();
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
      if (
        marker &&
        !moved &&
        Math.hypot(event.clientX - startX, event.clientY - startY) < 4
      )
        return;
      moved = true;
      read(event);
    }
  };
  const end = (event: PointerEvent) => {
    if (event.pointerId !== pointer) return;
    if (!marker || moved) read(event);
    flush();
    pointer = undefined;
    draggedId = undefined;
  };
  const cancel = () => {
    flush();
    pointer = undefined;
    draggedId = undefined;
  };
  const click = (event: MouseEvent) => {
    if (disabled()) return;
    const button = (event.target as HTMLElement).closest<HTMLElement>(
      '[data-marker-id]',
    );
    if (button) options.select(button.dataset.markerId!);
  };
  const key = (event: KeyboardEvent) => {
    if (disabled()) return;
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
    const targetId = button?.dataset.markerId ?? options.getActiveId();
    const current = options.getMarkers().find((item) => item.id === targetId);
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
      options.setHSV(targetId, patch[event.key]);
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
