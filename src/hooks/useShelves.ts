import type { Book } from '../types/book';
import type { ShelfEntry, ShelfKey } from '../types/shelf';
import { useCallback, useMemo } from 'react';
import { useLocalStorageState } from './useLocalStorageState';

const KEY = 'bookShelf.items.v1';

export function useShelves() {
  const [items, setItems] = useLocalStorageState<ShelfEntry[]>([], KEY);

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
        const base: ShelfEntry = {
          ...book,
          shelf,
          addedAt: existing?.addedAt ?? Date.now(),
        };

        const without = prev.filter((x) => x.id !== book.id);
        return [base, ...without];
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

  return { items, add, move, remove, clearAll, getShelfFor };
}
