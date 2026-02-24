import type { Book } from '../../types/book';
import type { ShelfKey } from '../../types/shelf';

type Props = {
  book: Book;
  shelf: ShelfKey | null;
  onAdd: (book: Book, shelf: ShelfKey) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
};

const shelfLabel: Record<ShelfKey, string> = {
  want: 'Want',
  reading: 'Reading',
  read: 'Read',
};

export default function BookCard({
  book,
  shelf,
  onAdd,
  onRemove,
  onSelect,
}: Props) {
  return (
    <article className='card'>
      <div className='card__cover'>
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={`Cover of ${book.title}`} />
        ) : (
          <div className='card__coverFallback'>No cover</div>
        )}

        {shelf && <div className='card__pill'>{shelfLabel[shelf]}</div>}
      </div>

      <div className='card__body'>
        <div className='card__title' title={book.title}>
          <button className='link' onClick={() => onSelect(book.id)}>
            {book.title}
          </button>
        </div>

        <div className='card__authors' title={book.authors.join(', ')}>
          {book.authors.length ? book.authors.join(', ') : 'Unknown author'}
        </div>

        <div className='card__meta'>
          {book.publishedDate ? <span>{book.publishedDate}</span> : <span />}
          {book.pageCount ? <span>{book.pageCount} pages</span> : <span />}
        </div>

        <div className='card__actions'>
          <button className='btn btn--small' onClick={() => onSelect(book.id)}>
            Details
          </button>
          <button
            className='btn btn--small'
            onClick={() => onAdd(book, 'want')}
          >
            Want
          </button>
          <button
            className='btn btn--small'
            onClick={() => onAdd(book, 'reading')}
          >
            Reading
          </button>
          <button
            className='btn btn--small'
            onClick={() => onAdd(book, 'read')}
          >
            Read
          </button>
          {shelf && (
            <button
              className='btn btn--small btn--danger'
              onClick={() => onRemove(book.id)}
            >
              Remove
            </button>
          )}
        </div>

        {(book.previewLink || book.infoLink) && (
          <div className='card__links'>
            {book.previewLink && (
              <a href={book.previewLink} target='_blank' rel='noreferrer'>
                Preview
              </a>
            )}
            {book.infoLink && (
              <a href={book.infoLink} target='_blank' rel='noreferrer'>
                Info
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
