import { useCallback, useMemo, type ReactNode } from 'react';
import type { Book } from '../types/book';
import type { ShelfEntry, ShelfKey } from '../types/shelf';
import { useLocalStorageState } from '../hooks/useLocalStorageState';
import { ShelvesContext } from './ShelvesContext';
import { SHELVES_STORAGE_KEY, type ShelvesStore } from './shelvesStore';

export function ShelvesProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageState<ShelfEntry[]>(
    [],
    SHELVES_STORAGE_KEY,
  );

  const byId = useMemo(() => {
    const map = new Map<string, ShelfEntry>();
    for (const item of items) map.set(item.id, item);
    return map;
  }, [items]);

  const getShelfFor = useCallback(
    (id: string) => byId.get(id)?.shelf ?? null,
    [byId],
  );

  const add = useCallback(
    (book: Book, shelf: ShelfKey) => {
      setItems((prev) => {
        const existing = prev.find((x) => x.id === book.id);

        const entry: ShelfEntry = {
          ...book,
          shelf,
          addedAt: existing?.addedAt ?? Date.now(),
        };

        const without = prev.filter((x) => x.id !== book.id);
        return [entry, ...without];
      });
    },
    [setItems],
  );

  const move = useCallback(
    (id: string, shelf: ShelfKey) => {
      setItems((prev) => prev.map((x) => (x.id === id ? { ...x, shelf } : x)));
    },
    [setItems],
  );

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((x) => x.id !== id)),
    [setItems],
  );

  const clearAll = useCallback(() => setItems([]), [setItems]);

  const value = useMemo<ShelvesStore>(
    () => ({ items, add, move, remove, clearAll, getShelfFor }),
    [items, add, move, remove, clearAll, getShelfFor],
  );

  return (
    <ShelvesContext.Provider value={value}>{children}</ShelvesContext.Provider>
  );
}
