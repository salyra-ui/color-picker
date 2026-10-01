import type { ColorStore } from './picker';

export interface HistorySnapshot {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly length: number;
  readonly index: number;
}
export interface HistoryController {
  getSnapshot(): HistorySnapshot;
  subscribe(listener: () => void): () => void;
  begin(): void;
  end(): void;
  undo(): void;
  redo(): void;
  clear(): void;
  destroy(): void;
}
/** Opt-in history. A transaction records its final value as one undo step. */
export function createHistory<T>(
  source: {
    read(): T;
    write(value: T): void;
    subscribe(listener: () => void): () => void;
    key?(value: T): string;
  },
  options: { limit?: number } = {},
): HistoryController {
  const limit = options.limit ?? 100;
  if (!Number.isInteger(limit) || limit < 1)
    throw new TypeError('History limit must be a positive integer');
  const key = source.key ?? JSON.stringify;
  let entries = [source.read()],
    index = 0,
    depth = 0,
    restoring = false,
    disposed = false;
  const listeners = new Set<() => void>();
  const capture = (): HistorySnapshot =>
    Object.freeze({
      canUndo: index > 0,
      canRedo: index < entries.length - 1,
      length: entries.length,
      index,
    });
  let snapshot = capture();
  const emit = () => {
    snapshot = capture();
    listeners.forEach((fn) => fn());
  };
  const record = () => {
    if (disposed || restoring || depth) return;
    const next = source.read();
    if (key(next) === key(entries[index])) return;
    entries = entries.slice(0, index + 1);
    entries.push(next);
    if (entries.length > limit + 1) entries.shift();
    index = entries.length - 1;
    emit();
  };
  const unsubscribe = source.subscribe(record);
  const restore = (offset: number) => {
    if (disposed) return;
    // Finish a pending gesture before navigating through its result.
    depth = 0;
    record();
    const next = index + offset;
    if (next < 0 || next >= entries.length) return;
    restoring = true;
    try {
      source.write(entries[next]);
      index = next;
    } finally {
      restoring = false;
    }
    emit();
  };
  return {
    getSnapshot: () => snapshot,
    subscribe(fn) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    begin() {
      if (!disposed) depth++;
    },
    end() {
      if (depth) depth--;
      record();
    },
    undo: () => restore(-1),
    redo: () => restore(1),
    clear() {
      if (disposed) return;
      depth = 0;
      entries = [source.read()];
      index = 0;
      emit();
    },
    destroy() {
      disposed = true;
      unsubscribe();
      listeners.clear();
      entries = [];
    },
  };
}
export function createColorHistory(
  store: ColorStore,
  options?: { limit?: number },
): HistoryController {
  return createHistory(
    {
      read: store.getSnapshot,
      subscribe: store.subscribe,
      key: (s) => JSON.stringify([s.h, s.s, s.v, s.alpha]),
      write(s) {
        store.setHSV({ h: s.h, s: s.s, v: s.v });
        store.setAlpha(s.alpha);
      },
    },
    options,
  );
}
/** Mount on the editor root. Pointer drags, held arrow keys and text edits are transactions. */
export function mountHistory(
  root: HTMLElement,
  history: HistoryController,
): () => void {
  const doc = root.ownerDocument;
  let pointer: number | undefined,
    typing: Element | undefined,
    keyboard = false;
  const down = (e: PointerEvent) => {
    if (e.button === 0 && pointer === undefined) {
      pointer = e.pointerId;
      history.begin();
    }
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId === pointer) {
      pointer = undefined;
      history.end();
    }
  };
  const focus = (e: FocusEvent) => {
    const el = e.target as HTMLInputElement;
    if (
      el.matches(
        'input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea',
      )
    ) {
      typing = el;
      history.begin();
    }
  };
  const blur = (e: FocusEvent) => {
    if (e.target === typing) {
      typing = undefined;
      history.end();
    }
  };
  const keys = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement;
    const editable = el.matches(
      'input, textarea, select, [contenteditable=true]',
    );
    if (!editable && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      e.shiftKey ? history.redo() : history.undo();
      return;
    }
    if (
      !typing &&
      !keyboard &&
      [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'Home',
        'End',
      ].includes(e.key)
    ) {
      keyboard = true;
      history.begin();
    }
  };
  const keyup = () => {
    if (keyboard) {
      keyboard = false;
      history.end();
    }
  };
  const leave = () => {
    if (pointer !== undefined) {
      pointer = undefined;
      history.end();
    }
    keyup();
  };
  root.addEventListener('pointerdown', down, true);
  doc.addEventListener('pointerup', up);
  doc.addEventListener('pointercancel', up);
  root.addEventListener('focusin', focus);
  root.addEventListener('focusout', blur);
  root.addEventListener('keydown', keys, true);
  doc.addEventListener('keyup', keyup);
  doc.defaultView?.addEventListener('blur', leave);
  return () => {
    root.removeEventListener('pointerdown', down, true);
    doc.removeEventListener('pointerup', up);
    doc.removeEventListener('pointercancel', up);
    root.removeEventListener('focusin', focus);
    root.removeEventListener('focusout', blur);
    root.removeEventListener('keydown', keys, true);
    doc.removeEventListener('keyup', keyup);
    doc.defaultView?.removeEventListener('blur', leave);
    leave();
    if (typing) {
      typing = undefined;
      history.end();
    }
  };
}
