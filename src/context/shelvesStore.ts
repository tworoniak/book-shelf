import type { Book } from '../types/book';
import type { ShelfEntry, ShelfKey } from '../types/shelf';

export const SHELVES_STORAGE_KEY = 'bookShelf.items.v1';

export type ShelvesStore = {
  items: ShelfEntry[];
  add: (book: Book, shelf: ShelfKey) => void;
  move: (id: string, shelf: ShelfKey) => void;
  remove: (id: string) => void;
  clearAll: () => void;
  getShelfFor: (id: string) => ShelfKey | null;
};
