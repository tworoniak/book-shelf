import type { Book } from '../../types/book';
import type { ShelfKey } from '../../types/shelf';
import BookCard from './BookCard';

type Props = {
  books: Book[];
  onAdd: (book: Book, shelf: ShelfKey) => void;
  onRemove: (id: string) => void;
  getShelfFor: (id: string) => ShelfKey | null;
  onSelect: (id: string) => void;
};

export default function BookGrid({
  books,
  onAdd,
  onRemove,
  getShelfFor,
  onSelect,
}: Props) {
  if (!books.length) {
    return (
      <div className='empty'>
        <div className='empty__title'>No results yet</div>
        <div className='empty__text'>
          Try searching by title, author, or ISBN.
        </div>
      </div>
    );
  }

  return (
    <div className='grid'>
      {books.map((b) => (
        <BookCard
          key={b.id}
          book={b}
          shelf={getShelfFor(b.id)}
          onAdd={onAdd}
          onRemove={onRemove}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
