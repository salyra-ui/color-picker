import { normalizeColorHex } from './color';

export interface ColorCollectionSnapshot {
  readonly recent: readonly string[];
  readonly favorites: readonly string[];
}
export interface ColorCollectionStorage {
  read(): unknown;
  write(value: ColorCollectionSnapshot): void;
}
export interface ColorCollectionClasses {
  root?: string;
  item?: string;
  label?: string;
}
export type ColorCollectionStore = ReturnType<typeof createColorCollection>;
export function browserColorStorage(
  key = '@salyra-ui/color-picker:colors',
): ColorCollectionStorage {
  return {
    read: () => JSON.parse(localStorage.getItem(key) ?? 'null'),
    write: (value) => localStorage.setItem(key, JSON.stringify(value)),
  };
}
/** No browser access until load(). Color collections remain independent of theme roles. */
export function createColorCollection(
  options: {
    limit?: number;
    storage?: ColorCollectionStorage;
    favorites?: readonly string[];
  } = {},
) {
  const limit = options.limit ?? 12;
  if (!Number.isInteger(limit) || limit < 1 || limit > 1000)
    throw new TypeError('Color collection limit must be between 1 and 1000');
  const normalize = (value: unknown): readonly string[] => {
    if (!Array.isArray(value) || value.some((v) => typeof v !== 'string'))
      throw new TypeError('Expected a list of colors');
    return Object.freeze(
      [...new Set(value.map(normalizeColorHex))].slice(0, limit),
    );
  };
  let state: ColorCollectionSnapshot = Object.freeze({
    recent: Object.freeze([]),
    favorites: normalize(options.favorites ?? []),
  });
  const listeners = new Set<() => void>();
  const publish = (next: ColorCollectionSnapshot, persist = true) => {
    if (JSON.stringify(state) === JSON.stringify(next)) return;
    state = Object.freeze(next);
    listeners.forEach((fn) => fn());
    if (persist)
      try {
        options.storage?.write(state);
      } catch {
        /* Storage is optional. */
      }
  };
  return {
    getSnapshot: () => state,
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    load() {
      try {
        const data = options.storage?.read() as ColorCollectionSnapshot | null;
        if (data)
          publish(
            {
              recent: normalize(data.recent),
              favorites: normalize(data.favorites),
            },
            false,
          );
      } catch {
        /* Ignore corrupt cache. */
      }
    },
    remember(color: string) {
      const value = normalizeColorHex(color);
      publish({
        ...state,
        recent: normalize([value, ...state.recent.filter((c) => c !== value)]),
      });
    },
    toggleFavorite(color: string) {
      const value = normalizeColorHex(color);
      publish({
        ...state,
        favorites: normalize(
          state.favorites.includes(value)
            ? state.favorites.filter((c) => c !== value)
            : [value, ...state.favorites],
        ),
      });
    },
    clearRecent() {
      publish({ ...state, recent: Object.freeze([]) });
    },
  };
}
