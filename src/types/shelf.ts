import type { Book } from './book';

export type ShelfKey = 'want' | 'reading' | 'read';

export type ShelfEntry = Book & {
  shelf: ShelfKey;
  addedAt: number;
};
